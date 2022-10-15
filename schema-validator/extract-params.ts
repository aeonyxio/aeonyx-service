export const extractParams = (definition: string, url: string) => {
  const params: Record<string, string> = {};

  const template = definition.split("|")[0].substring(5).split("/");

  url.split("/").forEach((value, index) => {
    if (template[index].startsWith(":")) {
      params[template[index].substring(1)] = value;
    }
  });

  return params;
};
