
import React from 'react';


const PDFGenerator = ({beamID}) => {

  const handlePrint = (beamID) => {
    
      let fig=document.querySelector(`#beamFig-${beamID}`)
      fig.classList.add("beamdrawing")
      let tohide=document.querySelectorAll(".beamground")
      tohide.forEach(element => {
        if( element.id!=="toPrint"+beamID){
          element.classList.add("not-printable")
        }else{
          element.classList.add("pagebreak")
        }
      });
      window.print();
      tohide.forEach(element => {
        element.classList.remove("not-printable")
      });
      fig.classList.remove("beamdrawing")
  };
  
  return (
      <button className='btn btn-primary not-printable' onClick={()=>handlePrint(beamID)}>Print</button>
  );
};

export default PDFGenerator;



