import { injector } from "../../../injector/mod.ts";
import { DataProvider } from "../../provider/data.ts";
import { GetDocumentationSectionFunction } from "../../../gen/router.ts";
import { RendererService } from "../../service/renderer.service.ts";
import { DocumentationSection } from "../../../gen/interfaces/common/DocumentationSection.ts";
import { DocSectionKey } from "../../../gen/interfaces/common/DocSectionKey.ts";

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

  let previous: DocSectionKey | undefined;
  let next: DocSectionKey | undefined;
  let match = false;

  loop1: for (const currSectionId of Object.keys(doc.sections)) {
    for (const currSubSectionId of Object.keys(
      doc.sections[currSectionId].subSections
    )) {
      if (
        doc.id === documentationId &&
        currSectionId === sectionId &&
        currSubSectionId === subSectionId
      ) {
        match = true;
      } else if (match) {
        next = {
          documentationId: doc.id,
          sectionId: currSectionId,
          subSectionId: currSubSectionId,
        };
        break loop1;
      } else {
        previous = {
          documentationId: doc.id,
          sectionId: currSectionId,
          subSectionId: currSubSectionId,
        };
      }
    }
  }

  const body: DocumentationSection = {
    documentationTitle: doc.title,
    sectionTitle: doc.sections[sectionId].title,
    subSectionTitle: doc.sections[sectionId].subSections[subSectionId].title,
    description: doc.description,
    thumbnail: doc.thumbnail,
    authors: doc.authors,
    tags: doc.tags,
    contents: rendered.contents,
    html: rendered.html,
    previous,
    next,
  };

  return {
    body,
  };
};
