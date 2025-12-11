import * as React from 'react';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PimTabs } from '../components/PimTabs';
import { apiClient } from '@/utils/api';

interface TerminationReason {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export const TerminationReasonsPage: React.FC = () => {
  const [reasons, setReasons] = React.useState<TerminationReason[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [newReasonName, setNewReasonName] = React.useState('');
  const [adding, setAdding] = React.useState(false);

  React.useEffect(() => {
    loadReasons();
  }, []);

  const loadReasons = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<{ data: TerminationReason[] }>('/termination-reasons');
      setReasons(response.data.data || []);
    } catch (error) {
      console.error('Error loading termination reasons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newReasonName.trim()) {
      alert('Please enter a termination reason name');
      return;
    }

    try {
      setAdding(true);
      await apiClient.post('/termination-reasons', { name: newReasonName.trim() });
      setNewReasonName('');
      loadReasons();
    } catch (error: any) {
      console.error('Error adding termination reason:', error);
      alert(error.response?.data?.message || 'Failed to add termination reason');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this termination reason?')) return;

    try {
      await apiClient.delete(`/termination-reasons/${id}`);
      loadReasons();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete termination reason');
    }
  };

  return (
    <DashboardLayout pageTitle="Termination Reasons">
      <div className="space-y-6">
        <PimTabs />
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Termination Reasons</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter termination reason name"
              value={newReasonName}
              onChange={(e) => setNewReasonName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
              className="max-w-md"
            />
            <Button onClick={handleAdd} disabled={adding}>
              {adding ? 'Adding...' : '+ Add'}
            </Button>
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : (
            <div>
              <div className="p-4 text-sm text-gray-600">
                ({reasons.length}) Records Found
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reasons.map((reason) => (
                    <tr key={reason.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{reason.name}</td>
                      <td className="px-4 py-3 text-sm">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(reason.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

