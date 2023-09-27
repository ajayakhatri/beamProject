import ToggleButton from 'react-bootstrap/ToggleButton';
import { ImgFixedSupport } from './Img';
import { useState } from 'react';

function FixedEnds({beam,
changeOrAddBeamProperty,
deleteBeamProperty,
    // checkedLeft,
    // setCheckedLeft,
    // checkedRight,
    // setCheckedRight,
    addSupportPositions,
    beamLength,
    removeSupportPositions}) {

const [checkedLeft, setCheckedLeft] = useState(beam.fixedSupportLeft)
const [checkedRight, setCheckedRight] = useState(beam.fixedSupportRight)

  return (
      <>
      <ToggleButton
        id={`toggle-check-left-${beam.id}`}
        type="checkbox"
        variant="outline-secondary"
        checked={checkedLeft}
        value="1"
        style={{width:"65px",height:"65px",display: "flex", flexDirection: "row", justifyContent: "center",alignItems:"center"}}
        onChange={(e) => {setCheckedLeft(e.currentTarget.checked)
            if(e.currentTarget.checked){
                changeOrAddBeamProperty(beam.id, "fixedSupportLeft", true)
                addSupportPositions(beam.id,0,"fixedSupportLeft")
              }else{
                changeOrAddBeamProperty(beam.id, "fixedSupportLeft", false)
                // deleteBeamProperty(beam.id, "fixedSupportLeft")
                removeSupportPositions(0)
              }
            }}
            >        
      <ImgFixedSupport/>
      </ToggleButton>
      <ToggleButton
        id={`toggle-check-right-${beam.id}`}
        type="checkbox"
        variant="outline-secondary"
        checked={checkedRight}
        value="2"
        style={{width:"65px",height:"65px",display: "flex", flexDirection: "row", justifyContent: "center",alignItems:"center"}}
        onChange={(e) => {setCheckedRight(e.currentTarget.checked)
          if(e.currentTarget.checked){
            changeOrAddBeamProperty(beam.id, "fixedSupportRight", true)
            addSupportPositions(beam.id,beamLength,"fixedSupportRight")
          }else{
            changeOrAddBeamProperty(beam.id, "fixedSupportRight", false)
            // deleteBeamProperty(beam.id, "fixedSupportRight")
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