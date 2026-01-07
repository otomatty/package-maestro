import { useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLanguage } from '@/i18n/LanguageContext';
import { AppConfig, MAX_PRESETS } from '@/types';

interface PresetSelectorProps {
  presets: AppConfig[];
  activePresetId: string;
  canCreatePreset: boolean;
  canDeletePreset: boolean;
  onSwitchPreset: (id: string) => void;
  onCreatePreset: (name: string) => void;
  onDuplicatePreset: (id: string) => void;
  onDeletePreset: (id: string) => void;
}

export function PresetSelector({
  presets,
  activePresetId,
  canCreatePreset,
  canDeletePreset,
  onSwitchPreset,
  onCreatePreset,
  onDuplicatePreset,
  onDeletePreset
}: PresetSelectorProps) {
  const { t } = useLanguage();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');

  const handleCreate = () => {
    if (newPresetName.trim()) {
      onCreatePreset(newPresetName.trim());
      setNewPresetName('');
      setCreateDialogOpen(false);
    }
  };

  const handleDelete = () => {
    onDeletePreset(activePresetId);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        flexWrap: 'wrap',
        mb: 2 
      }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="preset-select-label">{t('selectPreset')}</InputLabel>
          <Select
            labelId="preset-select-label"
            value={activePresetId}
            label={t('selectPreset')}
            onChange={(e) => onSwitchPreset(e.target.value)}
          >
            {presets.map((preset) => (
              <MenuItem key={preset.id} value={preset.id}>
                {preset.presetName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title={canCreatePreset ? t('createPreset') : t('presetLimit')}>
            <span>
              <IconButton
                size="small"
                onClick={() => setCreateDialogOpen(true)}
                disabled={!canCreatePreset}
                color="primary"
              >
                <AddIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title={canCreatePreset ? t('duplicatePreset') : t('presetLimit')}>
            <span>
              <IconButton
                size="small"
                onClick={() => onDuplicatePreset(activePresetId)}
                disabled={!canCreatePreset}
                color="primary"
              >
                <ContentCopyIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title={canDeletePreset ? t('deletePreset') : t('cannotDeleteLast')}>
            <span>
              <IconButton
                size="small"
                onClick={() => setDeleteDialogOpen(true)}
                disabled={!canDeletePreset}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        <Chip 
          label={`${presets.length}/${MAX_PRESETS}`} 
          size="small" 
          color={presets.length >= MAX_PRESETS ? 'warning' : 'default'}
          variant="outlined"
        />
      </Box>

      {/* Create Preset Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
        <DialogTitle>{t('createPreset')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t('presetName')}
            fullWidth
            variant="outlined"
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>{t('cancel')}</Button>
          <Button onClick={handleCreate} variant="contained" disabled={!newPresetName.trim()}>
            {t('add')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>{t('deletePreset')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('confirmDeletePreset')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>{t('cancel')}</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            {t('deletePreset')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
