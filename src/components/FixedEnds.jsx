import { useState } from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { ImgFixedSupport, ImgFixedSupportOnBeam } from './Img';
import ReactDOM from 'react-dom'; // Import ReactDOM

function FixedEnds({beamID,
changeOrAddBeamProperty,
deleteBeamProperty,
    checkedLeft,
    setCheckedLeft,
    checkedRight,
    setCheckedRight,
    addSupportPositions,
    beamLength,
    removeSupportPositions}) {

  return (
      <>
      <ToggleButton
        className="mb-2"
        id="toggle-check-left"
        type="checkbox"
        variant="outline-secondary"
        checked={checkedLeft}
        value="1"
        style={{width:"70px",height:"70px",display: "flex", flexDirection: "row", justifyContent: "center",alignItems:"center"}}
        onChange={(e) => {setCheckedLeft(e.currentTarget.checked)
            if(e.currentTarget.checked){
                changeOrAddBeamProperty(beamID, "fixedSupportLeft", 1)
                addSupportPositions(beamID,0,"fixedSupportLeft")
              }else{
                deleteBeamProperty(beamID, "fixedSupportLeft")
                removeSupportPositions(0)
              }
            }}
            >        
      <ImgFixedSupport/>
      </ToggleButton>
      <ToggleButton
        className="mb-2"
        id="toggle-check-right"
        type="checkbox"
        variant="outline-secondary"
        checked={checkedRight}
        value="2"
        style={{width:"70px",height:"70px",display: "flex", flexDirection: "row", justifyContent: "center",alignItems:"center"}}
        onChange={(e) => {setCheckedRight(e.currentTarget.checked)
          if(e.currentTarget.checked){
            changeOrAddBeamProperty(beamID, "fixedSupportRight", 1)
            addSupportPositions(beamID,beamLength,"fixedSupportRight")
          }else{
            deleteBeamProperty(beamID, "fixedSupportRight")
            removeSupportPositions(beamLength)
          }
          
        }}
        >        
      <ImgFixedSupport className="mirror-image"/>
      </ToggleButton>
        </>
  );
}

export default FixedEnds;