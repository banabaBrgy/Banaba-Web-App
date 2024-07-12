"use server";

import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { DocumentInterface } from "@langchain/core/documents";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { getEmbeddingsCollection, getVectorStore } from "@/lib/astradb";
import { getPinnedInquiries } from "@/lib/faq";

export const generate = async () => {
  const vectorStore = await getVectorStore();

  (await getEmbeddingsCollection()).deleteAll();

  const pinnedInquiries = await getPinnedInquiries();

  const pinnedInquiriesDocs = [
    { pageContent: JSON.stringify(pinnedInquiries), metadata: { url: "faq" } },
  ];

  const loader = new DirectoryLoader(
    "app/(main)/(landing)",
    {
      ".tsx": (path) => new TextLoader(path),
    },
    true
  );

  const removeFaq = (await loader.load()).filter(
    (doc) => !doc.metadata.source.includes("faq")
  );

  const docs = removeFaq
    .filter(
      (doc) =>
        doc.metadata.source.endsWith("page.tsx") ||
        doc.metadata.source.endsWith("swiper-officials.tsx")
    )
    .map((doc: DocumentInterface) => {
      const url = doc.metadata.source
        .replace(/\\/g, "/")
        .split("/app/(main)/(landing)")[1]
        .split("/page.tsx")[0]
        .replace("/(home)", "/")
        .replace("/_components/swiper-officials.tsx", "");

      const pageContentTrimmed = doc.pageContent
        .replace(/^import.*$/gm, "")
        .replace(/ className(["']).*?\1| className={.*?}/g, "")
        .replace(/^\s*[\r]/gm, "")
        .trim();

      return {
        pageContent: pageContentTrimmed,
        metadata: { url },
      };
    });

  await vectorStore.addDocuments([...docs, ...pinnedInquiriesDocs]);
};
