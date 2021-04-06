/**
 * Based on metadataTypeInfos.json
 * TODO: The interfaces are not completed as of yet. More elements might be required
 */

export enum ENABLED_METADATA_TYPES {
  CustomObject,
  PermissionSet
}

export enum WorkspaceStrategy {
  FolderPerSubtype = 'folderPerSubtype'
}

export interface MetadataTypeInfo {
  metadataName: string;
  defaultDirectory: string;
  ext: string;
  nameForMsgs: string;
  nameForMsgsPlural: string;
  decompositionConfig: DecompositionConfig;
  hasVirtualSubtypes: boolean;
  childXmlNames: string[];
  inFolder: boolean;
}

interface DecompositionConfig {
  metadataName: string;
  decompositions: Decomposition[];
  workspaceStrategy: string;
}

interface Decomposition {
  metadataName: string;
  metadataEntityNameElement: string;
  xmlFragmentName: string;
  defaultDirectory: string;
  ext: string;
}
