import * as React from 'react';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { reportsService } from '../services/reportsService';
import type { CreateReportRequest, SelectionCriteria, DisplayField } from '../types/reports.types';
import { useNavigate } from 'react-router-dom';
import { PimTabs } from '../components/PimTabs';

export const AddReportPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState<CreateReportRequest>({
    reportName: '',
    selectionCriteria: [],
    displayFields: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reportName.trim()) {
      alert('Report name is required');
      return;
    }

    try {
      setLoading(true);
      await reportsService.create(formData);
      navigate('/pim/reports');
    } catch (error: any) {
      console.error('Error creating report:', error);
      alert(error.response?.data?.message || 'Failed to create report');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/pim/reports');
  };

  const addSelectionCriteria = () => {
    setFormData({
      ...formData,
      selectionCriteria: [
        ...(formData.selectionCriteria || []),
        { criteriaType: '', criteriaValue: '', includeOption: 'Current Employees Only' },
      ],
    });
  };

  const removeSelectionCriteria = (index: number) => {
    const criteria = [...(formData.selectionCriteria || [])];
    criteria.splice(index, 1);
    setFormData({ ...formData, selectionCriteria: criteria });
  };

  const updateSelectionCriteria = (index: number, field: keyof SelectionCriteria, value: string) => {
    const criteria = [...(formData.selectionCriteria || [])];
    criteria[index] = { ...criteria[index], [field]: value };
    setFormData({ ...formData, selectionCriteria: criteria });
  };

  const addDisplayField = () => {
    setFormData({
      ...formData,
      displayFields: [
        ...(formData.displayFields || []),
        { fieldGroup: 'Personal', fieldName: 'Employee ID', displayOrder: (formData.displayFields?.length || 0) + 1 },
      ],
    });
  };

  const removeDisplayField = (index: number) => {
    const fields = [...(formData.displayFields || [])];
    fields.splice(index, 1);
    setFormData({ ...formData, displayFields: fields });
  };

  const updateDisplayField = (index: number, field: keyof DisplayField, value: any) => {
    const fields = [...(formData.displayFields || [])];
    fields[index] = { ...fields[index], [field]: value };
    setFormData({ ...formData, displayFields: fields });
  };

  return (
    <DashboardLayout pageTitle="Add Report">
      <div className="space-y-6">
        <PimTabs />
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Add Report</h1>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.reportName}
                onChange={(e) => setFormData({ ...formData, reportName: e.target.value })}
                placeholder="Enter report name"
                required
                className="max-w-md"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Selection Criteria</h2>
                <Button type="button" variant="outline" size="sm" onClick={addSelectionCriteria}>
                  + Add
                </Button>
              </div>
              {formData.selectionCriteria?.map((criteria, index) => (
                <div key={index} className="flex gap-2 mb-2 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Criteria Type</label>
                    <select
                      value={criteria.criteriaType || ''}
                      onChange={(e) => updateSelectionCriteria(index, 'criteriaType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">-- Select --</option>
                      <option value="Employment Status">Employment Status</option>
                      <option value="Job Title">Job Title</option>
                      <option value="Sub Unit">Sub Unit</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Include</label>
                    <select
                      value={criteria.includeOption || ''}
                      onChange={(e) => updateSelectionCriteria(index, 'includeOption', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">-- Select --</option>
                      <option value="Current Employees Only">Current Employees Only</option>
                    </select>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeSelectionCriteria(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Display Fields</h2>
                <Button type="button" variant="outline" size="sm" onClick={addDisplayField}>
                  + Add
                </Button>
              </div>
              {formData.displayFields?.map((field, index) => (
                <div key={index} className="flex gap-2 mb-2 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Field Group</label>
                    <select
                      value={field.fieldGroup}
                      onChange={(e) => updateDisplayField(index, 'fieldGroup', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="Personal">Personal</option>
                      <option value="Job">Job</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Field Name</label>
                    <Input
                      value={field.fieldName}
                      onChange={(e) => updateDisplayField(index, 'fieldName', e.target.value)}
                      placeholder="Field name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                    <Input
                      type="number"
                      value={field.displayOrder}
                      onChange={(e) => updateDisplayField(index, 'displayOrder', parseInt(e.target.value) || 0)}
                      className="w-20"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeDisplayField(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

