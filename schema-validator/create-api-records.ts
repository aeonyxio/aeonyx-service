import type { ApiDefinition, ApiDetails } from "./api-definition.type.ts";
import { Path, Specification } from "./specification.ts";
import { Validator } from "./validator.ts";

const createDefinition = (
  schema: Path,
  path: string,
  validator: Validator,
): ApiDetails => {
  const ret: ApiDetails = {};
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

export const createApiRecords = (
  schemas: Specification[],
  validator: Validator,
) => {
  const apis: ApiDefinition = { children: {} };

  for (const schema of schemas) {
    if (schema.paths) {
      for (const path of Object.getOwnPropertyNames(schema.paths)) {
        const sections = path
          .substring(1)
          .split("/")
          .filter((section) => section !== "");

        let record = apis;

        if (!sections.length) {
          apis.definition = createDefinition(
            schema.paths[path],
            path,
            validator,
          );
        }

        while (sections.length) {
          const section = sections.shift()!;

          const child = record.children[
            section.startsWith(":") ? "*" : section
          ] ?? { children: {} };

          if (section.startsWith(":")) {
            child.param = section.substring(1);
          }

          if (sections.length === 0) {
            child.definition = createDefinition(
              schema.paths[path],
              path,
              validator,
            );
          }
          record.children[section.startsWith(":") ? "*" : section] = child;
          record = child;
        }
      }
    }
    if (schema.components) {
      for (
        const defName of Object.getOwnPropertyNames(
          schema.components.definitions,
        )
      ) {
        validator.ajv.addSchema(
          schema.components.definitions[defName],
          `${schema.components.referenceId}#${defName}`,
        );
      }
    }
  }

  return apis;
};
