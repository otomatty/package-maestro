import { useState, useEffect, useCallback, useMemo } from 'react';
import { AppConfig, PresetField, PresetStore, MAX_PRESETS } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'package-json-editor-presets';

const createDefaultPreset = (): AppConfig => ({
  id: uuidv4(),
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
});

const createDefaultStore = (): PresetStore => {
  const defaultPreset = createDefaultPreset();
  return {
    activePresetId: defaultPreset.id,
    presets: [defaultPreset]
  };
};

// Migration from old format (single AppConfig) to new format (PresetStore)
const migrateFromOldFormat = (data: unknown): PresetStore | null => {
  if (
    data &&
    typeof data === 'object' &&
    'presetName' in data &&
    'fields' in data &&
    !('presets' in data)
  ) {
    const oldConfig = data as { presetName: string; fields: PresetField[] };
    const id = uuidv4();
    return {
      activePresetId: id,
      presets: [{
        id,
        presetName: oldConfig.presetName,
        fields: oldConfig.fields
      }]
    };
  }
  return null;
};

export function usePresets() {
  const [store, setStore] = useState<PresetStore>(createDefaultStore);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        
        // Try migration from old format
        const migrated = migrateFromOldFormat(parsed);
        if (migrated) {
          setStore(migrated);
        } else if (parsed.presets && Array.isArray(parsed.presets)) {
          // Ensure all presets have IDs
          const validStore: PresetStore = {
            activePresetId: parsed.activePresetId,
            presets: parsed.presets.map((p: AppConfig) => ({
              ...p,
              id: p.id || uuidv4()
            }))
          };
          setStore(validStore);
        }
      }
    } catch (error) {
      console.error('Failed to load presets:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever store changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    }
  }, [store, isLoaded]);

  // Current active preset
  const config = useMemo(() => {
    return store.presets.find(p => p.id === store.activePresetId) || store.presets[0];
  }, [store]);

  const canCreatePreset = store.presets.length < MAX_PRESETS;
  const canDeletePreset = store.presets.length > 1;

  // Preset management
  const createPreset = useCallback((name: string) => {
    if (!canCreatePreset) return null;
    
    const newPreset: AppConfig = {
      id: uuidv4(),
      presetName: name,
      fields: []
    };
    
    setStore(prev => ({
      activePresetId: newPreset.id,
      presets: [...prev.presets, newPreset]
    }));
    
    return newPreset;
  }, [canCreatePreset]);

  const duplicatePreset = useCallback((id: string) => {
    if (!canCreatePreset) return null;
    
    const preset = store.presets.find(p => p.id === id);
    if (!preset) return null;
    
    const newPreset: AppConfig = {
      id: uuidv4(),
      presetName: `${preset.presetName} (コピー)`,
      fields: preset.fields.map(f => ({ ...f, id: uuidv4() }))
    };
    
    setStore(prev => ({
      activePresetId: newPreset.id,
      presets: [...prev.presets, newPreset]
    }));
    
    return newPreset;
  }, [canCreatePreset, store.presets]);

  const deletePreset = useCallback((id: string) => {
    if (!canDeletePreset) return false;
    
    setStore(prev => {
      const newPresets = prev.presets.filter(p => p.id !== id);
      const newActiveId = prev.activePresetId === id 
        ? newPresets[0].id 
        : prev.activePresetId;
      
      return {
        activePresetId: newActiveId,
        presets: newPresets
      };
    });
    
    return true;
  }, [canDeletePreset]);

  const switchPreset = useCallback((id: string) => {
    setStore(prev => ({
      ...prev,
      activePresetId: id
    }));
  }, []);

  // Field management (operates on active preset)
  const addField = useCallback((field: Omit<PresetField, 'id'>) => {
    const newField: PresetField = {
      ...field,
      id: uuidv4()
    };
    setStore(prev => ({
      ...prev,
      presets: prev.presets.map(p =>
        p.id === prev.activePresetId
          ? { ...p, fields: [...p.fields, newField] }
          : p
      )
    }));
    return newField;
  }, []);

  const addFields = useCallback((fields: Omit<PresetField, 'id'>[]) => {
    const newFields: PresetField[] = fields.map(f => ({
      ...f,
      id: uuidv4()
    }));
    setStore(prev => ({
      ...prev,
      presets: prev.presets.map(p =>
        p.id === prev.activePresetId
          ? { ...p, fields: [...p.fields, ...newFields] }
          : p
      )
    }));
    return newFields;
  }, []);

  const updateField = useCallback((id: string, updates: Partial<PresetField>) => {
    setStore(prev => ({
      ...prev,
      presets: prev.presets.map(p =>
        p.id === prev.activePresetId
          ? {
              ...p,
              fields: p.fields.map(f =>
                f.id === id ? { ...f, ...updates } : f
              )
            }
          : p
      )
    }));
  }, []);

  const deleteField = useCallback((id: string) => {
    setStore(prev => ({
      ...prev,
      presets: prev.presets.map(p =>
        p.id === prev.activePresetId
          ? { ...p, fields: p.fields.filter(f => f.id !== id) }
          : p
      )
    }));
  }, []);

  const reorderFields = useCallback((activeId: string, overId: string) => {
    setStore(prev => {
      const preset = prev.presets.find(p => p.id === prev.activePresetId);
      if (!preset) return prev;

      const oldIndex = preset.fields.findIndex(f => f.id === activeId);
      const newIndex = preset.fields.findIndex(f => f.id === overId);
      
      if (oldIndex === -1 || newIndex === -1) return prev;
      
      const newFields = [...preset.fields];
      const [removed] = newFields.splice(oldIndex, 1);
      newFields.splice(newIndex, 0, removed);
      
      return {
        ...prev,
        presets: prev.presets.map(p =>
          p.id === prev.activePresetId
            ? { ...p, fields: newFields }
            : p
        )
      };
    });
  }, []);

  const updatePresetName = useCallback((name: string) => {
    setStore(prev => ({
      ...prev,
      presets: prev.presets.map(p =>
        p.id === prev.activePresetId
          ? { ...p, presetName: name }
          : p
      )
    }));
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
            // Import as update to current preset
            setStore(prev => ({
              ...prev,
              presets: prev.presets.map(p =>
                p.id === prev.activePresetId
                  ? { 
                      ...p, 
                      presetName: imported.presetName || p.presetName,
                      fields: imported.fields.map(f => ({
                        ...f,
                        id: f.id || uuidv4()
                      }))
                    }
                  : p
              )
            }));
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
    const defaultPreset = createDefaultPreset();
    setStore(prev => ({
      ...prev,
      presets: prev.presets.map(p =>
        p.id === prev.activePresetId
          ? { ...defaultPreset, id: p.id }
          : p
      )
    }));
  }, []);

  return {
    config,
    presets: store.presets,
    activePresetId: store.activePresetId,
    isLoaded,
    canCreatePreset,
    canDeletePreset,
    // Preset management
    createPreset,
    duplicatePreset,
    deletePreset,
    switchPreset,
    // Field management
    addField,
    addFields,
    updateField,
    deleteField,
    reorderFields,
    updatePresetName,
    exportConfig,
    importConfig,
    resetToDefault
  };
}
