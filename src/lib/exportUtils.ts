import { Expense } from './types';
import { formatDate, getMonthName } from './constants';

export function exportExpensesToCSV(expenses: Expense[], filename?: string): void {
  if (!expenses || expenses.length === 0) {
    alert('No expense records available to export.');
    return;
  }

  // Header row
  const headers = ['Date', 'Category', 'Amount (INR ₹)', 'Note / Description', 'Transaction ID'];

  // Convert expenses rows
  const rows = expenses.map((item) => [
    `"${item.date}"`,
    `"${item.category.replace(/"/g, '""')}"`,
    `"${Number(item.amount).toFixed(2)}"`,
    `"${(item.note || '').replace(/"/g, '""')}"`,
    `"${item.id}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  // Create Blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const defaultFilename = filename || `Expense_Report_${getMonthName().replace(/\s+/g, '_')}.csv`;

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', defaultFilename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
