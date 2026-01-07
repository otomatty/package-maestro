import { useState, useMemo, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Chip,
  Alert,
  IconButton,
  Collapse
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useLanguage } from '@/i18n/LanguageContext';
import { FieldType, PresetField } from '@/types';

interface SampleImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (fields: Omit<PresetField, 'id'>[]) => void;
}

interface JsonNode {
  key: string;
  keyPath: string;
  type: FieldType;
  value: unknown;
  children?: JsonNode[];
}

function detectFieldType(value: unknown): FieldType {
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return 'number';
  return 'text';
}

function parseJsonToNodes(obj: Record<string, unknown>, parentPath = ''): JsonNode[] {
  const nodes: JsonNode[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const keyPath = parentPath ? `${parentPath}.${key}` : key;
    
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      // Object - create node with children
      nodes.push({
        key,
        keyPath,
        type: 'text',
        value,
        children: parseJsonToNodes(value as Record<string, unknown>, keyPath)
      });
    } else {
      // Primitive or array
      nodes.push({
        key,
        keyPath,
        type: detectFieldType(value),
        value
      });
    }
  }
  
  return nodes;
}

function getTypeLabel(type: FieldType): string {
  switch (type) {
    case 'text': return 'text';
    case 'number': return 'number';
    case 'boolean': return 'boolean';
    case 'select': return 'select';
  }
}

function getTypeColor(type: FieldType): 'default' | 'primary' | 'secondary' | 'success' {
  switch (type) {
    case 'text': return 'default';
    case 'number': return 'primary';
    case 'boolean': return 'success';
    case 'select': return 'secondary';
  }
}

interface NodeItemProps {
  node: JsonNode;
  depth: number;
  selectedKeys: Set<string>;
  onToggle: (keyPath: string) => void;
}

function NodeItem({ node, depth, selectedKeys, onToggle }: NodeItemProps) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedKeys.has(node.keyPath);

  return (
    <Box sx={{ ml: depth * 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
        {hasChildren && (
          <IconButton size="small" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </IconButton>
        )}
        {!hasChildren && <Box sx={{ width: 28 }} />}
        
        <FormControlLabel
          control={
            <Checkbox
              checked={isSelected}
              onChange={() => onToggle(node.keyPath)}
              size="small"
              disabled={hasChildren}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" component="span" sx={{ fontFamily: 'monospace' }}>
                {node.key}
              </Typography>
              {!hasChildren && (
                <Chip
                  label={getTypeLabel(node.type)}
                  size="small"
                  color={getTypeColor(node.type)}
                  variant="outlined"
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              )}
            </Box>
          }
          sx={{ m: 0 }}
        />
      </Box>
      
      {hasChildren && (
        <Collapse in={expanded}>
          {node.children!.map((child) => (
            <NodeItem
              key={child.keyPath}
              node={child}
              depth={depth + 1}
              selectedKeys={selectedKeys}
              onToggle={onToggle}
            />
          ))}
        </Collapse>
      )}
    </Box>
  );
}

export function SampleImportDialog({ open, onClose, onImport }: SampleImportDialogProps) {
  const { t } = useLanguage();
  const [jsonData, setJsonData] = useState<Record<string, unknown> | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const nodes = useMemo(() => {
    if (!jsonData) return [];
    return parseJsonToNodes(jsonData);
  }, [jsonData]);

  const handleFileSelect = useCallback(async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
        
        try {
          const text = await file.text();
          const parsed = JSON.parse(text);
          setJsonData(parsed);
          setSelectedKeys(new Set());
          setError(null);
        } catch (err) {
          setError(t('invalidJsonFormat'));
        }
      };
      
      input.click();
    } catch (err) {
      setError(t('fileReadError'));
    }
  }, [t]);

  const toggleKey = useCallback((keyPath: string) => {
    setSelectedKeys(prev => {
      const next = new Set(prev);
      if (next.has(keyPath)) {
        next.delete(keyPath);
      } else {
        next.add(keyPath);
      }
      return next;
    });
  }, []);

  const handleImport = useCallback(() => {
    if (!jsonData || selectedKeys.size === 0) return;

    const flattenNodes = (nodes: JsonNode[]): JsonNode[] => {
      const result: JsonNode[] = [];
      for (const node of nodes) {
        if (!node.children) {
          result.push(node);
        } else if (node.children.length > 0) {
          result.push(...flattenNodes(node.children));
        }
      }
      return result;
    };

    const allNodes = flattenNodes(nodes);
    const fields: Omit<PresetField, 'id'>[] = [];

    for (const keyPath of selectedKeys) {
      const node = allNodes.find(n => n.keyPath === keyPath);
      if (node) {
        fields.push({
          keyPath: node.keyPath,
          label: node.key.charAt(0).toUpperCase() + node.key.slice(1),
          type: node.type,
          defaultValue: node.type === 'boolean' ? Boolean(node.value) :
                        node.type === 'number' ? Number(node.value) :
                        String(node.value ?? '')
        });
      }
    }

    onImport(fields);
    handleClose();
  }, [jsonData, selectedKeys, nodes, onImport]);

  const handleClose = () => {
    setJsonData(null);
    setSelectedKeys(new Set());
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('sampleImportTitle')}</DialogTitle>
      <DialogContent>
        {!jsonData ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Button
              variant="outlined"
              size="large"
              startIcon={<UploadFileIcon />}
              onClick={handleFileSelect}
            >
              {t('selectSampleFile')}
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              package.json を選択してください
            </Typography>
          </Box>
        ) : (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('selectKeysToImport')}
            </Typography>
            
            <Box sx={{ 
              maxHeight: 400, 
              overflow: 'auto', 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              p: 1
            }}>
              {nodes.map((node) => (
                <NodeItem
                  key={node.keyPath}
                  node={node}
                  depth={0}
                  selectedKeys={selectedKeys}
                  onToggle={toggleKey}
                />
              ))}
            </Box>

            <Typography variant="body2" sx={{ mt: 2 }}>
              {t('selectedCount')}: {selectedKeys.size}
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t('cancel')}</Button>
        {jsonData && (
          <Button
            onClick={handleFileSelect}
            variant="outlined"
          >
            {t('selectOtherFile')}
          </Button>
        )}
        <Button
          onClick={handleImport}
          variant="contained"
          disabled={!jsonData || selectedKeys.size === 0}
        >
          {t('importSelected')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
