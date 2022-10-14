import { injector } from "../../../injector/mod.ts";
import { DataProvider } from "../../provider/data.ts";
import { GetDocumentationSummaryFunction } from "../../../gen/router.ts";
import { DocumentationSummary } from "../../../gen/interfaces/common/DocumentationSummary.ts";

export const getDocumentationSummary: GetDocumentationSummaryFunction = async ({
  query,
}) => {
  const data = injector.get(DataProvider);
  const search: { author?: string; hidden: false } = {
    hidden: false,
  };
  if (query.author) search.author = query.author;
  const docs = await data.docs.find({ hidden: false }).toArray();

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
