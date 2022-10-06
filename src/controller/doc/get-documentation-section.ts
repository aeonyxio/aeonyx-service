import { injector } from "$injector/mod.ts";
import { DataProvider } from "@/provider/data.ts";
import { GetDocumentationSectionFunction } from "$generated/router.ts";
import { RendererService } from "@/service/renderer.service.ts";

import "https://esm.sh/prismjs@1.27.0/components/prism-typescript?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-bash?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-rust?no-check";
import "https://esm.sh/prism-svelte@0.5.0?no-check";

export const getDocumentationSection: GetDocumentationSectionFunction = async ({
  params,
}) => {
  const data = injector.get(DataProvider);
  const renderer = injector.get(RendererService);
  const docSection = await data.docSections.findOne({ id: params.id });

  if (docSection === undefined) {
    throw new Error();
  }

  return {
    body: renderer.render(docSection.markdown),
  };
};
