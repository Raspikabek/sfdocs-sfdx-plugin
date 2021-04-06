export interface FieldSetItem {
  field: string;
  isFieldManaged: boolean;
  isRequired: boolean;
}

export interface FieldSet {
  availableFields: FieldSetItem[];
  description: string;
  displayedFields: FieldSetItem[];
  label: string;
}
