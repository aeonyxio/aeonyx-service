import { injector } from "../../../injector/mod.ts";
import { DataProvider } from "../../provider/data.ts";
import { GetDocumentationSectionFunction } from "../../../gen/router.ts";
import { RendererService } from "../../service/renderer.service.ts";

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

  const rendered = renderer.render(docSection.markdown);

  const body = {
    documentationTitle: doc.title,
    sectionTitle: doc.sections[sectionId].title,
    subSectionTitle: doc.sections[sectionId].subSections[subSectionId].title,
    contents: rendered.contents,
    html: rendered.html,
  };

  return {
    body,
  };
};
