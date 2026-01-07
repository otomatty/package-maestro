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
import { PresetField, AppConfig } from '@/types';
import { FieldDialog } from './FieldDialog';

interface SettingsPanelProps {
  config: AppConfig;
  onAddField: (field: Omit<PresetField, 'id'>) => PresetField;
  onUpdateField: (id: string, updates: Partial<PresetField>) => void;
  onDeleteField: (id: string) => void;
  onUpdatePresetName: (name: string) => void;
  onExport: () => void;
  onImport: (file: File) => Promise<void>;
  onReset: () => void;
}

export function SettingsPanel({
  config,
  onAddField,
  onUpdateField,
  onDeleteField,
  onUpdatePresetName,
  onExport,
  onImport,
  onReset
}: SettingsPanelProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<PresetField | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        setImportError((error as Error).message || 'Failed to import preset');
      }
    }
    e.target.value = '';
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
            Preset Configuration
          </Typography>
          
          <TextField
            size="small"
            label="Preset Name"
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
            Add Field
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
            Export
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
            Import
          </Button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            style={{ display: 'none' }}
          />

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title="Reset to default preset">
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
              Reset
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
                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Label</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Key Path</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Options</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: '#64748b' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {config.fields.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4, color: '#94a3b8' }}>
                    No fields configured. Click "Add Field" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                config.fields.map((field) => {
                  const typeColors = getTypeColor(field.type);
                  return (
                    <TableRow key={field.id} hover>
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
                          label={field.type}
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
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEditClick(field)}
                            sx={{ color: '#64748b' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => onDeleteField(field.id)}
                            sx={{ color: '#ef4444' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
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
    </Box>
  );
}
