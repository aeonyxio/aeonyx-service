import { Application as OakApplication } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { router } from "../gen/router.ts";
import { registerSchemaValidator } from "../schema-validator/mod.ts";
import { PORT } from "./config.ts";
import { PostController } from "./controller/post/controller.ts";
import { DocController } from "./controller/doc/controller.ts";
import { DataProvider } from "./provider/data.ts";
import { injector } from "../injector/mod.ts";
import { join } from "https://deno.land/std@0.156.0/path/win32.ts";

export class Application {
  app: OakApplication;

  constructor() {
    this.app = new OakApplication();
  }

  async init() {
    await injector.get(DataProvider).init();
    injector.get(PostController).init();
    injector.get(DocController).init();

    registerSchemaValidator(this.app, [
      JSON.parse(await Deno.readTextFile(join("../schema", "api.json"))),
      JSON.parse(await Deno.readTextFile(join("../schema", "objects.json"))),
    ]);

    this.app.use(router.routes());
    this.app.use(router.allowedMethods());
    this.app.addEventListener("listen", ({ hostname, port, secure }) => {
      console.log(
        `Listening on: ${secure ? "https://" : "http://"}${
          hostname ?? "localhost"
        }:${port}`
      );
    });
  }

  async start() {
    await this.app.listen({ port: PORT });
  }
}
