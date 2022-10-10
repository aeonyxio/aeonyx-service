import { injector } from "../../../injector/mod.ts";
import { DataProvider } from "../../provider/data.ts";
import { GetDocumentationSummaryFunction } from "../../../gen/router.ts";
import { DocumentationSummary } from "../../../gen/interfaces/common/DocumentationSummary.ts";

export const getDocumentationSummary: GetDocumentationSummaryFunction =
  async () => {
    const data = injector.get(DataProvider);
    const docs = await data.docs.find({}).toArray();

    const body: DocumentationSummary = {};

    for (const doc of docs) {
      body[doc.id] = {
        title: doc.title,
        default: doc.default,
        sections: doc.sections,
      };
    }

    return {
      body,
    };
  };
