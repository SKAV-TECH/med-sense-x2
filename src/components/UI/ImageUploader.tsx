
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, X, Check, Image as ImageIcon, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  acceptedFileTypes?: string[];
  maxSize?: number;
  label?: string;
  isLoading?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  maxSize = 10 * 1024 * 1024, // 10MB
  label = 'Upload Image',
  isLoading = false,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    
    if (acceptedFiles.length === 0) {
      return;
    }
    
    const selectedFile = acceptedFiles[0];
    
    if (selectedFile.size > maxSize) {
      setError(`File size exceeds the maximum limit of ${maxSize / (1024 * 1024)}MB`);
      return;
    }
    
    setFile(selectedFile);
    
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // For non-image files like PDFs
      setPreview(null);
    }
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        onImageUpload(selectedFile);
      }
    }, 50);
  }, [maxSize, onImageUpload]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize,
    multiple: false,
  });
  
  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setUploadProgress(0);
  };
  
  const getFileTypeIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <ImageIcon size={24} />;
    } else if (fileType === 'application/pdf') {
      return <FileText size={24} />;
    }
    return <FileText size={24} />;
  };

  return (
    <div className="w-full">
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-primary/5'
          }`}
        >
          <input {...getInputProps()} />
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: isDragActive ? 1.05 : 1 }}
            className="flex flex-col items-center justify-center py-4"
          >
            <Upload
              className={`mb-2 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`}
              size={36}
            />
            <p className="text-sm font-medium mb-1">
              {isDragActive ? 'Drop the file here' : label}
            </p>
            <p className="text-xs text-muted-foreground mb-2">
              {acceptedFileTypes.map(type => type.split('/')[1]).join(', ')} files up to {maxSize / (1024 * 1024)}MB
            </p>
            <Button variant="outline" size="sm" className="mt-2">
              Select File
            </Button>
          </motion.div>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              {getFileTypeIcon(file.type)}
              <div className="ml-3">
                <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={removeFile}
              disabled={isLoading}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={18} />
            </Button>
          </div>
          
          {preview && (
            <div className="mb-3 relative rounded-md overflow-hidden">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-auto max-h-48 object-contain bg-accent/30 rounded-md"
              />
            </div>
          )}
          
          {uploadProgress < 100 ? (
            <div className="mt-2">
              <Progress value={uploadProgress} className="h-1" />
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {uploadProgress}%
              </p>
            </div>
          ) : (
            <div className="flex items-center text-sm text-green-500 mt-2">
              <Check size={16} className="mr-1" />
              <span>Upload complete</span>
            </div>
          )}
        </div>
      )}
      
      {error && (
        <p className="text-sm text-destructive mt-2">{error}</p>
      )}
    </div>
  );
};

export default ImageUploader;
