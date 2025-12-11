import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useClaimDetail } from '../hooks/useClaimDetail';
import { useExpenses } from '../hooks/useExpenses';
import { useAttachments } from '../hooks/useAttachments';
import { useAuthStore } from '@/store/authStore';
import { claimsService } from '../services/claimsService';
import { ExpensesSection } from './ExpensesSection';
import { AttachmentsSection } from './AttachmentsSection';

export const ClaimDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { claim, loading, error, refresh } = useClaimDetail(id || null);
  const { expenses, totalAmount, refresh: refreshExpenses } = useExpenses(id || null);
  const { attachments, refresh: refreshAttachments } = useAttachments(id || null);
  const [submitting, setSubmitting] = React.useState(false);
  const [approving, setApproving] = React.useState(false);
  const [rejecting, setRejecting] = React.useState(false);
  const [rejectionReason, setRejectionReason] = React.useState('');
  const [showRejectModal, setShowRejectModal] = React.useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number, symbol: string) => {
    return `${symbol}${amount.toFixed(2)}`;
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      Initiated: 'bg-gray-100 text-gray-800',
      Submitted: 'bg-blue-100 text-blue-800',
      'Pending Approval': 'bg-yellow-100 text-yellow-800',
      Approved: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800',
      Paid: 'bg-purple-100 text-purple-800',
      Cancelled: 'bg-gray-100 text-gray-800',
      'On Hold': 'bg-orange-100 text-orange-800',
      'Partially Approved': 'bg-indigo-100 text-indigo-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleSubmit = async () => {
    if (!id) return;

    setSubmitting(true);
    try {
      await claimsService.submit(id);
      await refresh();
      await refreshExpenses();
    } catch (err) {
      console.error('Failed to submit claim:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async () => {
    if (!id) return;

    setApproving(true);
    try {
      await claimsService.approve(id);
      await refresh();
    } catch (err) {
      console.error('Failed to approve claim:', err);
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!id || !rejectionReason.trim()) return;

    setRejecting(true);
    try {
      await claimsService.reject(id, { rejectionReason: rejectionReason.trim() });
      setShowRejectModal(false);
      setRejectionReason('');
      await refresh();
    } catch (err) {
      console.error('Failed to reject claim:', err);
    } finally {
      setRejecting(false);
    }
  };

  const canSubmit = claim?.status === 'Initiated' && expenses && expenses.length > 0 && totalAmount > 0;
  const canApproveReject = (user?.role === 'Admin' || user?.role === 'Manager') && claim?.status === 'Submitted';
  const isEmployee = user?.role === 'Employee';
  const canView = !isEmployee || claim?.createdBy === user?.username;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !claim) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-sm text-red-800">{error || 'Claim not found'}</p>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-sm text-red-800">Access denied. You can only view your own claims.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/claims')} aria-label="Back to claims list">
          ← Back to Claims
        </Button>
      </div>

      <div className="bg-purple-50 rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Claim Details</h1>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(claim.status)}`}
          >
            {claim.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Reference ID</p>
            <p className="text-base font-medium text-gray-900">{claim.referenceId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Employee</p>
            <p className="text-base font-medium text-gray-900">
              {claim.employee.firstName} {claim.employee.lastName} ({claim.employee.employeeId})
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Event</p>
            <p className="text-base font-medium text-gray-900">{claim.eventType.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Currency</p>
            <p className="text-base font-medium text-gray-900">
              {claim.currency.code} ({claim.currency.symbol})
            </p>
          </div>
          {claim.remarks && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">Remarks</p>
              <p className="text-base text-gray-900">{claim.remarks}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600">Created At</p>
            <p className="text-base text-gray-900">{formatDate(claim.createdAt)}</p>
          </div>
          {claim.submittedDate && (
            <div>
              <p className="text-sm text-gray-600">Submitted Date</p>
              <p className="text-base text-gray-900">{formatDate(claim.submittedDate)}</p>
            </div>
          )}
          {claim.approvedDate && (
            <div>
              <p className="text-sm text-gray-600">Approved Date</p>
              <p className="text-base text-gray-900">{formatDate(claim.approvedDate)}</p>
            </div>
          )}
          {claim.rejectedDate && (
            <div>
              <p className="text-sm text-gray-600">Rejected Date</p>
              <p className="text-base text-gray-900">{formatDate(claim.rejectedDate)}</p>
            </div>
          )}
          {claim.rejectionReason && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">Rejection Reason</p>
              <p className="text-base text-red-900">{claim.rejectionReason}</p>
            </div>
          )}
          {claim.approver && (
            <div>
              <p className="text-sm text-gray-600">Approved By</p>
              <p className="text-base text-gray-900">
                {claim.approver.displayName || claim.approver.username}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-gray-900">
              Total Amount ({claim.currency.code}): {formatCurrency(claim.totalAmount, claim.currency.symbol)}
            </p>
            {canSubmit && (
              <Button onClick={handleSubmit} disabled={submitting} aria-label="Submit claim">
                {submitting ? 'Submitting...' : 'Submit Claim'}
              </Button>
            )}
            {canApproveReject && (
              <div className="flex gap-2">
                <Button
                  onClick={handleApprove}
                  disabled={approving}
                  className="bg-green-600 hover:bg-green-700"
                  aria-label="Approve claim"
                >
                  {approving ? 'Approving...' : 'Approve'}
                </Button>
                <Button
                  onClick={() => setShowRejectModal(true)}
                  disabled={rejecting}
                  variant="destructive"
                  aria-label="Reject claim"
                >
                  Reject
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Reject Claim</h3>
            <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason *
            </label>
            <textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm mb-4"
              placeholder="Enter rejection reason..."
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowRejectModal(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!rejectionReason.trim() || rejecting}
              >
                {rejecting ? 'Rejecting...' : 'Reject'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ExpensesSection claimId={id || null} />

      <AttachmentsSection claimId={id || null} />
    </div>
  );
};

