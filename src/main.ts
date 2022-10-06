import { Application } from "@/app.ts";

const app = new Application();
await app.init();
await app.start();
