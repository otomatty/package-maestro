import JSZip from 'jszip';

export type FieldType = 'text' | 'number' | 'boolean' | 'select';

export interface PresetField {
  id: string;
  keyPath: string;
  label: string;
  type: FieldType;
  selectOptions?: string[];
  defaultValue?: string | number | boolean;
}

export interface AppConfig {
  id: string;
  presetName: string;
  fields: PresetField[];
}

export interface PresetStore {
  activePresetId: string;
  presets: AppConfig[];
}

export const MAX_PRESETS = 5;

export interface FileData {
  name: string;
  content: Record<string, unknown>;
  handle: FileSystemFileHandle | null;
  isZip: boolean;
  zipInstance?: JSZip;
  packageJsonPath?: string;
}

// Extend Window interface for File System Access API
declare global {
  interface Window {
    showOpenFilePicker: (options?: OpenFilePickerOptions) => Promise<FileSystemFileHandle[]>;
    showSaveFilePicker: (options?: SaveFilePickerOptions) => Promise<FileSystemFileHandle>;
  }
  
  interface OpenFilePickerOptions {
    multiple?: boolean;
    excludeAcceptAllOption?: boolean;
    types?: FilePickerAcceptType[];
  }
  
  interface SaveFilePickerOptions {
    suggestedName?: string;
    types?: FilePickerAcceptType[];
  }
  
  interface FilePickerAcceptType {
    description?: string;
    accept: Record<string, string[]>;
  }
  
  interface DataTransferItem {
    getAsFileSystemHandle(): Promise<FileSystemHandle | null>;
  }
}
