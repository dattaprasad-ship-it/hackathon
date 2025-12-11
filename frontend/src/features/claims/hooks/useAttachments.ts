import { useState, useEffect, useCallback } from 'react';
import { attachmentsService } from '../services/attachmentsService';
import type { Attachment, FileUploadProgress } from '../types/attachments.types';

export const useAttachments = (claimId: string | null) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<FileUploadProgress | null>(null);

  const fetchAttachments = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await attachmentsService.getByClaimId(id);
      setAttachments(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || err.message || 'Failed to fetch attachments';
      setError(errorMessage);
      setAttachments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (claimId) {
      fetchAttachments(claimId);
    } else {
      setAttachments([]);
      setError(null);
      setLoading(false);
    }
  }, [claimId, fetchAttachments]);

  const uploadAttachment = useCallback(
    async (file: File, description?: string) => {
      if (!claimId) return;

      setLoading(true);
      setError(null);
      setUploadProgress({ loaded: 0, total: file.size, percentage: 0 });

      try {
        const attachment = await attachmentsService.upload(
          claimId,
          file,
          description,
          (progress) => {
            setUploadProgress(progress);
          }
        );
        await fetchAttachments(claimId);
        setUploadProgress(null);
        return attachment;
      } catch (err: any) {
        const errorMessage = err.response?.data?.error?.message || err.message || 'Failed to upload attachment';
        setError(errorMessage);
        setUploadProgress(null);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [claimId, fetchAttachments]
  );

  const downloadAttachment = useCallback(
    async (attachmentId: string, filename: string) => {
      if (!claimId) return;

      try {
        const blob = await attachmentsService.download(claimId, attachmentId);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err: any) {
        const errorMessage = err.response?.data?.error?.message || err.message || 'Failed to download attachment';
        setError(errorMessage);
        throw err;
      }
    },
    [claimId]
  );

  const deleteAttachment = useCallback(
    async (attachmentId: string) => {
      if (!claimId) return;

      setLoading(true);
      setError(null);

      try {
        await attachmentsService.delete(claimId, attachmentId);
        await fetchAttachments(claimId);
      } catch (err: any) {
        const errorMessage = err.response?.data?.error?.message || err.message || 'Failed to delete attachment';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [claimId, fetchAttachments]
  );

  const refresh = useCallback(() => {
    if (claimId) {
      fetchAttachments(claimId);
    }
  }, [claimId, fetchAttachments]);

  return {
    attachments,
    loading,
    error,
    uploadProgress,
    uploadAttachment,
    downloadAttachment,
    deleteAttachment,
    refresh,
  };
};

