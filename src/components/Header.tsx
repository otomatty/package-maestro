import { AppBar, Toolbar, Typography, IconButton, Tooltip, Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import CodeIcon from '@mui/icons-material/Code';
import { useLanguage } from '@/i18n/LanguageContext';

interface HeaderProps {
  onSettingsClick: () => void;
  showSettings: boolean;
}

export function Header({ onSettingsClick, showSettings }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        backgroundColor: 'white',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)'
            }}
          >
            <CodeIcon sx={{ color: 'white', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: '#1e293b',
                fontSize: '1.1rem',
                lineHeight: 1.2
              }}
            >
              {t('appTitle')}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#64748b',
                fontSize: '0.75rem'
              }}
            >
              {t('appSubtitle')}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />

        <ToggleButtonGroup
          value={language}
          exclusive
          onChange={(_, newLang) => newLang && setLanguage(newLang)}
          size="small"
          sx={{ 
            mr: 2,
            '& .MuiToggleButton-root': {
              px: 1.5,
              py: 0.5,
              fontSize: '0.75rem',
              fontWeight: 600,
              border: '1px solid #e2e8f0',
              '&.Mui-selected': {
                backgroundColor: '#2563eb',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#1d4ed8'
                }
              }
            }
          }}
        >
          <ToggleButton value="ja">日本語</ToggleButton>
          <ToggleButton value="en">EN</ToggleButton>
        </ToggleButtonGroup>
        
        <Tooltip title={showSettings ? t('backToEditor') : t('presetSettings')}>
          <IconButton 
            onClick={onSettingsClick}
            sx={{ 
              backgroundColor: showSettings ? '#2563eb' : '#f1f5f9',
              color: showSettings ? 'white' : '#64748b',
              '&:hover': {
                backgroundColor: showSettings ? '#1d4ed8' : '#e2e8f0'
              }
            }}
          >
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
