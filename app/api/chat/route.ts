import {
  LangChainStream,
  StreamingTextResponse,
  Message as VercelChatMessage,
} from "ai";
import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  PromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { getVectorStore } from "@/lib/astradb";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const chatHistory = messages
    .slice(0, -1)
    .map((m: VercelChatMessage) =>
      m.role === "user" ? new HumanMessage(m.content) : new AIMessage(m.content)
    );

  const currentMessageContent = messages.at(-1).content;

  const { stream, handlers } = LangChainStream();

  const chatModel = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    streaming: true,
    callbacks: [handlers],
  });

  const rephrasingModel = new ChatOpenAI({
    modelName: "gpt-4o-mini",
  });

  const retriever = (await getVectorStore()).asRetriever();

  const rephrasePrompt = ChatPromptTemplate.fromMessages([
    new MessagesPlaceholder("chat_history"),
    ["user", "{input}"],
    [
      "user",
      "Given the above conversation, generate a search query to look up in order to get information relevant to the current question. " +
        "Don't leave out any relevant keywords. Only return the query and no other text.",
    ],
  ]);

  const historyAwareRetrievalChain = await createHistoryAwareRetriever({
    llm: rephrasingModel,
    retriever,
    rephrasePrompt,
  });

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a helpful Assistant for a Barangay Banaba Web-based management system. " +
        "Whenever the information has images and links, provide links and display images to pages that contain more information about the topic from the given context. " +
        "Only answer questions related to Barangay Banaba information. " +
        "If the question is not related to Barangay Banaba, refrain from answering. " +
        "When displaying the images coming from /home, /services, /about-us and /health-center just use the URL exactly as provided in the image src attribute. Do not modify the URL by adding https, domains, or any other prefix/suffix. ." +
        "Ignore any code snippets and technical implementation details. " +
        "Format your messages in react markdown format.\n\n" +
        "Context:\n{context}" +
        "Please answer in the same language as the user's query.",
    ],
    new MessagesPlaceholder("chat_history"),
    ["user", "{input}"],
  ]);

  const combineDocsChain = await createStuffDocumentsChain({
    llm: chatModel,
    prompt,
    documentPrompt: PromptTemplate.fromTemplate(
      "Page URL: {url}\n\nPage Content:\n{page_content}"
    ),
    documentSeparator: "\n--------\n",
  });

  const retrieverChain = await createRetrievalChain({
    combineDocsChain,
    retriever: historyAwareRetrievalChain,
  });

  retrieverChain.invoke({
    input: currentMessageContent,
    chat_history: chatHistory,
  });

  return new StreamingTextResponse(stream);
}
