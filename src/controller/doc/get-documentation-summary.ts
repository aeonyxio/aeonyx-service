import { injector } from "$injector/mod.ts";
import { DataProvider } from "@/provider/data.ts";
import { GetDocumentationSummaryFunction } from "$generated/router.ts";
import { DocSummary } from "$generated/interfaces/common/DocSummary.ts";

export const getDocumentationSummary: GetDocumentationSummaryFunction =
  async () => {
    const data = injector.get(DataProvider);
    const docs = await data.docs.find({}).toArray();

    const body: DocSummary = {};

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
