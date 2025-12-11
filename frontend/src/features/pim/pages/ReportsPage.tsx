import * as React from 'react';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { reportsService } from '../services/reportsService';
import type { Report } from '../types/reports.types';
import { useNavigate } from 'react-router-dom';
import { PimTabs } from '../components/PimTabs';

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = React.useState<Report[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await reportsService.list();
      setReports(data);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await reportsService.list(searchTerm || undefined);
      setReports(data);
    } catch (error) {
      console.error('Error searching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    loadReports();
  };

  const handleExecute = async (id: string) => {
    try {
      const result = await reportsService.execute(id);
      console.log('Report result:', result);
      navigate(`/pim/reports/${id}/view`, { state: { result } });
    } catch (error) {
      console.error('Error executing report:', error);
      alert('Failed to execute report');
    }
  };

  return (
    <DashboardLayout pageTitle="Reports">
      <div className="space-y-6">
        <PimTabs />
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Employee Reports</h1>
          <Button onClick={() => navigate('/pim/reports/new')}>+ Add</Button>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Search by report name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="max-w-md"
          />
          <Button onClick={handleSearch}>Search</Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 text-sm text-gray-600">
              ({reports.length}) Records Found
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Report Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">{report.reportName}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {report.isPredefined ? 'Predefined' : 'Custom'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleExecute(report.id)}
                        >
                          View
                        </Button>
                        {!report.isPredefined && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/pim/reports/${report.id}/edit`)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={async () => {
                                if (confirm('Are you sure you want to delete this report?')) {
                                  try {
                                    await reportsService.delete(report.id);
                                    loadReports();
                                  } catch (error) {
                                    alert('Failed to delete report');
                                  }
                                }
                              }}
                            >
                              Delete
                            </Button>
                          </>
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
    </DashboardLayout>
  );
};

