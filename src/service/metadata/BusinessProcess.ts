import { Metadata } from './Metadata';

export interface BusinessProcess extends Metadata {
  description: string;
  isActive: boolean;
  namespacePrefix: string;
  values: string[];
}
