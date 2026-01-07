import { useState, useCallback } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import { useLanguage } from '@/i18n/LanguageContext';

interface DropZoneProps {
  onDrop: (e: React.DragEvent) => void;
  onOpenFile: () => void;
  isLoading: boolean;
}

export function DropZone({ onDrop, onOpenFile, isLoading }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const { t } = useLanguage();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(e);
  }, [onDrop]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 200px)',
        p: 4
      }}
    >
      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!isLoading ? onOpenFile : undefined}
        sx={{
          width: '100%',
          maxWidth: 600,
          minHeight: 320,
          border: '2px dashed',
          borderColor: isDragOver ? '#2563eb' : '#cbd5e1',
          borderRadius: 3,
          backgroundColor: isDragOver ? 'rgba(37, 99, 235, 0.04)' : 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          cursor: isLoading ? 'wait' : 'pointer',
          transition: 'all 0.2s ease',
          p: 4,
          '&:hover': {
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.02)'
          }
        }}
      >
        {isLoading ? (
          <>
            <CircularProgress size={48} sx={{ color: '#2563eb' }} />
            <Typography color="text.secondary">
              {t('loading')}
            </Typography>
          </>
        ) : (
          <>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 40, color: '#2563eb' }} />
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                {isDragOver ? t('dropHere') : t('dropzoneTitle')}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                {t('dropzoneSubtitle')}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0'
                }}
              >
                <InsertDriveFileIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#64748b' }}>
                  .json
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0'
                }}
              >
                <FolderZipIcon sx={{ fontSize: 18, color: '#8b5cf6' }} />
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#64748b' }}>
                  .zip
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              onClick={(e) => {
                e.stopPropagation();
                onOpenFile();
              }}
              sx={{
                mt: 2,
                backgroundColor: '#2563eb',
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.25,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
                '&:hover': {
                  backgroundColor: '#1d4ed8'
                }
              }}
            >
              {t('openFile')}
            </Button>
          </>
        )}
      </Box>

      <Typography 
        variant="caption" 
        sx={{ 
          mt: 3, 
          color: '#94a3b8',
          textAlign: 'center',
          maxWidth: 400
        }}
      >
        {t('supportedFormats')}
      </Typography>
    </Box>
  );
}
