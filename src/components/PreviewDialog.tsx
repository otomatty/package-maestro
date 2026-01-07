import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
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
    
    // 理由: JSON.stringifyの第2引数にnullを指定するのは標準APIの仕様。
    // nullは「すべてのプロパティを含める」という意味で、undefinedに置き換えることはできない。
    // 第3引数の2はインデントのスペース数を指定するため、第2引数にnullが必要。
    // eslint-disable-next-line no-restricted-syntax
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
          className: 'rounded-lg max-h-[80vh]'
        }}
      >
        <DialogTitle className="flex justify-between items-center border-b border-slate-200 pb-2">
          <div>
            <Typography variant="h6" className="font-semibold">
              {t('previewTitle')}
            </Typography>
            <Typography variant="caption" className="text-slate-500">
              {t('previewDescription')}
            </Typography>
          </div>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent className="p-0 pt-2.5">
          <div className="relative bg-slate-800 p-3 min-h-[200px]">
            <IconButton
              onClick={handleCopy}
              size="small"
              className="absolute top-3 right-3 text-slate-400 bg-white/10 hover:bg-white/20 hover:text-white"
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
            <pre className="font-mono text-sm leading-relaxed text-slate-200 m-0 overflow-auto whitespace-pre-wrap break-words">
              <code>{previewJson}</code>
            </pre>
          </div>
        </DialogContent>

        <DialogActions className="p-2 border-t border-slate-200">
          <Button
            onClick={onClose}
            variant="outlined"
            className="normal-case border-slate-200 text-slate-500"
          >
            {t('close')}
          </Button>
          <Button
            onClick={handleCopy}
            variant="contained"
            startIcon={<ContentCopyIcon />}
            className="bg-blue-600 normal-case hover:bg-blue-700"
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
        <Alert severity="success" className="w-full">
          {t('copied')}
        </Alert>
      </Snackbar>
    </>
  );
}
