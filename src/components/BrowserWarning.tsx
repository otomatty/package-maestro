import { Alert, AlertTitle, Link } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useLanguage } from '@/i18n/LanguageContext';

export function BrowserWarning() {
  const { t } = useLanguage();
  const isSupported = 'showOpenFilePicker' in window;

  if (isSupported) return undefined;

  return (
    <div className="p-2">
      <Alert 
        severity="warning" 
        icon={<WarningAmberIcon />}
        className="max-w-[600px] mx-auto [&_.MuiAlert-message]:w-full"
      >
        <AlertTitle className="font-semibold">{t('browserNotSupported')}</AlertTitle>
        <p className="mb-1">
          {t('browserWarningMessage')}
        </p>
        <p className="mb-0">
          {t('browserWarningInstruction')}
        </p>
        <div className="mt-2">
          <Link 
            href="https://www.google.com/chrome/" 
            target="_blank"
            className="mr-2"
          >
            {t('downloadChrome')}
          </Link>
          <Link 
            href="https://www.microsoft.com/edge" 
            target="_blank"
          >
            {t('downloadEdge')}
          </Link>
        </div>
      </Alert>
    </div>
  );
}
