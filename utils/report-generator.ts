"use client";

// utils/report-generator.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePDFReport = (tenantReport: any, monthlyReports: any[]) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Tenant Payment Report', 14, 22);
  
  // Add tenant info
  doc.setFontSize(12);
  doc.text(`Tenant: ${tenantReport.tenantName}`, 14, 40);
  doc.text(`Property: ${tenantReport.property}`, 14, 48);
  doc.text(`Unit: ${tenantReport.unit}`, 14, 56);
  doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 14, 64);
  
  // Add summary table
  autoTable(doc, {
    startY: 70,
    head: [['Metric', 'Value']],
    body: [
      ['Total Paid', `$${tenantReport.totalPaid.toFixed(2)}`],
      ['On-Time Rate', `${tenantReport.onTimePaymentRate}%`],
      ['Average Delay', `${tenantReport.averagePaymentDelay} days`],
      ['Total Late Fees', `$${tenantReport.totalLateFees.toFixed(2)}`],
    ],
  });
  
  // Add payment history table
  const tableData = monthlyReports.map(report => [
    `${report.month} ${report.year}`,
    `$${report.rentAmount}`,
    `$${report.paidAmount}`,
    report.paymentDate || 'Not Paid',
    report.daysLate.toString(),
    `$${report.lateFees}`,
    report.status.toUpperCase(),
  ]);
  
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [['Month', 'Rent Due', 'Paid', 'Payment Date', 'Days Late', 'Late Fees', 'Status']],
    body: tableData,
  });
  
  // Save the PDF
  doc.save(`tenant-report-${tenantReport.tenantId}-${new Date().toISOString().split('T')[0]}.pdf`);
};