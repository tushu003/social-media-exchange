import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (description: string, file: File | null) => Promise<void>;
}

export default function ReportModal({ isOpen, onClose, onSubmit }: ReportModalProps) {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) {
        alert('File size must be less than 50MB');
        return;
      }
      setFile(selectedFile);

      if (selectedFile.type.startsWith('image/')) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
      }
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error("Please provide a description");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(description, file);
      // Reset form state
      setDescription('');
      setFile(null);
      setPreviewUrl(null);
      onClose(); // Close modal after successful submission
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error("Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[400px] max-w-[95%] relative mx-4">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-medium text-gray-900 mb-3">
          Report Review
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          If this comment is hateful or abusive, please upload a screenshot or file as proof to help us review it.
        </p>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your other issues"
          className="w-full h-[100px] p-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 resize-none mb-4"
          disabled={isSubmitting}
        />

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Upload supporting file*</p>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.png"
            className="hidden"
            id="file-upload"
            disabled={isSubmitting}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer block w-full p-3 text-sm border border-gray-200 rounded-lg text-center hover:bg-gray-50"
          >
            {file ? file.name : 'Choose files'}
          </label>

          {previewUrl && (
            <div className="mt-3 relative rounded-lg overflow-hidden z-10">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-[120px] object-cover rounded-lg"
              />
              <button
                onClick={() => {
                  setFile(null);
                  setPreviewUrl(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-1">
            Accepted formats: PDF, JPG, PNG
            <span className="float-right">Maximum file size: 50 MB</span>
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !description.trim()}
            className="flex-1 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? 'Submitting...' : 'Report'}
          </button>
        </div>
      </div>
    </div>
  );
}
