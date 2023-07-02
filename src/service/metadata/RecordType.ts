import { Metadata } from './Metadata';
import { PicklistValue } from './PicklistValue';
export interface RecordType extends Metadata {
  active: boolean;
  businessProcess: string;
  compactLayoutAssignment: string;
  description: string;
  label: string;
  picklistValues: RecordTypePicklistValue;
}

export interface RecordTypePicklistValue {
  picklist: string;
  values: PicklistValue;
}
