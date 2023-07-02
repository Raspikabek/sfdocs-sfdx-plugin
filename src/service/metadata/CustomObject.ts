/**
 * Metadata API: https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/customobject.htm
 */
import { ActionOverride } from './ActionOverride';
import { BusinessProcess } from './BusinessProcess';
import { CompactLayout } from './CompactLayout';
import { CustomField } from './CustomField';
import { CustomSettingsType, CustomSettingsVisibility } from './CustomSettings';
import { DeploymentStatus } from './DeploymentStatus';
import { FieldSet } from './FieldSet';
import { Gender, SharingModel, StartsWith } from './FieldTypes';
import { HistoryRetentionPolicy } from './HistoryRetentionPolicy';
import { Index } from './Index';
import { Metadata } from './Metadata';
import {
  PlatformEventPublishBehavior,
  PlatformEventType
} from './PlatformEvent';
import { RecordType } from './RecordType';
import { SetupObjectVisibility } from './SetupObjectVisibility';
import { SharingReason } from './SharingReason';
import { SharingRecalculation } from './SharingRecalculation';
import { WebLink } from './WebLink';

export interface CustomObject extends Metadata {
  actionOverrides: Array<Partial<ActionOverride>>;
  allowInChatterGroups: boolean;
  businessProcesses: Array<Partial<BusinessProcess>>;
  compactLayoutAssignment: string;
  compactLayouts: Array<Partial<CompactLayout>>;
  customHelp: string;
  customHelpPage: string;
  customSettingsType: CustomSettingsType;
  customSettingsVisibility: CustomSettingsVisibility;
  deploymentStatus: DeploymentStatus;
  deprecated: boolean;
  description: string;
  enableActivies: boolean;
  enableBulkApi: boolean;
  enableDivisions: boolean;
  enableEnhancedLookup: boolean;
  enableFeeds: boolean;
  enableHistory: boolean;
  enableReports: boolean;
  enableSearch: boolean;
  enableSharing: boolean;
  enableStreamingApi: boolean;
  eventType: PlatformEventType;
  externalDataSource: string;
  externalName: string;
  externalRepository: string;
  externalSharingModel: SharingModel;
  fields: CustomField[];
  fieldSets: FieldSet;
  gender: Gender;
  household: boolean;
  historyRetentionPolicy: HistoryRetentionPolicy;
  indexes: Index[];
  label: string;
  listViews: string[]; // TODO: define ListView[] interface
  namedFilter: string[]; // TODO: define NamedFilter interface
  nameField: CustomField;
  pluralLabel: string;
  profileSearchLayouts: string; // TODO: define ProfileSearchLayouts interface
  publishBehavior: PlatformEventPublishBehavior;
  recordTypes: RecordType[];
  recordTypeTrackFeedHistory: boolean;
  recordTypeTrackHistory: boolean;
  searchLayouts: string[]; // TODO: define SearchLayouts interface
  sharingModel: SharingModel;
  sharingReasons: SharingReason[];
  sharingRecalculations: SharingRecalculation[];
  startsWith: StartsWith;
  validationRules: string; // TODO: define ValidationRules interface
  visibility: SetupObjectVisibility;
  webLinks: WebLink[];
}
