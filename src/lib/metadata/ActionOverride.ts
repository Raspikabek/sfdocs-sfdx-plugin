export interface ActionOverride {
  actionName: ActionOverrideName;
  coment: string;
  content: string;
  formFactor: string;
  skipRecordTypeSelect: boolean;
  type: ActionOverrideType;
}

export enum ActionOverrideName {
  Accept = 'accept',
  Clone = 'clone',
  Delete = 'delete',
  Edit = 'edit',
  List = 'list',
  New = 'new',
  Tab = 'tab',
  View = 'view'
}
export enum ActionOverrideType {
  Default = 'default',
  Flexipage = 'flexipage',
  LightningComponent = 'lightningcomponent',
  Scontrol = 'scontrol',
  Standard = 'standard',
  Visualforce = 'visualforce'
}
