import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { join } from "https://deno.land/std@0.156.0/path/mod.ts";
import { createApiRecords } from "./create-api-records.ts";
import { findApi } from "./find-api.ts";
import { Validator } from "./validator.ts";

export const registerSchemaValidator = async (
  app: Application,
  schemaDirPath: string
) => {
  const validator = new Validator();
  const apiSchemaFile = join(schemaDirPath, "api.json");
  const apiSchema = JSON.parse(await Deno.readTextFile(apiSchemaFile));
  const apis = createApiRecords(apiSchema, validator);

  app.use(async (context, next) => {
    const sections = context.request.url.pathname
      .substring(1)
      .split("/")
      .filter((section) => section !== "");

    const pathParams: Record<string, string> = {};
    const definition = findApi(sections, apis, pathParams).definition[
      context.request.method
    ];

    if (definition.pathParams) {
      const valid = validator.ajv.validate(definition.pathParams, pathParams);
      if (!valid) {
        context.response.status = 400;
        context.response.body = { errorText: validator.ajv.errorsText() };
        return;
      }
    }

    if (definition.queryParams) {
      const valid = validator.ajv.validate(
        definition.queryParams,
        getQuery(context)
      );
      if (!valid) {
        context.response.body = valid;
        context.throw(400);
      }
    }

    if (definition.requestHeaders) {
      const valid = validator.ajv.validate(
        definition.requestHeaders,
        context.request.headers
      );
      if (!valid) {
        context.response.body = valid;
        context.throw(400);
      }
    }

    if (definition.requestBody) {
      const valid = validator.ajv.validate(
        definition.requestBody,
        context.request.body
      );
      if (!valid) {
        context.response.body = valid;
        context.throw(400);
      }
    }

    return await next();
  });
};
