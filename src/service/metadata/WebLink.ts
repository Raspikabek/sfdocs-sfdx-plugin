import { Metadata } from './Metadata';

export interface WebLink extends Metadata {
  availability: 'online' | 'offline';
  description: string;
  displayType: 'link' | 'button' | 'massActionButton';
  encodingKey: string; // TODO: define encoding interface
  hasMenuBar: boolean;
  hasScrollbards: boolean;
  hasToolbar: boolean;
  height: number;
  isResizable: boolean;
  linkType: 'url' | 'sControl' | 'javascript' | 'page' | 'flow';
  masterLabel: string;
  openType:
    | 'newWindow'
    | 'sidebar'
    | 'noSidebar'
    | 'replace'
    | 'onClickJavaScript';
  page: string;
  position: 'fullScreen' | 'none' | 'topLeft';
  protected: boolean;
  requireRowSelections: boolean;
  scontrol: string;
  showsLocalStorage: boolean;
  showsStatus: boolean;
  url: string;
  width: number;
}
