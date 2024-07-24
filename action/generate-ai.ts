"use server";

import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { DocumentInterface } from "@langchain/core/documents";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { getEmbeddingsCollection, getVectorStore } from "@/lib/astradb";
import { getPinnedInquiries } from "@/lib/faq";
import { getDocumentType } from "@/lib/query/admin/document-type";
import { getAnnouncement } from "@/lib/query/admin/announcement";
import { getPrograms } from "@/lib/query/admin/programs";

export const generate = async () => {
  const vectorStore = await getVectorStore();

  (await getEmbeddingsCollection()).deleteAll();

  const pinnedInquiries = await getPinnedInquiries();
  const documentType = await getDocumentType();
  const announcement = await getAnnouncement();
  const programs = await getPrograms();

  const dateTimeFormatter = Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const pinnedInquiriesDocs = [
    {
      pageContent: JSON.stringify(
        pinnedInquiries.map((item) => ({
          question: item.message,
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

  const docAnnouncement = [
    {
      pageContent: JSON.stringify(
        announcement?.map((item) => ({
          about: item.about,
          photo: item.photo,
          dateUploaded: dateTimeFormatter.format(item.createdAt),
        }))
      ),
      metadata: { url: "user/announcement" },
    },
  ];

  const docPrograms = [
    {
      pageContent: JSON.stringify(
        programs?.map((item) => ({
          about: item.about,
          photo: item.photo,
          dateUploaded: dateTimeFormatter.format(item.createdAt),
        }))
      ),
      metadata: { url: "user/programs" },
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

  const allDocs = [
    ...docs,
    ...pinnedInquiriesDocs,
    ...documentTypesDocs,
    ...docAnnouncement,
    ...docPrograms,
  ];

  await vectorStore.addDocuments(allDocs);
};
