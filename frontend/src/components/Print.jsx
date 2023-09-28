
import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PDFGenerator = ({beamID}) => {

  
  const generatePDF = (beamID) => {
      const pdf = new jsPDF('p', 'pt', 'letter');
      const divToPrint = document.getElementById(`curves-${beamID}`);
      html2canvas(divToPrint).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
  
        const width = pdf.internal.pageSize.getWidth();
        const height = (canvas.height * width) / canvas.width;
  
        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
        pdf.save('output.pdf');
      });
 
  };

  return (
    <div>
      <button className='btn btn-primary' onClick={()=>generatePDF(beamID)}>Generate PDF</button>
    </div>
  );
};

export default PDFGenerator;
