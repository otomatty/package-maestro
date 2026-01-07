import { AppBar, Toolbar, Typography, IconButton, Tooltip, Box } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import CodeIcon from '@mui/icons-material/Code';

interface HeaderProps {
  onSettingsClick: () => void;
  showSettings: boolean;
}

export function Header({ onSettingsClick, showSettings }: HeaderProps) {
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
              Package.json Editor
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#64748b',
                fontSize: '0.75rem'
              }}
            >
              GUI Configuration Tool
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Tooltip title={showSettings ? "Back to Editor" : "Preset Settings"}>
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
