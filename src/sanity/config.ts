import { defineConfig } from "sanity";
import { schemaTypes } from "./schemaTypes";
import { projectId, dataset } from "./env";

export const sanityConfig = defineConfig({
  name: "default",
  title: "DK Unique Production Studio",
  projectId,
  dataset,
  basePath: "/studio",
  schema: {
    types: schemaTypes,
  },
});
