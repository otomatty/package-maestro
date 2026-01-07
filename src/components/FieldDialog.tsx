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
  Box,
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
  editField?: PresetField | null;
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
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {editField ? t('editFieldTitle') : t('addFieldTitle')}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2.5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
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
            <Box>
              <Typography variant="body2" sx={{ mb: 1, color: '#64748b' }}>
                {t('selectOptions')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
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
                  sx={{ 
                    backgroundColor: '#2563eb',
                    color: 'white',
                    '&:hover': { backgroundColor: '#1d4ed8' }
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selectOptions.map((option) => (
                  <Chip
                    key={option}
                    label={option}
                    onDelete={() => handleRemoveOption(option)}
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, borderTop: '1px solid #e2e8f0' }}>
        <Button 
          onClick={onClose}
          sx={{ textTransform: 'none', color: '#64748b' }}
        >
          {t('cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!keyPath.trim() || !label.trim()}
          sx={{
            backgroundColor: '#2563eb',
            textTransform: 'none',
            '&:hover': { backgroundColor: '#1d4ed8' }
          }}
        >
          {editField ? t('update') : t('add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
