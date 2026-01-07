import { Box, Alert, AlertTitle, Link } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useLanguage } from '@/i18n/LanguageContext';

export function BrowserWarning() {
  const { t } = useLanguage();
  const isSupported = 'showOpenFilePicker' in window;

  if (isSupported) return null;

  return (
    <Box sx={{ p: 2 }}>
      <Alert 
        severity="warning" 
        icon={<WarningAmberIcon />}
        sx={{ 
          maxWidth: 600, 
          mx: 'auto',
          '& .MuiAlert-message': { width: '100%' }
        }}
      >
        <AlertTitle sx={{ fontWeight: 600 }}>{t('browserNotSupported')}</AlertTitle>
        <Box component="p" sx={{ mb: 1 }}>
          {t('browserWarningMessage')}
        </Box>
        <Box component="p" sx={{ mb: 0 }}>
          {t('browserWarningInstruction')}
        </Box>
        <Box sx={{ mt: 2 }}>
          <Link 
            href="https://www.google.com/chrome/" 
            target="_blank"
            sx={{ mr: 2 }}
          >
            {t('downloadChrome')}
          </Link>
          <Link 
            href="https://www.microsoft.com/edge" 
            target="_blank"
          >
            {t('downloadEdge')}
          </Link>
        </Box>
      </Alert>
    </Box>
  );
}
