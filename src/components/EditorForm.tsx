import { useState } from 'react';
import {
  Box,
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
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveError(null);
      await onSave();
      setShowSuccess(true);
    } catch (error) {
      setSaveError((error as Error).message || 'Failed to save file');
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
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#2563eb'
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#2563eb'
                  }
                }}
              />
            }
            label={field.label}
            sx={{ 
              m: 0,
              '& .MuiFormControlLabel-label': {
                fontWeight: 500,
                color: '#374151'
              }
            }}
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
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e2e8f0'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#2563eb'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#2563eb'
                }
              }}
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
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#e2e8f0'
                },
                '&:hover fieldset': {
                  borderColor: '#2563eb'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#2563eb'
                }
              }
            }}
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
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#e2e8f0'
                },
                '&:hover fieldset': {
                  borderColor: '#2563eb'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#2563eb'
                }
              }
            }}
          />
        );
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', p: 3 }} className="animate-fade-in">
      <Paper
        elevation={0}
        sx={{
          border: '1px solid #e2e8f0',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        {/* File Header */}
        <Box
          sx={{
            p: 2.5,
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {isZip ? (
              <FolderZipIcon sx={{ color: '#8b5cf6', fontSize: 24 }} />
            ) : (
              <InsertDriveFileIcon sx={{ color: '#f59e0b', fontSize: 24 }} />
            )}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                {fileName}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                {isZip ? 'ZIP Archive' : 'JSON File'}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={isZip ? 'package.json inside ZIP' : 'Direct Edit'}
            size="small"
            sx={{
              backgroundColor: isZip ? 'rgba(139, 92, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
              color: isZip ? '#8b5cf6' : '#f59e0b',
              fontWeight: 500
            }}
          />
        </Box>

        {/* Form Fields */}
        <Box sx={{ p: 3 }}>
          {fields.length === 0 ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              No fields configured. Go to Settings to add editable fields.
            </Alert>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {fields.map((field) => (
                <Box key={field.id}>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mb: 0.5,
                      color: '#94a3b8',
                      fontFamily: 'monospace',
                      fontSize: '0.7rem'
                    }}
                  >
                    {field.keyPath}
                  </Typography>
                  {renderField(field)}
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <Divider />

        {/* Actions */}
        <Box
          sx={{
            p: 2.5,
            backgroundColor: '#fafafa',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={onClose}
            sx={{
              textTransform: 'none',
              borderColor: '#e2e8f0',
              color: '#64748b',
              '&:hover': {
                borderColor: '#cbd5e1',
                backgroundColor: '#f1f5f9'
              }
            }}
          >
            Close File
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={isSaving || fields.length === 0}
            sx={{
              backgroundColor: '#2563eb',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
              '&:hover': {
                backgroundColor: '#1d4ed8'
              },
              '&:disabled': {
                backgroundColor: '#94a3b8'
              }
            }}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
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
          sx={{ width: '100%' }}
        >
          File saved successfully!
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={Boolean(saveError)}
        autoHideDuration={5000}
        onClose={() => setSaveError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSaveError(null)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {saveError}
        </Alert>
      </Snackbar>
    </Box>
  );
}
