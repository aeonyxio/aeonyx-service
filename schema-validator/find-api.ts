import type { ApiDefinition } from "./api-definition.type.ts";

export const findApi = (
  remainingSections: string[],
  record: ApiDefinition,
  params: Record<string, string>,
  paramValue?: string,
): ApiDefinition => {
  const currSection = remainingSections.shift();
  if (record.param) params[record.param] = paramValue!;
  if (currSection !== undefined) {
    if (record.children[currSection!]) {
      return findApi(remainingSections, record.children[currSection!], params);
    } else {
      return findApi(
        remainingSections,
        record.children["*"],
        params,
        currSection,
      );
    }
  } else {
    return record;
  }
};
