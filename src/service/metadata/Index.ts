export interface Index {
  fields: IndexField[];
  label: string;
}

export interface IndexField {
  name: string;
  sortDirection: string;
}
