import { useState, useEffect, useCallback } from 'react';
import { AppConfig, PresetField } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'package-json-editor-presets';

const defaultPreset: AppConfig = {
  presetName: 'Default Preset',
  fields: [
    {
      id: uuidv4(),
      keyPath: 'version',
      label: 'Version',
      type: 'text',
      defaultValue: '1.0.0'
    },
    {
      id: uuidv4(),
      keyPath: 'name',
      label: 'Package Name',
      type: 'text'
    },
    {
      id: uuidv4(),
      keyPath: 'description',
      label: 'Description',
      type: 'text'
    },
    {
      id: uuidv4(),
      keyPath: 'author',
      label: 'Author',
      type: 'text'
    },
    {
      id: uuidv4(),
      keyPath: 'private',
      label: 'Private',
      type: 'boolean',
      defaultValue: false
    }
  ]
};

export function usePresets() {
  const [config, setConfig] = useState<AppConfig>(defaultPreset);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as AppConfig;
        setConfig(parsed);
      }
    } catch (error) {
      console.error('Failed to load presets:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever config changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }
  }, [config, isLoaded]);

  const addField = useCallback((field: Omit<PresetField, 'id'>) => {
    const newField: PresetField = {
      ...field,
      id: uuidv4()
    };
    setConfig(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
    return newField;
  }, []);

  const updateField = useCallback((id: string, updates: Partial<PresetField>) => {
    setConfig(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === id ? { ...field, ...updates } : field
      )
    }));
  }, []);

  const deleteField = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== id)
    }));
  }, []);

  const reorderFields = useCallback((activeId: string, overId: string) => {
    setConfig(prev => {
      const oldIndex = prev.fields.findIndex(f => f.id === activeId);
      const newIndex = prev.fields.findIndex(f => f.id === overId);
      
      if (oldIndex === -1 || newIndex === -1) return prev;
      
      const newFields = [...prev.fields];
      const [removed] = newFields.splice(oldIndex, 1);
      newFields.splice(newIndex, 0, removed);
      
      return { ...prev, fields: newFields };
    });
  }, []);

  const updatePresetName = useCallback((name: string) => {
    setConfig(prev => ({ ...prev, presetName: name }));
  }, []);

  const exportConfig = useCallback(() => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.presetName.replace(/\s+/g, '-').toLowerCase()}-preset.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [config]);

  const importConfig = useCallback((file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string) as AppConfig;
          if (imported.fields && Array.isArray(imported.fields)) {
            setConfig(imported);
            resolve();
          } else {
            reject(new Error('Invalid preset format'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }, []);

  const resetToDefault = useCallback(() => {
    setConfig(defaultPreset);
  }, []);

  return {
    config,
    isLoaded,
    addField,
    updateField,
    deleteField,
    reorderFields,
    updatePresetName,
    exportConfig,
    importConfig,
    resetToDefault
  };
}
