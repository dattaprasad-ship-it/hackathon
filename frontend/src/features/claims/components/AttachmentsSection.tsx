import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useAttachments } from '../hooks/useAttachments';
import { useClaimDetail } from '../hooks/useClaimDetail';
import { AddAttachmentModal } from './AddAttachmentModal';

interface AttachmentsSectionProps {
  claimId: string | null;
}

export const AttachmentsSection: React.FC<AttachmentsSectionProps> = ({ claimId }) => {
  const { claim } = useClaimDetail(claimId);
  const {
    attachments,
    loading,
    error,
    uploadProgress,
    uploadAttachment,
    downloadAttachment,
    deleteAttachment,
  } = useAttachments(claimId);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);

  const canModify = claim?.status === 'Initiated';

  const handleUpload = async (file: File, description?: string) => {
    if (!claimId) return;

    setUploading(true);
    try {
      await uploadAttachment(file, description);
      setShowAddModal(false);
    } catch (err) {
      // Error is handled by useAttachments hook
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (attachmentId: string, filename: string) => {
    if (!claimId) return;

    try {
      await downloadAttachment(attachmentId, filename);
    } catch (err) {
      console.error('Failed to download attachment:', err);
    }
  };

  const handleDelete = async (attachmentId: string) => {
    if (!window.confirm('Are you sure you want to delete this attachment?')) {
      return;
    }

    try {
      await deleteAttachment(attachmentId);
    } catch (err) {
      console.error('Failed to delete attachment:', err);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && !attachments.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Attachments</h2>
          {canModify && (
            <Button onClick={() => setShowAddModal(true)} size="sm" aria-label="Add attachment">
              + Add Attachment
            </Button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {attachments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No attachments added yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attachments.map((attachment) => (
                  <tr key={attachment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {attachment.originalFilename}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFileSize(attachment.fileSize)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {attachment.fileType}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={attachment.description}>
                      {attachment.description || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(attachment.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownload(attachment.id, attachment.originalFilename)}
                          className="text-blue-600 hover:text-blue-900"
                          aria-label={`Download ${attachment.originalFilename}`}
                        >
                          Download
                        </button>
                        {canModify && (
                          <button
                            onClick={() => handleDelete(attachment.id)}
                            className="text-red-600 hover:text-red-900"
                            aria-label={`Delete ${attachment.originalFilename}`}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddAttachmentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleUpload}
        loading={uploading}
        uploadProgress={uploadProgress?.percentage}
      />
    </>
  );
};
