import { describe, it } from "https://deno.land/std@0.158.0/testing/bdd.ts";
import { expect } from "https://cdn.skypack.dev/chai@4.3.4?dts";
import { createApiRecords } from "./create-api-records.ts";
import { Validator } from "./validator.ts";

describe("create-api-records", () => {
  it("should work", () => {
    const result = createApiRecords(
      {
        info: {
          title: "Aeonyx.io tech blog API",
          description: "This is a simple blog API",
          version: "1.0.0",
        },
        servers: [
          {
            url: "https://aeonyx.io/api",
          },
        ],
        tags: [
          {
            name: "post",
            description: "Bog post",
            externalDocs: {
              description: "Blog online at",
              url: "http://aeonyx.io",
            },
          },
        ],
        paths: {
          "/": {
            get: {
              tags: ["post"],
              summary: "root level get",
              operationId: "getRoot",
              responseBody: {
                $ref: "objects.json#/RootGet",
              },
            },
          },
          "/post/:id": {
            get: {
              tags: ["post"],
              summary: "Get a blog post",
              description: "Get a blog post by a given ID",
              operationId: "getPostById",
              pathParams: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                  },
                },
              },
              responseBody: {
                $ref: "objects.json#/Post",
              },
            },
          },
          "/post": {
            get: {
              tags: ["post"],
              summary: "Get a summary of blog posts",
              description: "Get a summary of blog posts",
              operationId: "getPostsSummary",
              responseBody: {
                $ref: "objects.json#/PostsSummary",
              },
            },
            post: {
              tags: ["post"],
              summary: "Add new posts",
              description: "Add new posts",
              operationId: "addPosts",
              requestBody: {
                type: "array",
                items: {
                  $ref: "objects.json#/Post",
                },
              },
            },
          },
        },
      },
      new Validator(),
    );

    expect(result).to.deep.equal({
      children: {
        post: {
          children: {
            "*": {
              children: {},
              definition: {
                GET: {
                  pathParams: "path:/post/:id|method:GET|pathParams",
                },
              },
              param: "id",
            },
          },
          definition: {
            GET: {},
            POST: {
              requestBody: "path:/post|method:POST|requestBody",
            },
          },
        },
      },
      definition: {
        GET: {},
      },
    });
  });
  it("should work with multiple path params", () => {
    const result = createApiRecords(
      {
        paths: {
          "/doc/:documentationId/:sectionId/:subSectionId": {
            get: {
              tags: ["doc"],
              description: "Get a specific documentation section",
              operationId: "getDocumentationSection",
              pathParams: {
                type: "object",
                properties: {
                  documentationId: {
                    pattern: "^[a-z0-9-]+$",
                    type: "string",
                  },
                  sectionId: {
                    pattern: "^[a-z0-9-]+$",
                    type: "string",
                  },
                  subSectionId: {
                    pattern: "^[a-z0-9-]+$",
                    type: "string",
                  },
                },
                required: ["documentationId", "sectionId", "subSectionId"],
              },
              responseBody: {
                $ref: "objects.json#/Documentation",
              },
            },
          },
        },
      },
      new Validator(),
    );

    expect(result).to.deep.equal({
      children: {
        doc: {
          children: {
            "*": {
              children: {
                "*": {
                  children: {
                    "*": {
                      children: {},
                      param: "subSectionId",
                      definition: {
                        GET: {
                          pathParams:
                            "path:/doc/:documentationId/:sectionId/:subSectionId|method:GET|pathParams",
                        },
                      },
                    },
                  },
                  param: "sectionId",
                },
              },
              param: "documentationId",
            },
          },
        },
      },
    });
  });
});
