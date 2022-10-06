import { describe, it } from "$testing/bdd.ts";
import { expect } from "$chai";
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
      new Validator()
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
});
