// This is a simple PDF generator service
// In a real application, you would use a library like jsPDF or pdfmake
// For this demo, we'll simulate PDF generation with text content

export const generatePDF = (content: string): Blob => {
  // In a real application, this would convert the content to a PDF
  // For now, we'll just create a text blob with a PDF header
  
  const pdfHeader = '%PDF-1.5\n%¥±ë\n\n';
  const pdfContent = pdfHeader + content;
  
  // Create a blob that pretends to be a PDF
  return new Blob([pdfContent], { type: 'application/pdf' });
};

export const generateTextFile = (content: string): Blob => {
  return new Blob([content], { type: 'text/plain' });
};
