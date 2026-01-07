import { useState, useRef } from 'react';
import {
  Paper,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tooltip,
  TextField,
  Divider,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import VisibilityIcon from '@mui/icons-material/Visibility';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PresetField, AppConfig } from '@/types';
import { FieldDialog } from './FieldDialog';
import { PreviewDialog } from './PreviewDialog';
import { PresetSelector } from './PresetSelector';
import { SampleImportDialog } from './SampleImportDialog';
import { useLanguage } from '@/i18n/LanguageContext';

interface SettingsPanelProps {
  config: AppConfig;
  presets: AppConfig[];
  activePresetId: string;
  canCreatePreset: boolean;
  canDeletePreset: boolean;
  onSwitchPreset: (id: string) => void;
  onCreatePreset: (name: string) => void;
  onDuplicatePreset: (id: string) => void;
  onDeletePreset: (id: string) => void;
  onAddField: (field: Omit<PresetField, 'id'>) => PresetField;
  onAddFields: (fields: Omit<PresetField, 'id'>[]) => PresetField[];
  onUpdateField: (id: string, updates: Partial<PresetField>) => void;
  onDeleteField: (id: string) => void;
  onReorderFields: (activeId: string, overId: string) => void;
  onUpdatePresetName: (name: string) => void;
  onExport: () => void;
  onImport: (file: File) => Promise<void>;
  onReset: () => void;
}

interface SortableRowProps {
  field: PresetField;
  onEdit: (field: PresetField) => void;
  onDelete: (id: string) => void;
  getTypeColor: (type: string) => { bg: string; color: string };
  getTypeLabel: (type: string) => string;
  t: (key: string) => string;
}

