// Loads a beam from its reference no.

import React, { useState } from 'react'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import axios from '../dataFlow/axios';
export const LoadBeam = ({setBeams,beams,setMessage}) => {
  const [beamIDValue, setbeamIDValue] = useState("")

  const getBeam = async (referenceNo,beams) => {
    console.log("Sending Request for Beam ID: ", referenceNo)
    const url=`/api/get-beam/${referenceNo}/`
      try {
        const res = await axios.get(url);
        const jsonData = res.data
        console.log(jsonData)
         if (jsonData.ERROR === "Beam not found") {
                console.log("Response from Backend:", jsonData.ERROR);
                setMessage(["danger","Beam not found",true])
              } else {
                console.log("Response from Backend:", jsonData);
                console.log("Response made:", jsonData.data.id);
                const beamIndex = beams.findIndex((beam) => beam.id === parseInt(jsonData.data.id));
                console.log("Response made:",beams);
                console.log("Response made:",!beams[beamIndex]);
                if (!beams[beamIndex]){
                  setMessage(["success","Beam loaded Successfully",true])
                setBeams(prevState => ([
                  ...prevState, 
                  jsonData.data
                ]));
              }else{
                setMessage(["danger","Beam is already loaded",true])
              }
              
            }
          } catch (error) {
            console.log(error);
                // Network Error
                const errorMessage=error.message==="Network Error"?"Could not connect to the server, ensure the server is running at "+axios.defaults.baseURL:"Server could not find the resources at "+axios.defaults.baseURL+url
                setMessage(["danger", 
                <>
                  {error.message==="Request failed with status code 500"?"Beam of reference no. "+referenceNo+" not found":
                  <>
                <p style={{fontSize:"16px",fontWeight:"bold"}}>
                  {error.message}
                </p>
                <li>
                {errorMessage}
                </li>
                  </>
                }
                </>
                , true])
          }
    };
  return (
         <InputGroup style={{height:"40px"}} id="tour-loadBeam">
        <Form.Control
          placeholder="Load Beam"
          aria-label="Load Beam"
          type="number"
          inputMode="numeric"
          aria-describedby="basic-addon2"style={{maxWidth:"100px"}}
          onChange={(e)=>
            setbeamIDValue(e.target.value)
          }
          />
          
        <Button variant="primary" id="button-addon2"
          onClick={()=> {
            if(beamIDValue!==""){
              getBeam(beamIDValue,beams,setMessage)
            }else{
              setMessage(["danger","Invalid beam number",true])
            }
          }
        }
          >
          Load Beam
        </Button>
      </InputGroup>
  )
}
