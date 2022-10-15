import { injector } from "../../../injector/mod.ts";
import { DataProvider } from "../../provider/data.ts";
import { GetDocumentationFunction } from "../../../gen/router.ts";
import { Documentation } from "../../../gen/interfaces/common/Documentation.ts";

export const getDocumentation: GetDocumentationFunction = async ({
  params,
}) => {
  const data = injector.get(DataProvider);

  const doc = await data.docs.findOne({ id: params.id });

  if (doc === undefined) {
    throw new Error();
  }

  const body: Documentation = {
    id: doc.id,
    title: doc.title,
    default: doc.default,
    sections: doc.sections,
  };

  return {
    body,
  };
};
