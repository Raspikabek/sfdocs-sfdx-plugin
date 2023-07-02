/**
 * Metadata API: https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_field_types
 */

export interface CustomField {
  fullname: string;
}

export enum DeleteConstraint {
  SetNull,
  Restrict,
  Cascade
}

export enum DeploymentStatus {
  InDevelopment,
  Deployed
}

export enum FieldType {
  AutoNumber,
  Lookup,
  MasterDetail,
  MetadataRelationship,
  Checkbox,
  Currency,
  Date,
  DateTime,
  Email,
  EncryptedText,
  ExternalLookup,
  IndirectLookup,
  Number,
  Percent,
  Phone,
  Picklist,
  MultiselectPicklist,
  Summary,
  Text,
  TextArea,
  LongTextArea,
  Url,
  Hierarchy,
  File,
  Html,
  Location,
  Time
}

export enum Gender {
  Masculine,
  Feminine,
  Neuter,
  AnimateMasculine,
  ClassI,
  ClassIII,
  ClassV,
  ClassVII,
  ClassIX,
  ClassXI,
  ClassXIV,
  ClassXV,
  ClassXVI,
  ClassXVII,
  ClassXVIII
}

export interface Picklist {
  fullname: string;
}

export enum SharingModel {
  Private,
  Read,
  ReadWrite,
  ReadWriteTransfer,
  FullAccess,
  ControlledByParent,
  ControlledByCampaign,
  ControlledByLeadOrContact
}

export enum StartsWith {
  Consonant,
  Vowel,
  Special
}

export enum TreatBlanksAs {
  BlankAsBlank,
  BlankAsZero
}

export interface ValueSetValuesDefinition {
  sorted: boolean;
  value: string; // TODO: review this is correct or is an array of values
}

export interface ValueSettings {
  controllingFieldValue: string[];
  valueName: string;
}

export interface ValueSet {
  controllingField: string;
  restricted: boolean;
  valueSetDefinition: ValueSetValuesDefinition;
  valueSetName: ValueSetValuesDefinition;
  valueSettings: ValueSettings;
}
