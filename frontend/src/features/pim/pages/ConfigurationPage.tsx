import * as React from 'react';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { pimConfigService } from '../services/pimConfigService';
import type { PimConfig, UpdatePimConfigRequest } from '../types/pim-config.types';
import { PimTabs } from '../components/PimTabs';

export const ConfigurationPage: React.FC = () => {
  const [config, setConfig] = React.useState<PimConfig | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const data = await pimConfigService.get();
      setConfig(data);
    } catch (error: any) {
      console.error('Error loading config:', error);
      if (error.response?.status === 401) {
        alert('Please log in to access configuration');
      } else {
        alert(`Failed to load configuration: ${error.response?.data?.message || error.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;

    try {
      setSaving(true);
      const updateData: UpdatePimConfigRequest = {
        showDeprecatedFields: config.showDeprecatedFields,
        showSsnField: config.showSsnField,
        showSinField: config.showSinField,
        showUsTaxExemptions: config.showUsTaxExemptions,
      };
      await pimConfigService.update(updateData);
      alert('Configuration saved successfully');
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout pageTitle="Configuration">
        <PimTabs />
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  if (!config) {
    return (
      <DashboardLayout pageTitle="Configuration">
        <PimTabs />
        <div>Failed to load configuration</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Configuration">
      <div className="space-y-6">
        <PimTabs />
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Optional Fields</h1>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Optional Fields</h2>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.showDeprecatedFields}
                onChange={(e) => setConfig({ ...config, showDeprecatedFields: e.target.checked })}
                className="w-4 h-4"
              />
              <span>Show Deprecated Fields</span>
            </label>
            <p className="text-sm text-gray-500 ml-6 mt-1">
              Show Nick Name, Smoker and Military Service in Personal Details
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Country Specific Information</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.showSsnField}
                  onChange={(e) => setConfig({ ...config, showSsnField: e.target.checked })}
                  className="w-4 h-4"
                />
                <span>Show SSN field in Personal Details</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.showSinField}
                  onChange={(e) => setConfig({ ...config, showSinField: e.target.checked })}
                  className="w-4 h-4"
                />
                <span>Show SIN field in Personal Details</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.showUsTaxExemptions}
                  onChange={(e) => setConfig({ ...config, showUsTaxExemptions: e.target.checked })}
                  className="w-4 h-4"
                />
                <span>Show US Tax Exemptions menu</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

