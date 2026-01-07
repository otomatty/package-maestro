import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { PresetField, FieldType } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';

interface FieldDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (field: Omit<PresetField, 'id'>) => void;
  editField?: PresetField | undefined;
}

export function FieldDialog({ open, onClose, onSave, editField }: FieldDialogProps) {
  const [keyPath, setKeyPath] = useState('');
  const [label, setLabel] = useState('');
  const [type, setType] = useState<FieldType>('text');
  const [selectOptions, setSelectOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState('');
  const [defaultValue, setDefaultValue] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    if (editField) {
      setKeyPath(editField.keyPath);
      setLabel(editField.label);
      setType(editField.type);
      setSelectOptions(editField.selectOptions || []);
      setDefaultValue(editField.defaultValue?.toString() || '');
    } else {
      setKeyPath('');
      setLabel('');
      setType('text');
      setSelectOptions([]);
      setDefaultValue('');
    }
  }, [editField, open]);

  const handleAddOption = () => {
    if (newOption.trim() && !selectOptions.includes(newOption.trim())) {
      setSelectOptions([...selectOptions, newOption.trim()]);
      setNewOption('');
    }
  };

  const handleRemoveOption = (option: string) => {
    setSelectOptions(selectOptions.filter(o => o !== option));
  };

  const handleSave = () => {
    if (!keyPath.trim() || !label.trim()) return;

    const field: Omit<PresetField, 'id'> = {
      keyPath: keyPath.trim(),
      label: label.trim(),
      type,
      ...(type === 'select' && { selectOptions }),
      ...(defaultValue && { defaultValue: type === 'boolean' ? defaultValue === 'true' : type === 'number' ? Number(defaultValue) : defaultValue })
    };

    onSave(field);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle className="flex justify-between items-center border-b border-slate-200">
        <Typography variant="h6" className="font-semibold">
          {editField ? t('editFieldTitle') : t('addFieldTitle')}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className="pt-2.5">
        <div className="flex flex-col gap-2.5">
          <TextField
            label={t('keyPath')}
            value={keyPath}
            onChange={(e) => setKeyPath(e.target.value)}
            placeholder={t('keyPathHelper')}
            fullWidth
            size="small"
            helperText={t('keyPathHelper')}
          />

          <TextField
            label={t('label')}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={t('labelHelper')}
            fullWidth
            size="small"
          />

          <FormControl fullWidth size="small">
            <InputLabel>{t('fieldType')}</InputLabel>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value as FieldType)}
              label={t('fieldType')}
            >
              <MenuItem value="text">{t('typeText')}</MenuItem>
              <MenuItem value="number">{t('typeNumber')}</MenuItem>
              <MenuItem value="boolean">{t('typeBoolean')}</MenuItem>
              <MenuItem value="select">{t('typeSelect')}</MenuItem>
            </Select>
          </FormControl>

          {type === 'select' && (
            <div>
              <Typography variant="body2" className="mb-1 text-slate-500">
                {t('selectOptions')}
              </Typography>
              <div className="flex gap-1 mb-1">
                <TextField
                  size="small"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder={t('selectOptionsHelper')}
                  fullWidth
                  onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                />
                <IconButton 
                  onClick={handleAddOption}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  <AddIcon />
                </IconButton>
              </div>
              <div className="flex flex-wrap gap-0.5">
                {selectOptions.map((option) => (
                  <Chip
                    key={option}
                    label={option}
                    onDelete={() => handleRemoveOption(option)}
                    size="small"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>

      <DialogActions className="p-2.5 border-t border-slate-200">
        <Button 
          onClick={onClose}
          className="normal-case text-slate-500"
        >
          {t('cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!keyPath.trim() || !label.trim()}
          className="bg-blue-600 normal-case hover:bg-blue-700"
        >
          {editField ? t('update') : t('add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
