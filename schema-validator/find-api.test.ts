import { findApi } from "./find-api.ts";
import { describe, it } from "$testing/bdd.ts";
import { expect } from "$chai";

describe("find-api", () => {
  it("should successfully find root level api", () => {
    const pathParams = {};
    const result = findApi(
      "/"
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
      pathParams
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
      pathParams
    );

    expect(result.definition).to.deep.equal({
      GET: {
        pathParams: "path:/post/:id|method:GET|pathParams",
      },
    });
    expect(pathParams).to.deep.equal({ id: "duck" });
  });

  it("should successfully standard api", () => {
    const pathParams = {};
    const result = findApi(
      "/post"
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
      pathParams
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
