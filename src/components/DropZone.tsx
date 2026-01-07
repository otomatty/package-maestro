import { useState, useCallback } from 'react';
import { Typography, Button, CircularProgress } from '@mui/material';
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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!isLoading ? onOpenFile : undefined}
        className={`w-full max-w-[600px] min-h-[320px] border-2 border-dashed rounded-3 flex flex-col items-center justify-center gap-3 transition-all duration-200 p-4 ${
          isDragOver
            ? 'border-blue-600 bg-blue-50'
            : 'border-slate-300 bg-white hover:border-blue-600 hover:bg-blue-50/50'
        } ${isLoading ? 'cursor-wait' : 'cursor-pointer'}`}
      >
        {isLoading ? (
          <>
            <CircularProgress size={48} className="text-blue-600" />
            <Typography color="text.secondary">
              {t('loading')}
            </Typography>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
              <CloudUploadIcon className="text-4xl text-blue-600" />
            </div>
            
            <div className="text-center">
              <Typography variant="h6" className="font-semibold text-slate-800 mb-1">
                {isDragOver ? t('dropHere') : t('dropzoneTitle')}
              </Typography>
              <Typography color="text.secondary" className="mb-2">
                {t('dropzoneSubtitle')}
              </Typography>
            </div>

            <div className="flex gap-2 flex-wrap justify-center">
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200">
                <InsertDriveFileIcon className="text-lg text-amber-500" />
                <Typography variant="body2" className="font-medium text-slate-500">
                  .json
                </Typography>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200">
                <FolderZipIcon className="text-lg text-purple-500" />
                <Typography variant="body2" className="font-medium text-slate-500">
                  .zip
                </Typography>
              </div>
            </div>

            <Button
              variant="contained"
              onClick={(e) => {
                e.stopPropagation();
                onOpenFile();
              }}
              className="mt-2 bg-blue-600 normal-case font-semibold px-4 py-1.25 rounded-lg shadow-lg hover:bg-blue-700"
              style={{ boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)' }}
            >
              {t('openFile')}
            </Button>
          </>
        )}
      </div>

      <Typography 
        variant="caption" 
        className="mt-3 text-slate-400 text-center max-w-[400px]"
      >
        {t('supportedFormats')}
      </Typography>
    </div>
  );
}
