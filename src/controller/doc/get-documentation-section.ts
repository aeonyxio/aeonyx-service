import { injector } from "../../../injector/mod.ts";
import { DataProvider } from "../../provider/data.ts";
import { GetDocumentationSectionFunction } from "../../../gen/router.ts";
import { RendererService } from "../../service/renderer.service.ts";

import "https://esm.sh/prismjs@1.27.0/components/prism-typescript?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-bash?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-rust?no-check";
import "https://esm.sh/prism-svelte@0.5.0?no-check";

export const getDocumentationSection: GetDocumentationSectionFunction = async ({
  params,
}) => {
  const { documentationId, sectionId, subSectionId } = params;
  const data = injector.get(DataProvider);
  const renderer = injector.get(RendererService);
  const doc = await data.docs.findOne({ id: documentationId });
  const docSection = await data.docSections.findOne({
    documentationId,
    sectionId,
    subSectionId,
  });

  if (doc === undefined || docSection === undefined) {
    throw new Error();
  }

  const body = {
    documentationTitle: doc.title,
    sectionTitle: doc.sections[sectionId].title,
    subSectionTitle: doc.sections[sectionId].subSections[subSectionId].title,
    html: renderer.render(docSection.markdown),
  };

  return {
    body,
  };
};
