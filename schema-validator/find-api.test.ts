import { findApi } from "./find-api.ts";
import { describe, it } from "https://deno.land/std@0.158.0/testing/bdd.ts";
import { expect } from "https://cdn.skypack.dev/chai@4.3.4?dts";

describe("find-api", () => {
  it("should successfully find root level api", () => {
    const result = findApi([], {
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

    expect(result.definition).to.deep.equal({ GET: {} });
  });

  it("should successfully api with params", () => {
    const result = findApi(
      "/post/duck"
        .substring(1)
        .split("/")
        .filter((section) => section !== ""),
      {
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
      },
    );

    expect(result.definition).to.deep.equal({
      GET: {
        pathParams: "path:/post/:id|method:GET|pathParams",
      },
    });
  });

  it("should successfully api with multiple params", () => {
    const result = findApi("/doc/duck/chicken/pizza".substring(1).split("/"), {
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

    expect(result.definition).to.deep.equal({
      GET: {
        pathParams:
          "path:/doc/:documentationId/:sectionId/:subSectionId|method:GET|pathParams",
      },
    });
  });

  it("should successfully api with multiple empty params", () => {
    const result = findApi("/doc///".substring(1).split("/"), {
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

    expect(result.definition).to.deep.equal({
      GET: {
        pathParams:
          "path:/doc/:documentationId/:sectionId/:subSectionId|method:GET|pathParams",
      },
    });
  });

  it("should successfully standard api", () => {
    const result = findApi("/post".substring(1).split("/"), {
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

    expect(result.definition).to.deep.equal({
      GET: {},
      POST: {
        requestBody: "path:/post|method:POST|requestBody",
      },
    });
  });
  it("should handle edge cases", () => {
    const result = findApi(["doc", "id"], {
      children: {
        post: {
          children: {
            "*": {
              children: {},
              param: "id",
              definition: {
                GET: {
                  pathParams: "path:/post/:id|method:GET|pathParams",
                },
              },
            },
          },
          definition: {
            GET: {
              queryParams: "path:/post|method:GET|queryParams",
            },
          },
        },
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
              definition: {
                GET: {
                  pathParams: "path:/doc/:id|method:GET|pathParams",
                },
              },
            },
          },
          definition: {
            GET: {
              queryParams: "path:/doc|method:GET|queryParams",
            },
          },
        },
      },
    });

    expect(result.definition).to.deep.equal({
      GET: {
        pathParams: "path:/doc/:id|method:GET|pathParams",
      },
    });
  });
});
