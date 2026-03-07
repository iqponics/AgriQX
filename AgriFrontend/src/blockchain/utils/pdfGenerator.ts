import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Helper to convert an HTML element to a PDF blob.
 * @param element The HTML element (usually an off-screen ref) to convert
 * @returns A Promise that resolves to a Blob representing the PDF
 */
export const generatePdfBlob = async (element: HTMLElement): Promise<Blob> => {
    try {
        // Use html2canvas to render the component as an image
        const canvas = await html2canvas(element, {
            scale: 2, // Higher scale for better resolution
            useCORS: true, // Allow cross-origin images to be rendered
            logging: false
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);

        // A4 size parameters
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

        // Convert the PDF instance to an ArrayBuffer/Blob
        const pdfBlob = pdf.output('blob');
        return pdfBlob;
    } catch (error) {
        console.error('Error generating PDF blob:', error);
        throw error;
    }
};

/**
 * Helper to trigger a direct download of the generated PDF in the browser.
 * Useful for debugging and letting the user save the report manually.
 */
export const downloadPdf = async (element: HTMLElement, filename: string = 'Traceability_Report.pdf') => {
    try {
        const pdfBlob = await generatePdfBlob(element);
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading PDF:', error);
        throw error;
    }
};
