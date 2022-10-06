import type { ApiDefinition } from "./api-definition.type.ts";
import { Validator } from "./validator.ts";

const createDefinition = (schema: any, path: string, validator: Validator) => {
  const ret: Record<string, Record<string, string>> = {};
  for (const method of Object.getOwnPropertyNames(schema)) {
    const upperMethod = method.toUpperCase();
    ret[upperMethod] = {};
    const idPrefix = `path:${path}|method:${upperMethod}|`;

    if (schema[method].pathParams) {
      const id = `${idPrefix}pathParams`;
      ret[upperMethod].pathParams = id;
      validator.ajv.addSchema(schema[method].pathParams, id);
    }

    if (schema[method].queryParams) {
      const id = `${idPrefix}queryParams`;
      ret[upperMethod].queryParams = id;
      validator.ajv.addSchema(schema[method].queryParams, id);
    }

    if (schema[method].requestHeaders) {
      const id = `${idPrefix}requestHeaders`;
      ret[upperMethod].requestHeaders = id;
      validator.ajv.addSchema(schema[method].requestHeaders, id);
    }

    if (schema[method].requestBody) {
      const id = `${idPrefix}requestBody`;
      ret[upperMethod].requestBody = id;
      validator.ajv.addSchema(schema[method].requestBody, id);
    }
  }
  return ret;
};

export const createApiRecords = (rawJson: any, validator: Validator) => {
  const apis: ApiDefinition = { children: {} };

  for (const path of Object.getOwnPropertyNames(rawJson.paths)) {
    const sections = path
      .substring(1)
      .split("/")
      .filter((section) => section !== "");

    let record = apis;

    if (!sections.length) {
      apis.definition = createDefinition(rawJson.paths[path], path, validator);
    }

    while (sections.length) {
      const section = sections.shift()!;

      const child = record.children[
        section.startsWith(":") ? "*" : section
      ] ?? { children: {} };

      if (sections.length === 0) {
        child.definition = createDefinition(
          rawJson.paths[path],
          path,
          validator
        );

        if (section.startsWith(":")) child.param = section.substring(1);
      }
      record.children[section.startsWith(":") ? "*" : section] = child;
      record = child;
    }
  }

  return apis;
};
