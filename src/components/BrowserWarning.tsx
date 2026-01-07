import { Box, Alert, AlertTitle, Link } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export function BrowserWarning() {
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
        <AlertTitle sx={{ fontWeight: 600 }}>Browser Not Supported</AlertTitle>
        <Box component="p" sx={{ mb: 1 }}>
          This application requires the File System Access API, which is only available in 
          Chromium-based browsers.
        </Box>
        <Box component="p" sx={{ mb: 0 }}>
          Please use <strong>Google Chrome</strong>, <strong>Microsoft Edge</strong>, or 
          another Chromium-based browser for full functionality.
        </Box>
        <Box sx={{ mt: 2 }}>
          <Link 
            href="https://www.google.com/chrome/" 
            target="_blank"
            sx={{ mr: 2 }}
          >
            Download Chrome
          </Link>
          <Link 
            href="https://www.microsoft.com/edge" 
            target="_blank"
          >
            Download Edge
          </Link>
        </Box>
      </Alert>
    </Box>
  );
}
