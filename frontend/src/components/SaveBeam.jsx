// Sends a beam to backend to be saved.

import React from 'react'
import axios from '../dataFlow/axios';
import CopyButton from './CopyButton';
export const SaveBeam = ({beam,changeOrAddBeamProperty,setMessage}) => {
    

    function copyObjectWithoutCircular(obj) {
        let cache = new Set();
      
        const copy = JSON.parse(JSON.stringify(obj, (key, value) => {
          if (typeof value === 'object' && value !== null) {
            if (cache.has(value)) {
              return; // Skip circular references
            }
            cache.add(value);
          }
          return value;
        }));
      
        cache.clear();
        return copy;
      }
      
      
    function createCopy(obj) {
        let copy = JSON.parse(JSON.stringify(copyObjectWithoutCircular(obj)));
        return copy

      }

      function deleteIMG(array){
        array.forEach(e => {
            delete e.img
        });
      }
    const save = async (beam) => {
        
        let copyofbeam=beam
        copyofbeam=createCopy(copyofbeam)
        const distributedLoad = copyofbeam.tools?.distributedLoad || [];
        const beamPointLoad = copyofbeam.tools?.pointLoad || [];
        const beamRollerSupport = copyofbeam.tools?.rollerSupport || [];
        const beamHingedSupport = copyofbeam.tools?.hingedSupport || [];
        deleteIMG(distributedLoad)
        deleteIMG(beamPointLoad)
        deleteIMG(beamRollerSupport)
        deleteIMG(beamHingedSupport)
      

        console.log(" saving beam:", {
            "beam":copyofbeam,
        })
        try {
            const response = await axios({
                method: 'post',
                url: '/api/save-beam/',
                data: {
                    "beam": copyofbeam,
                }
            });

            if (response.data.ERROR === "Beam couldnot be saved") {
                console.log("Response from Backend:", response.data.ERROR);
                setMessage(["danger","Beam couldnot be saved",true])
      
              } else {
                  console.log("Beam is saved: ", response.data);
                  changeOrAddBeamProperty(beam.id,"referenceNo",response.data.referenceNo);
                setMessage(["success",
                <>
                <p>
                "Beam is successfully saved"<br/>
                Beam Reference no. is <strong>{response.data.referenceNo}</strong>
                </p>
                <CopyButton textToCopy={response.data.referenceNo}/>
                </>
                ,true])

            }
         
        } catch (error) {
            console.log("Error: ", error.message);
        }
    };

  return (
    <button className='btn btn-outline-primary p-1'
    onClick={()=>save(beam)}>
Save Beam
      </button>
  )
}
