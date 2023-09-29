
import React from 'react';


const PDFGenerator = ({beamID}) => {

  const handlePrint = (beamID) => {
      const divToPrint = document.getElementById(`curves-${beamID}`);
      const beamInfo = document.querySelector(`.beaminfo-${beamID}`);
      const beam = document.getElementById(`beamFig-${beamID}`);
      beam.classList.add("printable")
      beamInfo.classList.add("printable")
      divToPrint.classList.add("printable")
      let tohide=document.querySelectorAll(".tohide")
      tohide.forEach(element => {
        element.classList.add("not-printable")
      });
      window.print();
      tohide.forEach(element => {
        element.classList.remove("not-printable")
      });
      beam.classList.remove("printable")
      beamInfo.classList.remove("printable")
      divToPrint.classList.remove("printable")
  };

  
  return (
      <button className='btn btn-primary tohide' onClick={()=>handlePrint(beamID)}>Print</button>
  );
};

export default PDFGenerator;



