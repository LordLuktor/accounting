import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FileText, Download, Calendar, BarChart3, PieChart, TrendingUp } from 'lucide-react';

interface ReportsManagerProps {
  businessId: string | null;
}

const ReportsManager: React.FC<ReportsManagerProps> = ({ businessId }) => {
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState('profit-loss');
  const [dateRange, setDateRange] = useState({
    start: '2024-01-01',
    end: '2024-01-31'
  });
  const [generatingReport, setGeneratingReport] = useState(false);

  if (!businessId) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No Business Selected</h2>
          <p className="text-slate-600">Please select a business to generate reports</p>
        </div>
      </div>
    );
  }

  const reportTypes = [
    {
      id: 'profit-loss',
      name: 'Profit & Loss Statement',
      description: 'Revenue and expenses over a period',
      icon: TrendingUp,
      color: 'blue'
    },
    {
      id: 'balance-sheet',
      name: 'Balance Sheet',
      description: 'Assets, liabilities, and equity at a point in time',
      icon: BarChart3,
      color: 'green'
    },
    {
      id: 'cash-flow',
      name: 'Cash Flow Statement',
      description: 'Cash inflows and outflows',
      icon: PieChart,
      color: 'purple'
    },
    {
      id: 'transaction-summary',
      name: 'Transaction Summary',
      description: 'Detailed transaction breakdown',
      icon: FileText,
      color: 'orange'
    }
  ];

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setGeneratingReport(false);
    
    const reportName = reportTypes.find(r => r.id === selectedReport)?.name;
    alert(`${reportName} generated successfully for ${dateRange.start} to ${dateRange.end}!`);
  };

  const handleExportPDF = () => {
    const reportName = reportTypes.find(r => r.id === selectedReport)?.name;
    alert(`Exporting ${reportName} as PDF...`);
  };

  const handleExportExcel = () => {
    const reportName = reportTypes.find(r => r.id === selectedReport)?.name;
    alert(`Exporting ${reportName} as Excel...`);
  };

  const handleViewAll = () => {
    alert('Opening comprehensive reports dashboard...');
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      orange: 'bg-orange-50 text-orange-700 border-orange-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Reports & Analytics</h2>
          <p className="text-slate-600">Generate financial reports and insights</p>
        </div>
        
        <button 
          onClick={handleViewAll}
          className="flex items-center space-x-2 bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors"
        >
          <BarChart3 className="h-4 w-4" />
          <span>View All Reports</span>
        </button>
      </div>

      {/* Report Selection */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Select Report Type</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            const isSelected = selectedReport === report.id;
            
            return (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`p-2 rounded-lg border ${getColorClasses(report.color)}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold text-slate-800">{report.name}</h4>
                </div>
                <p className="text-sm text-slate-600">{report.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Range Selection */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Date Range</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-end space-x-2">
            <button
              onClick={() => setDateRange({
                start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
                end: new Date().toISOString().split('T')[0]
              })}
              className="px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm"
            >
              This Month
            </button>
            <button
              onClick={() => setDateRange({
                start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
                end: new Date().toISOString().split('T')[0]
              })}
              className="px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm"
            >
              This Year
            </button>
          </div>
        </div>
      </div>

      {/* Generate Report */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              {reportTypes.find(r => r.id === selectedReport)?.name}
            </h3>
            <p className="text-slate-600">
              {dateRange.start} to {dateRange.end}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleExportPDF}
              disabled={generatingReport}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              <span>PDF</span>
            </button>
            <button 
              onClick={handleExportExcel}
              disabled={generatingReport}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              <span>Excel</span>
            </button>
            <button 
              onClick={handleGenerateReport}
              disabled={generatingReport}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {generatingReport ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  <span>Generate Report</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sample Report Preview */}
        <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
          <h4 className="font-semibold text-slate-800 mb-4">Report Preview</h4>
          
          {selectedReport === 'profit-loss' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-300">
                <span className="font-medium text-slate-800">Total Revenue</span>
                <span className="font-semibold text-green-600">$12,847.50</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-300">
                <span className="font-medium text-slate-800">Total Expenses</span>
                <span className="font-semibold text-red-600">$8,234.75</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t-2 border-slate-400">
                <span className="font-bold text-slate-800">Net Income</span>
                <span className="font-bold text-blue-600">$4,612.75</span>
              </div>
            </div>
          )}

          {selectedReport === 'balance-sheet' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-300">
                <span className="font-medium text-slate-800">Total Assets</span>
                <span className="font-semibold text-slate-800">$45,230.00</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-300">
                <span className="font-medium text-slate-800">Total Liabilities</span>
                <span className="font-semibold text-slate-800">$12,450.00</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t-2 border-slate-400">
                <span className="font-bold text-slate-800">Owner's Equity</span>
                <span className="font-bold text-blue-600">$32,780.00</span>
              </div>
            </div>
          )}

          {selectedReport === 'cash-flow' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-300">
                <span className="font-medium text-slate-800">Operating Cash Flow</span>
                <span className="font-semibold text-green-600">$8,450.00</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-300">
                <span className="font-medium text-slate-800">Investing Cash Flow</span>
                <span className="font-semibold text-red-600">-$2,100.00</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t-2 border-slate-400">
                <span className="font-bold text-slate-800">Net Cash Flow</span>
                <span className="font-bold text-blue-600">$6,350.00</span>
              </div>
            </div>
          )}

          {selectedReport === 'transaction-summary' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-300">
                <span className="font-medium text-slate-800">Total Transactions</span>
                <span className="font-semibold text-slate-800">2,847</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-300">
                <span className="font-medium text-slate-800">Average Transaction</span>
                <span className="font-semibold text-slate-800">$156.23</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-300">
                <span className="font-medium text-slate-800">Largest Transaction</span>
                <span className="font-semibold text-green-600">$2,500.00</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsManager;