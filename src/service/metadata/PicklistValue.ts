/**
 * Metadata API: https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_globalpicklistvalue.htm
 */
import { Metadata } from './Metadata';

export interface GlobalPicklistValue extends Metadata {
  color: string;
  default: boolean;
  description: string;
  isActive: boolean;
}
export interface PicklistValue extends Metadata {
  allowEmail: boolean;
  closed: boolean;
  controllingFieldValues: string[];
  converted: boolean;
  cssExposed: boolean;
  forecastCategory: 'omitted' | 'pipeline' | 'bestcase' | 'forecast' | 'Closed';
  highPriority: boolean;
  probability: number;
  reverseRole: string;
  reviewed: boolean;
  won: boolean;
}
