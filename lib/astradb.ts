import { AstraDBVectorStore } from "@langchain/community/vectorstores/astradb";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { DataAPIClient } from "@datastax/astra-db-ts";

const endpoint = process.env.ASTRA_DB_ENDPOINT || "";
const token = process.env.ASTRA_DB_APPLICATION_TOKEN || "";
const collection = process.env.ASTRA_DB_COLLECTION || "";

export async function getVectorStore() {
  return AstraDBVectorStore.fromExistingIndex(
    new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-embedding-2-preview",
    }),
    {
      token,
      endpoint,
      collection,
      collectionOptions: {
        vector: {
          dimension: 3072,
          metric: "cosine",
        },
      },
    }
  );
}

export async function getEmbeddingsCollection() {
  const client = new DataAPIClient();
  const db = client.db(endpoint, { token });
  return db.collection(collection);
}
