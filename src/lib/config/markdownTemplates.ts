export interface ICustomObjectTemplate {
  fullName: string;
  actionOverrides: ActionOverrides;
  customFields: CustomFields;
}

export interface ActionOverrides {
  title: Title;
  content: ActionOverridesContent;
}

export interface ActionOverridesContent {
  format: string;
  customFields: string[];
}

export interface Title {
  value: string;
  format: string;
}

export interface CustomFields {
  title: Title;
  content: CustomFieldsContent;
}

export interface CustomFieldsContent {
  format: string;
  customFields: string[];
}
