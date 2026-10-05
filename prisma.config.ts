import { definePrismaConfig } from "prisma/config";

export default definePrismaConfig({
  skills: {
    agents: ["claude", "cursor", "agents", "devin"],
  },
  orm: {
    adapter: {
      provider: "better-sqlite3",
      url: "file:./dev.db",
    },
    family: "sqlite",
    target: {
      generator: "prisma-client-js",
      output: "./src/generated/prisma",
    },
    schema: {
      path: "./prisma/schema.prisma",
    },
  },
});