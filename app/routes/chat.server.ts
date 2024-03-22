import { OpenAIEmbeddings } from "@langchain/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";

// Note: Remix tried to include stuff from the Chroma module while bulding the frontend,
// so this method has to be in a .server.ts file to avoid that. https://remix.run/docs/en/main/guides/gotchas#server-code-in-client-bundles

export async function getVectorStore() {
  return Chroma.fromExistingCollection(
    new OpenAIEmbeddings({
      modelName: "text-embedding-3-large",
      dimensions: 1024,
    }),
    {
      collectionName: "automate",
      url: "http://localhost:8000",
      collectionMetadata: {
        "hnsw:space": "cosine",
      },
      numDimensions: 1024,
    }
  );
}
