import { findApi } from "./find-api.ts";
import { describe, it } from "https://deno.land/std@0.158.0/testing/bdd.ts";
import { expect } from "https://cdn.skypack.dev/chai@4.3.4?dts";

describe("find-api", () => {
  it("should successfully find root level api", () => {
    const pathParams = {};
    const result = findApi(
      [],
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
      pathParams,
    );

    expect(result.definition).to.deep.equal({ GET: {} });
    expect(pathParams).to.deep.equal({});
  });

  it("should successfully api with params", () => {
    const pathParams = {};
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
      pathParams,
    );

    expect(result.definition).to.deep.equal({
      GET: {
        pathParams: "path:/post/:id|method:GET|pathParams",
      },
    });
    expect(pathParams).to.deep.equal({ id: "duck" });
  });

  it("should successfully api with multiple params", () => {
    const pathParams = {};
    const result = findApi(
      "/doc/duck/chicken/pizza".substring(1).split("/"),
      {
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
      },
      pathParams,
    );

    expect(result.definition).to.deep.equal({
      GET: {
        pathParams:
          "path:/doc/:documentationId/:sectionId/:subSectionId|method:GET|pathParams",
      },
    });
    expect(pathParams).to.deep.equal({
      documentationId: "duck",
      sectionId: "chicken",
      subSectionId: "pizza",
    });
  });

  it("should successfully api with multiple empty params", () => {
    const pathParams = {};
    const result = findApi(
      "/doc///".substring(1).split("/"),
      {
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
      },
      pathParams,
    );

    expect(result.definition).to.deep.equal({
      GET: {
        pathParams:
          "path:/doc/:documentationId/:sectionId/:subSectionId|method:GET|pathParams",
      },
    });
    expect(pathParams).to.deep.equal({
      documentationId: "",
      sectionId: "",
      subSectionId: "",
    });
  });

  it("should successfully standard api", () => {
    const pathParams = {};
    const result = findApi(
      "/post".substring(1).split("/"),
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
      pathParams,
    );

    expect(result.definition).to.deep.equal({
      GET: {},
      POST: {
        requestBody: "path:/post|method:POST|requestBody",
      },
    });
    expect(pathParams).to.deep.equal({});
  });
});
