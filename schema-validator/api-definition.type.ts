export type ApiDetails = Record<
  string,
  {
    pathParams?: string;
    queryParams?: string;
    requestHeaders?: string;
    requestBody?: string;
  }
>;

export type ApiDefinition = {
  param?: string;
  definition?: ApiDetails;
  children: Record<string, ApiDefinition>;
};
