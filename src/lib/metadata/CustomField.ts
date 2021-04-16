/**
 * Metadata API: https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/customfield.htm
 */
import { FieldType, TreatBlanksAs, ValueSet } from './FieldTypes';
import { Metadata } from './Metadata';

export interface CustomField extends Metadata {
  businessOwnerGroup: string;
  businessOwnerUser: string;
  businessStatus: 'active' | 'deprecatecandidate' | 'hidden';
  caseSensitive: boolean;
  complianceGroup: string; // TODO: multipicklist
  customDataType: string;
  defaultValue: string;
  deleteConstraint: 'SetNull' | 'Restrict' | 'Cascade'; // TODO: migrate as enum
  deprecated: boolean;
  description: string;
  displayFormat: string;
  displayLocationInDecimal: boolean;
  encrypted: boolean;
  encryptionScheme: // TODO: migrate as enum
  | 'None'
    | 'ProbabilisticEncryption'
    | 'CaseSensitiveDeterministicEncryption'
    | 'CaseInsensitiveDeterministicEncryption';

  externalDeveloperName: string;
  externalId: boolean;
  fieldManageability: 'locked' | 'DeveloperControlled' | 'SubscriberControlled'; // TODO: migrate as enum
  formula: string;
  formulaTreatBlankAs: TreatBlanksAs;
  globalPicklist: string;
  indexed: boolean;
  inlineHelpText: string;
  isAIPredictionField: boolean;
  isFilteringDisabled: boolean;
  isNameField: boolean;
  isSortingDisabled: boolean;
  label: string;
  length: number;
  lookupFilter: string; // TODO: define LookupFilter interface
  maskChar: string; // TODO: define EncryptedFieldMaskChar enum
  maskType: string; // TODO: define EncryptedFieldMaskType enum
  metadataRelationshipControllingField: string;
  populateExistingRows: boolean;
  precision: number;
  referenceTargetField: string;
  referenceTo: string;
  relationshipLabel: string;
  relationshipName: string;
  relationshipOrder: number;
  reparentableMasterDetail: boolean;
  required: boolean;
  scale: number;
  securityClassification:
    | 'public'
    | 'internal'
    | 'confidentical'
    | 'restricted'
    | 'MissionCritical';
  startingNumber: number;
  stripMarkup: boolean;
  summarizedField: string;
  summaryFilterItems: string; // TODO: define FilterItem interface
  summaryForeignKey: string;
  summaryOperation: string; // TODO: define SummaryOperation enum
  trackFeedHistory: boolean;
  trackHistory: boolean;
  trackTrending: boolean;
  trueValueIndexed: boolean;
  type: FieldType;
  unique: boolean;
  valueSet: ValueSet;
  visibleLines: number;
  writeRequiresMasterRead: boolean;
}
