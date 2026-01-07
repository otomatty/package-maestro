import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { set } from 'lodash-es';
import { PresetField } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';

interface PreviewDialogProps {
  open: boolean;
  onClose: () => void;
  fields: PresetField[];
}

export function PreviewDialog({ open, onClose, fields }: PreviewDialogProps) {
  const { t } = useLanguage();
  const [showCopied, setShowCopied] = useState(false);

  const previewJson = useMemo(() => {
    const json: Record<string, unknown> = {};
    
    fields.forEach((field) => {
      let sampleValue: unknown;
      
      switch (field.type) {
        case 'text':
          sampleValue = field.defaultValue ?? `<${field.label}>`;
          break;
        case 'number':
          sampleValue = field.defaultValue ?? 0;
          break;
        case 'boolean':
          sampleValue = field.defaultValue ?? false;
          break;
        case 'select':
          sampleValue = field.defaultValue ?? field.selectOptions?.[0] ?? '';
          break;
        default:
          sampleValue = '';
      }
      
      set(json, field.keyPath, sampleValue);
    });
    
    return JSON.stringify(json, null, 2);
  }, [fields]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(previewJson);
      setShowCopied(true);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: '80vh'
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #e2e8f0',
            pb: 2
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {t('previewTitle')}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              {t('previewDescription')}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, pt: 2.5 }}>
          <Box
            sx={{
              position: 'relative',
              backgroundColor: '#1e293b',
              p: 3,
              minHeight: 200
            }}
          >
            <IconButton
              onClick={handleCopy}
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                color: '#94a3b8',
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white'
                }
              }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
            <Box
              component="pre"
              sx={{
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontSize: '0.875rem',
                lineHeight: 1.6,
                color: '#e2e8f0',
                margin: 0,
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}
            >
              <code>{previewJson}</code>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderColor: '#e2e8f0',
              color: '#64748b'
            }}
          >
            {t('close')}
          </Button>
          <Button
            onClick={handleCopy}
            variant="contained"
            startIcon={<ContentCopyIcon />}
            sx={{
              backgroundColor: '#2563eb',
              textTransform: 'none',
              '&:hover': { backgroundColor: '#1d4ed8' }
            }}
          >
            {t('copyToClipboard')}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showCopied}
        autoHideDuration={2000}
        onClose={() => setShowCopied(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {t('copied')}
        </Alert>
      </Snackbar>
    </>
  );
}
