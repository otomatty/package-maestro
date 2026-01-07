import { useState, useRef } from 'react';
import {
  Box,
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
  Alert
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
      <TableCell sx={{ width: 48, p: 1 }}>
        <IconButton
          {...attributes}
          {...listeners}
          size="small"
          sx={{ 
            cursor: 'grab',
            color: '#94a3b8',
            '&:hover': { color: '#64748b' },
            '&:active': { cursor: 'grabbing' }
          }}
        >
          <DragIndicatorIcon fontSize="small" />
        </IconButton>
      </TableCell>
      <TableCell sx={{ fontWeight: 500 }}>{field.label}</TableCell>
      <TableCell>
        <Typography
          component="code"
          sx={{
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            backgroundColor: '#f1f5f9',
            px: 1,
            py: 0.5,
            borderRadius: 1
          }}
        >
          {field.keyPath}
        </Typography>
      </TableCell>
      <TableCell>
        <Chip
          label={getTypeLabel(field.type)}
          size="small"
          sx={{
            backgroundColor: typeColors.bg,
            color: typeColors.color,
            fontWeight: 500
          }}
        />
      </TableCell>
      <TableCell>
        {field.selectOptions?.length ? (
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            {field.selectOptions.join(', ')}
          </Typography>
        ) : (
          <Typography variant="body2" sx={{ color: '#cbd5e1' }}>—</Typography>
        )}
      </TableCell>
      <TableCell align="right">
        <Tooltip title={t('editFieldTitle')}>
          <IconButton
            size="small"
            onClick={() => onEdit(field)}
            sx={{ color: '#64748b' }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={t('actions')}>
          <IconButton
            size="small"
            onClick={() => onDelete(field.id)}
            sx={{ color: '#ef4444' }}
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
  const [editingField, setEditingField] = useState<PresetField | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
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
    setEditingField(null);
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
        setImportError(null);
      } catch (error) {
        setImportError((error as Error).message || t('importError'));
      }
    }
    e.target.value = '';
  };

  const handleSampleImport = (fields: Omit<PresetField, 'id'>[]) => {
    onAddFields(fields);
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
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }} className="animate-fade-in">
      <Paper
        elevation={0}
        sx={{
          border: '1px solid #e2e8f0',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2.5,
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>
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
            sx={{ width: 300 }}
          />
        </Box>

        {/* Actions Bar */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1.5,
            borderBottom: '1px solid #e2e8f0'
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            sx={{
              backgroundColor: '#2563eb',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { backgroundColor: '#1d4ed8' }
            }}
          >
            {t('addField')}
          </Button>

          <Button
            variant="outlined"
            startIcon={<UploadFileIcon />}
            onClick={() => setSampleImportOpen(true)}
            sx={{
              textTransform: 'none',
              borderColor: '#10b981',
              color: '#10b981',
              '&:hover': { borderColor: '#059669', backgroundColor: '#ecfdf5' }
            }}
          >
            {t('generateFromSample')}
          </Button>

          <Button
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={() => setPreviewOpen(true)}
            disabled={config.fields.length === 0}
            sx={{
              textTransform: 'none',
              borderColor: '#e2e8f0',
              color: '#64748b',
              '&:hover': { borderColor: '#cbd5e1', backgroundColor: '#f8fafc' }
            }}
          >
            {t('preview')}
          </Button>

          <Divider orientation="vertical" flexItem />

          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={onExport}
            sx={{
              textTransform: 'none',
              borderColor: '#e2e8f0',
              color: '#64748b',
              '&:hover': { borderColor: '#cbd5e1', backgroundColor: '#f8fafc' }
            }}
          >
            {t('export')}
          </Button>

          <Button
            variant="outlined"
            startIcon={<FileUploadIcon />}
            onClick={handleImportClick}
            sx={{
              textTransform: 'none',
              borderColor: '#e2e8f0',
              color: '#64748b',
              '&:hover': { borderColor: '#cbd5e1', backgroundColor: '#f8fafc' }
            }}
          >
            {t('import')}
          </Button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            style={{ display: 'none' }}
          />

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title={t('resetDefault')}>
            <Button
              variant="outlined"
              startIcon={<RestartAltIcon />}
              onClick={onReset}
              sx={{
                textTransform: 'none',
                borderColor: '#fecaca',
                color: '#dc2626',
                '&:hover': { borderColor: '#f87171', backgroundColor: '#fef2f2' }
              }}
            >
              {t('resetDefault')}
            </Button>
          </Tooltip>
        </Box>

        {importError && (
          <Alert severity="error" onClose={() => setImportError(null)} sx={{ m: 2 }}>
            {importError}
          </Alert>
        )}

        {/* Fields Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#fafafa' }}>
                <TableCell sx={{ width: 48, p: 1 }} />
                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>{t('label')}</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>{t('keyPath')}</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>{t('type')}</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>{t('selectOptions')}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: '#64748b' }}>{t('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {config.fields.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: '#94a3b8' }}>
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
    </Box>
  );
}
