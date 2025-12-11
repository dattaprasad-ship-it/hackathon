import * as React from 'react';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PimTabs } from '../components/PimTabs';
import { apiClient } from '@/utils/api';

interface ReportingMethod {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export const ReportingMethodsPage: React.FC = () => {
  const [methods, setMethods] = React.useState<ReportingMethod[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [newMethodName, setNewMethodName] = React.useState('');
  const [adding, setAdding] = React.useState(false);

  React.useEffect(() => {
    loadMethods();
  }, []);

  const loadMethods = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<{ data: ReportingMethod[] }>('/reporting-methods');
      setMethods(response.data.data || []);
    } catch (error) {
      console.error('Error loading reporting methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newMethodName.trim()) {
      alert('Please enter a reporting method name');
      return;
    }

    try {
      setAdding(true);
      await apiClient.post('/reporting-methods', { name: newMethodName.trim() });
      setNewMethodName('');
      loadMethods();
    } catch (error: any) {
      console.error('Error adding reporting method:', error);
      alert(error.response?.data?.message || 'Failed to add reporting method');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reporting method?')) return;

    try {
      await apiClient.delete(`/reporting-methods/${id}`);
      loadMethods();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete reporting method');
    }
  };

  return (
    <DashboardLayout pageTitle="Reporting Methods">
      <div className="space-y-6">
        <PimTabs />
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Reporting Methods</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter reporting method name"
              value={newMethodName}
              onChange={(e) => setNewMethodName(e.target.value)}
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
                ({methods.length}) Records Found
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {methods.map((method) => (
                    <tr key={method.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{method.name}</td>
                      <td className="px-4 py-3 text-sm">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(method.id)}
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

