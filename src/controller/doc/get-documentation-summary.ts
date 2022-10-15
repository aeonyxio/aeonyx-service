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

  const body: DocumentationSummary[] = docs.map((doc) => {
    return {
      id: doc.id,
      default: doc.default,
      title: doc.title,
      description: doc.description,
      thumbnail: doc.thumbnail,
      authors: doc.authors,
      tags: doc.tags,
    };
  });

  return {
    body,
  };
};
