
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface InvoiceData {
  customerName: string;
  customerEmail: string;
  bookingId: string;
  bikeName: string;
  startDate: string;
  endDate: string;
  days: number;
  pricePerDay: number;
  totalAmount: number;
  pickupLocation: string;
  paymentDate: string;
  taxAmount: number;
}

export const generateInvoice = (data: InvoiceData): string => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add logo and header
  doc.setFontSize(20);
  doc.setTextColor(0, 102, 204);
  doc.text('RideEasy - Bike Rentals', 105, 20, { align: 'center' });
  
  // Add invoice title
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('INVOICE', 105, 30, { align: 'center' });
  
  // Add invoice details
  doc.setFontSize(10);
  doc.text(`Invoice #: ${data.bookingId}`, 20, 40);
  doc.text(`Date: ${data.paymentDate}`, 20, 45);
  
  // Add customer information
  doc.setFontSize(12);
  doc.text('Customer Information', 20, 55);
  doc.setFontSize(10);
  doc.text(`Name: ${data.customerName}`, 20, 62);
  doc.text(`Email: ${data.customerEmail}`, 20, 67);
  
  // Add bike rental information
  doc.setFontSize(12);
  doc.text('Rental Details', 20, 77);
  
  // Create table for rental details
  const rentalDetails = [
    ['Bike', 'Rental Period', 'Days', 'Price/Day', 'Amount'],
    [
      data.bikeName,
      `${data.startDate} to ${data.endDate}`,
      data.days.toString(),
      `₹${data.pricePerDay}`,
      `₹${data.pricePerDay * data.days}`
    ]
  ];
  
  // @ts-ignore
  doc.autoTable({
    startY: 80,
    head: [rentalDetails[0]],
    body: [rentalDetails[1]],
    theme: 'grid',
    headStyles: { fillColor: [0, 102, 204], textColor: 255 },
    styles: { fontSize: 9 }
  });
  
  // Add total calculation
  const finalY = (doc as any).lastAutoTable.finalY || 120;
  doc.text(`Subtotal: ₹${data.pricePerDay * data.days}`, 140, finalY + 10);
  doc.text(`Tax (18%): ₹${data.taxAmount.toFixed(2)}`, 140, finalY + 15);
  doc.text(`Total: ₹${data.totalAmount.toFixed(2)}`, 140, finalY + 20);
  
  // Add pickup location
  doc.setFontSize(12);
  doc.text('Pickup Information', 20, finalY + 30);
  doc.setFontSize(10);
  doc.text(`Location: ${data.pickupLocation}`, 20, finalY + 37);
  
  // Add footer
  doc.setFontSize(8);
  doc.text('Thank you for choosing RideEasy! We hope you enjoy your ride.', 105, finalY + 50, { align: 'center' });
  doc.text('For any questions, please contact support@rideeasy.com', 105, finalY + 55, { align: 'center' });
  
  // Save the PDF and return as a blob URL
  const pdfBlob = doc.output('blob');
  return URL.createObjectURL(pdfBlob);
};

export const downloadInvoice = (data: InvoiceData, fileName: string = 'rideeasy-invoice.pdf'): void => {
  const pdfUrl = generateInvoice(data);
  const link = document.createElement('a');
  link.href = pdfUrl;
  link.download = fileName;
  link.click();
};

export const viewInvoice = (data: InvoiceData): void => {
  const pdfUrl = generateInvoice(data);
  window.open(pdfUrl, '_blank');
};
