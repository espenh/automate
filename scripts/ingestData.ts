import { OpenAIEmbeddings } from '@langchain/openai';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { getDocument, version } from "pdfjs-dist";
import { Chroma } from "@langchain/community/vectorstores/chroma"
import fs from "fs";

// This script ingests all pdfs in the docs folder into Chroma.

const docsFolder = 'docs';

export const run = async () => {
  try {
    // Check that the docs folder exists.
    const fullDocsFolderPath = `${process.cwd()}/${docsFolder}`;
    if (!fs.existsSync(fullDocsFolderPath)) {
      throw new Error('The directory does not exist: ' + fullDocsFolderPath);
    }

    // Load all pdfs in the docs folder.
    const directoryLoader = new DirectoryLoader(docsFolder, {
      '.pdf': (path) => new PDFLoader(path, {
        pdfjs: async () => {
          return {
            getDocument, version
          }
        }
      }),
    });

    console.log("Loading pdfs")
    const rawDocs = await directoryLoader.load();

    /* Split text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2000,
      chunkOverlap: 400,
    });

    console.log("Splitting documents")
    const docs = await textSplitter.splitDocuments(rawDocs);

    const embeddings = new OpenAIEmbeddings({
      modelName: 'text-embedding-3-large',
      dimensions: 1024,
    });

    console.log("Ingesting documents into Chroma")
    await Chroma.fromDocuments(docs, embeddings, {
      collectionName: "automate",
      url: "http://localhost:8000",
      collectionMetadata: {
        "hnsw:space": "cosine" // https://docs.trychroma.com/usage-guide#changing-the-distance-function
      }
    });

  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to ingest your data');
  }
};

(async () => {
  await run();
  console.log('Ingestion complete');
})();
