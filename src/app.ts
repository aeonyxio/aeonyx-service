import { Application as OakApplication } from "$oak/mod.ts";
import { router } from "$generated/router.ts";
import { registerSchemaValidator } from "$schema-validator/mod.ts";
import { PORT } from "@/config.ts";
import { PostController } from "@/controller/post/controller.ts";
import { DocController } from "@/controller/doc/controller.ts";
import { DataProvider } from "@/provider/data.ts";
import { injector } from "$injector/mod.ts";
import { join } from "$std/path/win32.ts";

export class Application {
  app: OakApplication;

  constructor() {
    this.app = new OakApplication();
  }

  async init() {
    await injector.get(DataProvider).init();
    injector.get(PostController).init();
    injector.get(DocController).init();

    await registerSchemaValidator(this.app, join("./schema"));
    this.app.use(router.routes());
    this.app.use(router.allowedMethods());
    // this.app.addEventListener("listen", ({ hostname, port, secure }) => {
    //   console.log(
    //     `Listening on: ${secure ? "https://" : "http://"}${
    //       hostname ?? "localhost"
    //     }:${port}`
    //   );
    // });
  }

  async start() {
    await this.app.listen({ port: PORT });
  }
}
