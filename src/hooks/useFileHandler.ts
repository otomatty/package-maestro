import { useState, useCallback } from 'react';
import type { FileData } from '@/types';
import JSZip from 'jszip';
import { get, set, cloneDeep } from 'lodash-es';

export function useFileHandler() {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const readJsonFile = async (file: File, handle: FileSystemFileHandle | null): Promise<FileData> => {
    const text = await file.text();
    const content = JSON.parse(text);
    return {
      name: file.name,
      content,
      handle,
      isZip: false
    };
  };

  const readZipFile = async (file: File, handle: FileSystemFileHandle | null): Promise<FileData> => {
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(file);
    
    // Find package.json in root or first level
    let packageJsonPath: string | null = null;
    let packageJsonContent: Record<string, unknown> | null = null;

    // Check root first
    if (zipContent.files['package.json']) {
      packageJsonPath = 'package.json';
    } else {
      // Check first level directories
      for (const path of Object.keys(zipContent.files)) {
        const parts = path.split('/');
        if (parts.length === 2 && parts[1] === 'package.json') {
          packageJsonPath = path;
          break;
        }
      }
    }

    if (!packageJsonPath) {
      throw new Error('No package.json found in ZIP file');
    }

    const jsonFile = zipContent.files[packageJsonPath];
    const jsonText = await jsonFile.async('text');
    packageJsonContent = JSON.parse(jsonText);

    return {
      name: file.name,
      content: packageJsonContent,
      handle,
      isZip: true,
      zipInstance: zip,
      packageJsonPath
    };
  };

  const openFile = useCallback(async () => {
    setError(null);
    
    // Check for File System Access API support
    if (!('showOpenFilePicker' in window)) {
      setError('Your browser does not support the File System Access API. Please use Chrome, Edge, or another Chromium-based browser.');
      return;
    }

    try {
      setIsLoading(true);
      const [handle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'JSON or ZIP files',
            accept: {
              'application/json': ['.json'],
              'application/zip': ['.zip']
            }
          }
        ]
      });

      const file = await handle.getFile();
      const isZip = file.name.endsWith('.zip');

      if (isZip) {
        const data = await readZipFile(file, handle);
        setFileData(data);
      } else {
        const data = await readJsonFile(file, handle);
        setFileData(data);
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError((err as Error).message || 'Failed to open file');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setError(null);

    const items = e.dataTransfer.items;
    if (!items || items.length === 0) return;

    try {
      setIsLoading(true);
      const item = items[0];
      
      // Try to get file handle for direct save capability
      let handle: FileSystemFileHandle | null = null;
      if ('getAsFileSystemHandle' in item) {
        const fsHandle = await item.getAsFileSystemHandle();
        if (fsHandle && fsHandle.kind === 'file') {
          handle = fsHandle as FileSystemFileHandle;
        }
      }

      const file = item.getAsFile();
      if (!file) {
        throw new Error('Could not read the dropped file');
      }

      const isZip = file.name.endsWith('.zip');

      if (isZip) {
        const data = await readZipFile(file, handle);
        setFileData(data);
      } else if (file.name.endsWith('.json')) {
        const data = await readJsonFile(file, handle);
        setFileData(data);
      } else {
        throw new Error('Please drop a .json or .zip file');
      }
    } catch (err) {
      setError((err as Error).message || 'Failed to process dropped file');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateValue = useCallback((keyPath: string, value: unknown) => {
    if (!fileData) return;

    const newContent = cloneDeep(fileData.content);
    set(newContent, keyPath, value);
    setFileData(prev => prev ? { ...prev, content: newContent } : null);
  }, [fileData]);

  const getValue = useCallback((keyPath: string) => {
    if (!fileData) return undefined;
    return get(fileData.content, keyPath);
  }, [fileData]);

  const saveFile = useCallback(async () => {
    if (!fileData) {
      throw new Error('No file loaded');
    }

    // If no handle, we can't save directly
    if (!fileData.handle) {
      // Fallback to download
      const jsonString = JSON.stringify(fileData.content, null, 2);
      
      if (fileData.isZip && fileData.zipInstance && fileData.packageJsonPath) {
        fileData.zipInstance.file(fileData.packageJsonPath, jsonString);
        const blob = await fileData.zipInstance.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileData.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileData.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      return;
    }

    // Direct save using File System Access API
    const writable = await fileData.handle.createWritable();

    if (fileData.isZip && fileData.zipInstance && fileData.packageJsonPath) {
      const jsonString = JSON.stringify(fileData.content, null, 2);
      fileData.zipInstance.file(fileData.packageJsonPath, jsonString);
      const blob = await fileData.zipInstance.generateAsync({ type: 'blob' });
      await writable.write(blob);
    } else {
      const jsonString = JSON.stringify(fileData.content, null, 2);
      await writable.write(jsonString);
    }

    await writable.close();
  }, [fileData]);

  const closeFile = useCallback(() => {
    setFileData(null);
    setError(null);
  }, []);

  return {
    fileData,
    isLoading,
    error,
    openFile,
    handleDrop,
    updateValue,
    getValue,
    saveFile,
    closeFile,
    setError
  };
}
