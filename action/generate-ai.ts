"use server";

import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { DocumentInterface } from "@langchain/core/documents";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { getEmbeddingsCollection, getVectorStore } from "@/lib/astradb";
import { getPinnedInquiries } from "@/lib/faq";
import { getDocumentType } from "@/lib/query/admin/document-type";

export const generate = async () => {
  const vectorStore = await getVectorStore();

  (await getEmbeddingsCollection()).deleteAll();

  const pinnedInquiries = await getPinnedInquiries();
  const documentType = await getDocumentType();

  const pinnedInquiriesDocs = [
    {
      pageContent: JSON.stringify(
        pinnedInquiries.map((item) => ({
          question: item.subject,
          answer: item.answer,
        }))
      ),
      metadata: { url: "/faq" },
    },
  ];

  const documentTypesDocs = [
    {
      pageContent: JSON.stringify(
        documentType?.map((item) => ({
          document: item.document,
        }))
      ),
      metadata: { url: "/user/services" },
    },
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

  const allDocs = [...docs, ...pinnedInquiriesDocs, ...documentTypesDocs];

  await vectorStore.addDocuments(allDocs);
};
