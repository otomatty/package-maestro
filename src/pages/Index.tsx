import { useState } from 'react';
import { Box, Alert, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Header } from '@/components/Header';
import { DropZone } from '@/components/DropZone';
import { EditorForm } from '@/components/EditorForm';
import { SettingsPanel } from '@/components/SettingsPanel';
import { BrowserWarning } from '@/components/BrowserWarning';
import { usePresets } from '@/hooks/usePresets';
import { useFileHandler } from '@/hooks/useFileHandler';
import { LanguageProvider } from '@/i18n/LanguageContext';

const theme = createTheme({
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  palette: {
    primary: {
      main: '#2563eb',
      dark: '#1d4ed8',
    },
    background: {
      default: '#f8fafc',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          paddingTop: '20px',
        },
      },
    },
  },
});

const Index = () => {
  const [showSettings, setShowSettings] = useState(false);
  const {
    config,
    presets,
    activePresetId,
    isLoaded,
    canCreatePreset,
    canDeletePreset,
    createPreset,
    duplicatePreset,
    deletePreset,
    switchPreset,
    addField,
    addFields,
    updateField,
    deleteField,
    reorderFields,
    updatePresetName,
    exportConfig,
    importConfig,
    resetToDefault
  } = usePresets();

  const {
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
  } = useFileHandler();

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <LanguageProvider>
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
          <Header 
            onSettingsClick={() => setShowSettings(!showSettings)} 
            showSettings={showSettings}
          />

          <BrowserWarning />

          {error && (
            <Box sx={{ p: 2, maxWidth: 700, mx: 'auto' }}>
              <Alert 
                severity="error" 
                onClose={() => setError(null)}
                sx={{ borderRadius: 2 }}
              >
                {error}
              </Alert>
            </Box>
          )}

          <Box sx={{ py: 3 }}>
            {showSettings ? (
              <SettingsPanel
                config={config}
                presets={presets}
                activePresetId={activePresetId}
                canCreatePreset={canCreatePreset}
                canDeletePreset={canDeletePreset}
                onSwitchPreset={switchPreset}
                onCreatePreset={createPreset}
                onDuplicatePreset={duplicatePreset}
                onDeletePreset={deletePreset}
                onAddField={addField}
                onAddFields={addFields}
                onUpdateField={updateField}
                onDeleteField={deleteField}
                onReorderFields={reorderFields}
                onUpdatePresetName={updatePresetName}
                onExport={exportConfig}
                onImport={importConfig}
                onReset={resetToDefault}
              />
            ) : fileData ? (
              <EditorForm
                fileName={fileData.name}
                isZip={fileData.isZip}
                fields={config.fields}
                getValue={getValue}
                updateValue={updateValue}
                onSave={saveFile}
                onClose={closeFile}
              />
            ) : (
              <DropZone
                onDrop={handleDrop}
                onOpenFile={openFile}
                isLoading={isLoading}
              />
            )}
          </Box>
        </Box>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default Index;
