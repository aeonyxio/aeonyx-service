import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { createApiRecords } from "./create-api-records.ts";
import { findApi } from "./find-api.ts";
import { Validator } from "./validator.ts";
import { Specification } from "./specification.ts";
import { extractParams } from "./extract-params.ts";

export const registerSchemaValidator = (
  app: Application,
  schemas: Specification[] | Specification,
) => {
  if (!Array.isArray(schemas)) schemas = [schemas];
  const validator = new Validator();
  const apis = createApiRecords(schemas, validator);

  app.use(async (context, next) => {
    const sections = context.request.url.pathname === "/"
      ? []
      : context.request.url.pathname.substring(1).split("/");

    const definition = findApi(sections, apis).definition![
      context.request.method
    ];

    if (definition.pathParams) {
      const pathParams: Record<string, string> = extractParams(
        definition.pathParams,
        context.request.url.pathname,
      );
      const valid = validator.ajv.validate(definition.pathParams, pathParams!);
      if (!valid) {
        context.response.status = 400;
        context.response.body = { errorText: validator.ajv.errorsText() };
        return;
      }
    }

    if (definition.queryParams) {
      const valid = validator.ajv.validate(
        definition.queryParams,
        getQuery(context),
      );
      if (!valid) {
        context.response.body = valid;
        context.throw(400);
      }
    }

    if (definition.requestHeaders) {
      const valid = validator.ajv.validate(
        definition.requestHeaders,
        context.request.headers,
      );
      if (!valid) {
        context.response.body = valid;
        context.throw(400);
      }
    }

    if (definition.requestBody) {
      const valid = validator.ajv.validate(
        definition.requestBody,
        context.request.body,
      );
      if (!valid) {
        context.response.body = valid;
        context.throw(400);
      }
    }

    return await next();
  });
};
