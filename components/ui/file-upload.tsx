'use client';

import * as React from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CustomButton } from './custom-button';

export interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onClear?: () => void;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
  error?: string;
  selectedFile?: File | null;
}

export function FileUpload({
  onFileSelect,
  onClear,
  accept = '.pdf,.docx,.txt',
  maxSize = 5,
  disabled = false,
  error,
  selectedFile
}: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      return;
    }

    const acceptedTypes = accept.split(',').map(type => type.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!acceptedTypes.some(type => fileExtension === type || file.type.includes(type.replace('.', '')))) {
      return;
    }

    onFileSelect(file);
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleClear = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClear?.();
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return '📄';
    if (ext === 'docx' || ext === 'doc') return '📝';
    return '📃';
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />

      {!selectedFile ? (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300',
            'hover:border-primary/50 hover:bg-accent/50',
            isDragging && !disabled && 'border-primary bg-accent scale-[1.02]',
            !isDragging && !disabled && 'border-border',
            disabled && 'opacity-50 cursor-not-allowed',
            error && 'border-destructive bg-destructive/5'
          )}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className={cn(
              'w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300',
              isDragging 
                ? 'bg-primary text-primary-foreground scale-110' 
                : 'bg-primary/10 text-primary'
            )}>
              <Upload className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <p className="text-base font-medium text-foreground">
                Drop your resume here
              </p>
              <p className="text-sm text-muted-foreground">
                or <span className="text-primary font-medium hover:underline">browse files</span>
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="px-2 py-1 bg-muted rounded-md">PDF</span>
              <span className="px-2 py-1 bg-muted rounded-md">DOCX</span>
              <span className="px-2 py-1 bg-muted rounded-md">TXT</span>
              <span className="text-muted-foreground/60">• Max {maxSize}MB</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-border rounded-xl p-4 bg-card shadow-soft animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                {getFileIcon(selectedFile.name)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                  {selectedFile.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </span>
                  <span className="flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle2 className="w-3 h-3" />
                    Ready
                  </span>
                </div>
              </div>
            </div>

            <CustomButton
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={disabled}
              className="h-9 w-9 p-0 rounded-lg hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </CustomButton>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
