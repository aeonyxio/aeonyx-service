export type ApiDefinition = {
  param?: string;
  definition?: any;
  children: Record<string, ApiDefinition>;
};
