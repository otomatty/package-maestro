import { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  Switch,
  Button,
  Chip,
  Divider,
  Alert,
  Snackbar,
  InputLabel
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import { PresetField } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';

interface EditorFormProps {
  fileName: string;
  isZip: boolean;
  fields: PresetField[];
  getValue: (keyPath: string) => unknown;
  updateValue: (keyPath: string, value: unknown) => void;
  onSave: () => Promise<void>;
  onClose: () => void;
}

export function EditorForm({
  fileName,
  isZip,
  fields,
  getValue,
  updateValue,
  onSave,
  onClose
}: EditorFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | undefined>(undefined);
  const { t } = useLanguage();

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveError(undefined);
      await onSave();
      setShowSuccess(true);
    } catch (error) {
      setSaveError((error as Error).message || t('saveError'));
    } finally {
      setIsSaving(false);
    }
  };

  const renderField = (field: PresetField) => {
    const value = getValue(field.keyPath);
    
    switch (field.type) {
      case 'boolean':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(value)}
                onChange={(e) => updateValue(field.keyPath, e.target.checked)}
                className="[&_.MuiSwitch-switchBase.Mui-checked]:text-blue-600 [&_.MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track]:bg-blue-600"
              />
            }
            label={field.label}
            className="m-0 [&_.MuiFormControlLabel-label]:font-medium [&_.MuiFormControlLabel-label]:text-gray-700"
          />
        );
      
      case 'select':
        return (
          <FormControl fullWidth size="small">
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value ?? ''}
              onChange={(e) => updateValue(field.keyPath, e.target.value)}
              label={field.label}
              className="[&_.MuiOutlinedInput-notchedOutline]:border-slate-200 [&:hover_.MuiOutlinedInput-notchedOutline]:border-blue-600 [&.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-blue-600"
            >
              {field.selectOptions?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      
      case 'number':
        return (
          <TextField
            fullWidth
            size="small"
            type="number"
            label={field.label}
            value={value ?? ''}
            onChange={(e) => updateValue(field.keyPath, Number(e.target.value))}
            className="[&_.MuiOutlinedInput-root_fieldset]:border-slate-200 [&_.MuiOutlinedInput-root:hover_fieldset]:border-blue-600 [&_.MuiOutlinedInput-root.Mui-focused_fieldset]:border-blue-600"
          />
        );
      
      default:
        return (
          <TextField
            fullWidth
            size="small"
            label={field.label}
            value={value ?? ''}
            onChange={(e) => updateValue(field.keyPath, e.target.value)}
            placeholder={field.defaultValue?.toString() || ''}
            className="[&_.MuiOutlinedInput-root_fieldset]:border-slate-200 [&_.MuiOutlinedInput-root:hover_fieldset]:border-blue-600 [&_.MuiOutlinedInput-root.Mui-focused_fieldset]:border-blue-600"
          />
        );
    }
  };

  return (
    <div className="max-w-[700px] mx-auto p-3 animate-fade-in">
      <Paper
        elevation={0}
        className="border border-slate-200 rounded-lg overflow-hidden"
      >
        {/* File Header */}
        <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            {isZip ? (
              <FolderZipIcon className="text-purple-500 text-2xl" />
            ) : (
              <InsertDriveFileIcon className="text-amber-500 text-2xl" />
            )}
            <div>
              <Typography variant="subtitle1" className="font-semibold text-slate-800">
                {fileName}
              </Typography>
              <Typography variant="caption" className="text-slate-500">
                {isZip ? t('zipFile') : 'JSON'}
              </Typography>
            </div>
          </div>
          <Chip
            label={isZip ? 'package.json' : t('editingFile')}
            size="small"
            className={isZip ? 'bg-purple-50 text-purple-500 font-medium' : 'bg-amber-50 text-amber-500 font-medium'}
          />
        </div>

        {/* Form Fields */}
        <div className="p-3">
          {fields.length === 0 ? (
            <Alert severity="info" className="mb-2">
              {t('noFieldsDefined')} {t('goToSettings')}
            </Alert>
          ) : (
            <div className="flex flex-col gap-2.5">
              {fields.map((field) => (
                <div key={field.id}>
                  <Typography
                    variant="caption"
                    className="block mb-0.5 text-slate-400 font-mono text-xs"
                  >
                    {field.keyPath}
                  </Typography>
                  {renderField(field)}
                </div>
              ))}
            </div>
          )}
        </div>

        <Divider />

        {/* Actions */}
        <div className="p-2.5 bg-gray-50 flex justify-between gap-2">
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={onClose}
            className="normal-case border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
          >
            {t('closeFile')}
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={isSaving || fields.length === 0}
            className="bg-blue-600 normal-case font-semibold px-3 hover:bg-blue-700 disabled:bg-slate-400"
            style={{ boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)' }}
          >
            {isSaving ? t('loading') : t('save')}
          </Button>
        </div>
      </Paper>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          className="w-full"
        >
          {t('saveSuccess')}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={Boolean(saveError)}
        autoHideDuration={5000}
        onClose={() => setSaveError(undefined)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSaveError(undefined)}
          severity="error"
          className="w-full"
        >
          {saveError}
        </Alert>
      </Snackbar>
    </div>
  );
}
