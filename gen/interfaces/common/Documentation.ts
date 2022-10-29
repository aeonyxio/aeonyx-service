export type Documentation = {
  id: string;
  title: string;
  default: string;
  sections: {
    [key: string]: {
      title: string;
      subSections: { [key: string]: { title: string } };
    };
  };
};
