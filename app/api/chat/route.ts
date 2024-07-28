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
    temperature: 0,
  });

  const rephrasingModel = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0,
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
        "When the image format is like this /example.png, /example.webp and etc dont include http or https and domain, use the URL exactly as it appears in the src attribute of the Image element. " +
        "If user ask where to see the Barangay Banaba East location dont include the iframe tag and use this url to view the Barangay Banaba East in Google Map url:\n https://www.google.com/maps/place/BANABA+EAST,+BARANGAY+HALL/@13.8131099,121.0643702,17z/data=!3m1!4b1!4m6!3m5!1s0x33bd0fcd69c6b5a5:0x336c8e16b2e275ee!8m2!3d13.8131047!4d121.0669451!16s%2Fg%2F11c51v_7jj?entry=ttu" +
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
