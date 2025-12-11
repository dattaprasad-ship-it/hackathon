import * as React from 'react';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dataImportService } from '../services/dataImportService';
import type { DataImportResult } from '../types/data-import.types';
import { PimTabs } from '../components/PimTabs';

export const DataImportPage: React.FC = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [result, setResult] = React.useState<DataImportResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    try {
      setUploading(true);
      const importResult = await dataImportService.upload(file);
      setResult(importResult);
      if (importResult.success) {
        alert(`Successfully imported ${importResult.importedRecords} records`);
      } else {
        alert(`Import completed with ${importResult.failedRecords} errors`);
      }
    } catch (error: any) {
      console.error('Error uploading file:', error);
      alert(error.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const downloadSample = () => {
    const sampleCSV = `Employee Id,First Name,Middle Name,Last Name,Date of Birth,Gender
EMP001,John,,Doe,1990-01-15,Male
EMP002,Jane,Marie,Smith,1992-05-20,Female`;

    const blob = new Blob([sampleCSV], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_import_sample.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout pageTitle="Data Import">
      <div className="space-y-6">
        <PimTabs />
        <h1 className="text-2xl font-bold">Import Employee Data</h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <h3 className="font-semibold mb-2">Note:</h3>
            <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
              <li>Column order should not be changed</li>
              <li>First Name and Last Name are compulsory</li>
              <li>All date fields should be in YYYY-MM-DD format</li>
              <li>If gender is specified, value should be either Male or Female</li>
              <li>Each import file should be configured for 100 records or less</li>
              <li>Multiple import files may be required</li>
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sample CSV file:</label>
            <Button variant="outline" onClick={downloadSample}>
              Download
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Select File*</label>
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="max-w-md"
            />
            <p className="text-sm text-gray-500 mt-1">Accepts up to 1MB</p>
          </div>

          <Button onClick={handleUpload} disabled={!file || uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>

          {result && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <h3 className="font-semibold mb-2">Import Results:</h3>
              <p>Total Records: {result.totalRecords}</p>
              <p>Imported: {result.importedRecords}</p>
              <p>Failed: {result.failedRecords}</p>
              {result.errors && result.errors.length > 0 && (
                <div className="mt-2">
                  <h4 className="font-semibold">Errors:</h4>
                  <ul className="list-disc list-inside text-sm">
                    {result.errors.slice(0, 10).map((error, idx) => (
                      <li key={idx}>
                        Row {error.row}: {error.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

