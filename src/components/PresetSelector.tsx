import { useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Menu,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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
  const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(undefined);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');

  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(undefined);
  };

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
      <div className="flex items-center gap-1.5 flex-wrap mb-2">
        <FormControl size="small" className="min-w-[200px]">
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

        <IconButton
          size="small"
          onClick={handleMenuOpen}
          aria-label="preset actions"
        >
          <MoreVertIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => {
              handleMenuClose();
              setCreateDialogOpen(true);
            }}
            disabled={!canCreatePreset}
          >
            <ListItemIcon>
              <AddIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t('createPreset')}</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onDuplicatePreset(activePresetId);
            }}
            disabled={!canCreatePreset}
          >
            <ListItemIcon>
              <ContentCopyIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t('duplicatePreset')}</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              setDeleteDialogOpen(true);
            }}
            disabled={!canDeletePreset}
            className="text-red-600"
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>{t('deletePreset')}</ListItemText>
          </MenuItem>
        </Menu>

        <Chip 
          label={`${presets.length}/${MAX_PRESETS}`} 
          size="small" 
          color={presets.length >= MAX_PRESETS ? 'warning' : 'default'}
          variant="outlined"
        />
      </div>

      {/* Create Preset Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
        <DialogTitle>{t('createPreset')}</DialogTitle>
        <DialogContent className="pt-2.5">
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
        <DialogContent className="pt-2.5">
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
