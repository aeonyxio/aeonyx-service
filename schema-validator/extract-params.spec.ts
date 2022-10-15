import { describe, it } from "https://deno.land/std@0.158.0/testing/bdd.ts";
import { expect } from "https://cdn.skypack.dev/chai@4.3.4?dts";
import { extractParams } from "./extract-params.ts";

describe("extract-params", () => {
  it("should handle a simple url", () => {
    const result = extractParams(
      "path:/post/:id|method:GET|pathParams",
      "/post/hello",
    );

    expect(result).to.deep.equal({
      id: "hello",
    });
  });

  it("should handle a complex url", () => {
    const result = extractParams(
      "path:/doc/:documentationId/:sectionId/:subSectionId|method:GET|pathParams",
      "/doc/duck/chicken/pizza",
    );

    expect(result).to.deep.equal({
      documentationId: "duck",
      sectionId: "chicken",
      subSectionId: "pizza",
    });
  });
});
