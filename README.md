# automate

Bot example for car industry use-case. Currently just ingesting a bunch of Toyota brochures into chroma.

![image](https://github.com/espenh/automate/assets/973493/41b69f2d-f3c3-4298-95c9-48d9ebd5d86e)

* Embeddings stored in [chroma](https://www.trychroma.com/) hosted locally.
* Uses [langchain](https://github.com/langchain-ai/langchainjs) to bridge GPT-4 and vector database.
* A basic custom front-end with message viewer that supports markdown (render tables etc.).

## Development

Create a `.env` file based on `.env.example`.

Start the chroma server:

```sh
docker pull chromadb/chroma
docker run -p 8000:8000 chromadb/chroma
```

Ingest the files in `/docs/` into chroma:

```sh
npm run ingest
```

Start the dev server:

```sh
npm run dev
```

Then open http://localhost:3000/.
