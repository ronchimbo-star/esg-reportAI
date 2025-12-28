import { useState } from 'react';
import { Download, Database, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function DatabaseExport() {
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState('');

  const exportTable = async (tableName: string, filename: string) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error(`Error exporting ${tableName}:`, error);
      return false;
    }
  };

  const exportAllData = async () => {
    setExporting(true);
    setMessage('');

    try {
      const timestamp = new Date().toISOString().split('T')[0];

      const results = await Promise.all([
        exportTable('generated_reports', `reports-${timestamp}.json`),
        exportTable('report_rate_limits', `rate-limits-${timestamp}.json`),
        exportTable('banned_ips', `banned-ips-${timestamp}.json`),
        exportTable('seo_settings', `seo-settings-${timestamp}.json`),
      ]);

      const allSuccess = results.every((r) => r);

      if (allSuccess) {
        setMessage('All database tables exported successfully');
      } else {
        setMessage('Some tables failed to export. Check console for details.');
      }
    } catch (error) {
      setMessage('Error exporting database: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setExporting(false);
    }
  };

  const exportCSV = async () => {
    setExporting(true);
    setMessage('');

    try {
      const { data, error } = await supabase
        .from('generated_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const headers = ['ID', 'Company', 'Email', 'IP Address', 'Industries', 'Jurisdictions', 'Frameworks', 'Created At'];
      const rows = data.map((report) => [
        report.id,
        report.company_name,
        report.user_email || '',
        report.user_ip,
        report.industries.join('; '),
        report.jurisdictions.join('; '),
        report.frameworks.join('; '),
        new Date(report.created_at).toISOString(),
      ]);

      const csv = [
        headers.join(','),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reports-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMessage('CSV export completed successfully');
    } catch (error) {
      setMessage('Error exporting CSV: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Database Export</h2>
        <p className="text-sm sm:text-base text-gray-600">Export database tables for backup or analysis</p>
      </div>

      {message && (
        <div className={`p-3 sm:p-4 rounded-lg flex items-start gap-2 text-sm ${message.includes('Error') || message.includes('failed') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{message}</span>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Database className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">Full Database Export</h3>
              <p className="text-xs sm:text-sm text-gray-600">JSON format</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4">
            Export all database tables as separate JSON files. Includes reports, rate limits, banned IPs, and SEO settings.
          </p>
          <button
            onClick={exportAllData}
            disabled={exporting}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
          >
            <Download className="w-4 sm:w-5 h-4 sm:h-5" />
            {exporting ? 'Exporting...' : 'Export All Tables (JSON)'}
          </button>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">Reports CSV Export</h3>
              <p className="text-xs sm:text-sm text-gray-600">Spreadsheet format</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4">
            Export generated reports as a CSV file for easy analysis in spreadsheet applications like Excel or Google Sheets.
          </p>
          <button
            onClick={exportCSV}
            disabled={exporting}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
          >
            <Download className="w-4 sm:w-5 h-4 sm:h-5" />
            {exporting ? 'Exporting...' : 'Export Reports (CSV)'}
          </button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-900 mb-1">Important Notes</h4>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Exported files contain sensitive information. Store them securely.</li>
              <li>• JSON exports preserve all data types and relationships.</li>
              <li>• CSV exports are best for reports analysis and data visualization.</li>
              <li>• Regular backups are recommended for data safety.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
