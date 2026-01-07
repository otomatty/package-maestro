import { AppBar, Toolbar, Typography, IconButton, Tooltip, ToggleButtonGroup, ToggleButton } from '@mui/material';
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
      className="bg-white border-b border-slate-200"
    >
      <Toolbar className="min-h-[64px]">
        <div className="flex items-center gap-1.5">
          <div
            className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg"
            style={{ boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)' }}
          >
            <CodeIcon className="text-white text-xl" />
          </div>
          <div>
            <Typography 
              variant="h6" 
              className="font-bold text-slate-800 text-lg leading-tight"
            >
              {t('appTitle')}
            </Typography>
            <Typography 
              variant="caption" 
              className="text-slate-500 text-xs"
            >
              {t('appSubtitle')}
            </Typography>
          </div>
        </div>
        
        <div className="flex-grow" />

        <ToggleButtonGroup
          value={language}
          exclusive
          onChange={(_, newLang) => newLang && setLanguage(newLang)}
          size="small"
          className="mr-2 [&_.MuiToggleButton-root]:px-1.5 [&_.MuiToggleButton-root]:py-0.5 [&_.MuiToggleButton-root]:text-xs [&_.MuiToggleButton-root]:font-semibold [&_.MuiToggleButton-root]:border [&_.MuiToggleButton-root]:border-slate-200 [&_.MuiToggleButton-root.Mui-selected]:bg-blue-600 [&_.MuiToggleButton-root.Mui-selected]:text-white [&_.MuiToggleButton-root.Mui-selected:hover]:bg-blue-700"
        >
          <ToggleButton value="ja">日本語</ToggleButton>
          <ToggleButton value="en">EN</ToggleButton>
        </ToggleButtonGroup>
        
        <Tooltip title={showSettings ? t('backToEditor') : t('presetSettings')}>
          <IconButton 
            onClick={onSettingsClick}
            className={showSettings ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}
          >
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
