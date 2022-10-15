import type { ApiDefinition } from "./api-definition.type.ts";

export const findApi = (
  remainingSections: string[],
  record: ApiDefinition,
): ApiDefinition => {
  const currSection = remainingSections.shift();
  if (!record) throw new Error("Route not found");
  if (currSection !== undefined) {
    if (record.children[currSection!]) {
      return findApi(remainingSections, record.children[currSection!]);
    } else {
      return findApi(remainingSections, record.children["*"]);
    }
  } else {
    return record;
  }
};
