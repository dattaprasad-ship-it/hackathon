import * as React from 'react';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { customFieldsService } from '../services/customFieldsService';
import type { CustomField } from '../types/custom-fields.types';
import { useNavigate } from 'react-router-dom';
import { PimTabs } from '../components/PimTabs';

export const CustomFieldsPage: React.FC = () => {
  const [fields, setFields] = React.useState<CustomField[]>([]);
  const [remaining, setRemaining] = React.useState(10);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    try {
      setLoading(true);
      const { fields: data, remaining: rem } = await customFieldsService.list();
      setFields(data);
      setRemaining(rem);
    } catch (error) {
      console.error('Error loading custom fields:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this custom field?')) return;

    try {
      await customFieldsService.delete(id);
      loadFields();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete custom field');
    }
  };

  return (
    <DashboardLayout pageTitle="Custom Fields">
      <div className="space-y-6">
        <PimTabs />
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Custom Fields</h1>
            <p className="text-sm text-gray-600 mt-1">
              Remaining number of custom fields: {remaining}
            </p>
          </div>
          <Button onClick={() => navigate('/pim/config/custom-fields/new')} disabled={remaining === 0}>
            + Add
          </Button>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 text-sm text-gray-600">
              ({fields.length}) Records Found
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Field Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Screen</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Field Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {fields.map((field) => (
                  <tr key={field.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">{field.fieldName}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{field.screen}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{field.fieldType}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/pim/config/custom-fields/${field.id}/edit`)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(field.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

