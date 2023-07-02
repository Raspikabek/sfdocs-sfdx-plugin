/**
 * TODO: The interfaces are not completed as of yet. More elements might be required
 */

export enum WorkspaceStrategy {
  FolderPerSubtype = 'folderPerSubtype',
  NonDecomposed = 'nonDecomposed',
  InFolderMetadataType = 'inFolderMetadataType',
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
  strategy: string;
  workspaceStrategy: string;
}

interface Decomposition {
  metadataName: string;
  metadataEntityNameElement: string;
  xmlFragmentName: string;
  defaultDirectory: string;
  ext: string;
}