function SortableRow({ field, onEdit, onDelete, getTypeColor, getTypeLabel, t }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isDragging ? '#f1f5f9' : 'transparent'
  };

  const typeColors = getTypeColor(field.type);

  return (
    <TableRow ref={setNodeRef} style={style} hover>
      <TableCell className="w-12 p-1">
        <IconButton
          {...attributes}
          {...listeners}
          size="small"
          className="cursor-grab text-slate-400 hover:text-slate-500 active:cursor-grabbing"
        >
          <DragIndicatorIcon fontSize="small" />
        </IconButton>
      </TableCell>
      <TableCell className="font-medium">{field.label}</TableCell>
      <TableCell>
        <Typography
          component="code"
          className="font-mono text-sm bg-slate-50 px-1 py-0.5 rounded"
        >
          {field.keyPath}
        </Typography>
      </TableCell>
      <TableCell>
        <Chip
          label={getTypeLabel(field.type)}
          size="small"
          className="font-medium"
          style={{ backgroundColor: typeColors.bg, color: typeColors.color }}
        />
      </TableCell>
      <TableCell>
        {field.selectOptions?.length ? (
          <Typography variant="body2" className="text-slate-500">
            {field.selectOptions.join(', ')}
          </Typography>
        ) : (
          <Typography variant="body2" className="text-slate-300">—</Typography>
        )}
      </TableCell>
      <TableCell align="right">
        <Tooltip title={t('editFieldTitle')}>
          <IconButton
            size="small"
            onClick={() => onEdit(field)}
            className="text-slate-500"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={t('actions')}>
          <IconButton
            size="small"
            onClick={() => onDelete(field.id)}
            className="text-red-500"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

export function SettingsPanel({
  config,
  presets,
  activePresetId,
  canCreatePreset,
  canDeletePreset,
  onSwitchPreset,
  onCreatePreset,
  onDuplicatePreset,
  onDeletePreset,
  onAddField,
  onAddFields,
  onUpdateField,
  onDeleteField,
  onReorderFields,
  onUpdatePresetName,
  onExport,
  onImport,
  onReset
}: SettingsPanelProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [sampleImportOpen, setSampleImportOpen] = useState(false);
  const [editingField, setEditingField] = useState<PresetField | undefined>(undefined);
  const [importError, setImportError] = useState<string | undefined>(undefined);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorderFields(active.id as string, over.id as string);
    }
  };

  const handleAddClick = () => {
    setEditingField(undefined);
    setDialogOpen(true);
  };

  const handleEditClick = (field: PresetField) => {
    setEditingField(field);
    setDialogOpen(true);
  };

  const handleDialogSave = (fieldData: Omit<PresetField, 'id'>) => {
    if (editingField) {
      onUpdateField(editingField.id, fieldData);
    } else {
      onAddField(fieldData);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await onImport(file);
        setImportError(undefined);
      } catch (error) {
        setImportError((error as Error).message || t('importError'));
      }
    }
    e.target.value = '';
  };

  const handleSampleImport = (fields: Omit<PresetField, 'id'>[]) => {
    onAddFields(fields);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleMenuAction = (action: () => void) => {
    action();
    handleMenuClose();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'text': return { bg: '#dbeafe', color: '#1e40af' };
      case 'number': return { bg: '#dcfce7', color: '#166534' };
      case 'boolean': return { bg: '#fef3c7', color: '#92400e' };
      case 'select': return { bg: '#f3e8ff', color: '#7e22ce' };
      default: return { bg: '#f1f5f9', color: '#475569' };
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'text': return t('typeText');
      case 'number': return t('typeNumber');
      case 'boolean': return t('typeBoolean');
      case 'select': return t('typeSelect');
      default: return type;
    }
  };

  return (
    <div className="max-w-[900px] mx-auto p-3 animate-fade-in">
      <Paper
        elevation={0}
        className="border border-slate-200 rounded-lg overflow-hidden"
      >
        {/* Header */}
        <div className="p-2.5 bg-slate-50 border-b border-slate-200">
          <Typography variant="h6" className="font-semibold text-slate-800 mb-2">
            {t('settingsTitle')}
          </Typography>
          
          {/* Preset Selector */}
          <PresetSelector
            presets={presets}
            activePresetId={activePresetId}
            canCreatePreset={canCreatePreset}
            canDeletePreset={canDeletePreset}
            onSwitchPreset={onSwitchPreset}
            onCreatePreset={onCreatePreset}
            onDuplicatePreset={onDuplicatePreset}
            onDeletePreset={onDeletePreset}
          />
          
          <TextField
            size="small"
            label={t('presetName')}
            value={config.presetName}
            onChange={(e) => onUpdatePresetName(e.target.value)}
            className="w-[300px]"
          />
        </div>

        {/* Actions Bar */}
        <div className="p-2 flex flex-wrap gap-1.5 border-b border-slate-200 items-center">
          {/* Primary Actions */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            className="bg-blue-600 normal-case font-semibold hover:bg-blue-700"
          >
            {t('addField')}
          </Button>

          <Button
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={() => setPreviewOpen(true)}
            disabled={config.fields.length === 0}
            className="normal-case border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
          >
            {t('preview')}
          </Button>

          <div className="flex-grow" />

          {/* More Actions Menu */}
          <Button
            variant="outlined"
            startIcon={<MoreVertIcon />}
            onClick={handleMenuOpen}
            className="normal-case border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
          >
            {t('moreActions')}
          </Button>

          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={() => handleMenuAction(() => setSampleImportOpen(true))}>
              <ListItemIcon>
                <UploadFileIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t('generateFromSample')}</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleMenuAction(() => onExport())}>
              <ListItemIcon>
                <FileDownloadIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t('export')}</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleMenuAction(() => handleImportClick())}>
              <ListItemIcon>
                <FileUploadIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t('import')}</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem 
              onClick={() => handleMenuAction(() => onReset())}
              className="text-red-600 hover:bg-red-50"
            >
              <ListItemIcon>
                <RestartAltIcon fontSize="small" className="text-red-600" />
              </ListItemIcon>
              <ListItemText>{t('resetDefault')}</ListItemText>
            </MenuItem>
          </Menu>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            style={{ display: 'none' }}
          />
        </div>

        {importError && (
          <Alert severity="error" onClose={() => setImportError(undefined)} className="m-2">
            {importError}
          </Alert>
        )}

        {/* Fields Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow className="bg-gray-50">
                <TableCell className="w-12 p-1" />
                <TableCell className="font-semibold text-slate-500">{t('label')}</TableCell>
                <TableCell className="font-semibold text-slate-500">{t('keyPath')}</TableCell>
                <TableCell className="font-semibold text-slate-500">{t('type')}</TableCell>
                <TableCell className="font-semibold text-slate-500">{t('selectOptions')}</TableCell>
                <TableCell align="right" className="font-semibold text-slate-500">{t('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {config.fields.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-slate-400">
                    {t('noFields')}
                  </TableCell>
                </TableRow>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={config.fields.map(f => f.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {config.fields.map((field) => (
                      <SortableRow
                        key={field.id}
                        field={field}
                        onEdit={handleEditClick}
                        onDelete={onDeleteField}
                        getTypeColor={getTypeColor}
                        getTypeLabel={getTypeLabel}
                        t={t as (key: string) => string}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <FieldDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleDialogSave}
        editField={editingField}
      />

      <PreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        fields={config.fields}
      />

      <SampleImportDialog
        open={sampleImportOpen}
        onClose={() => setSampleImportOpen(false)}
        onImport={handleSampleImport}
      />
    </div>
  );
}
