import React, { useState } from 'react'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import axios from '../dataFlow/axios';
import { getImg } from './ToolBar';
export const LoadBeam = ({setBeams,changeOrAddBeamProperty,addTool}) => {
  const [beamIDValue, setbeamIDValue] = useState("")


  const getBeam = async (referenceNo) => {
    console.log("Sending Request for Beam ID: ", referenceNo)
      try {
        const res = await axios.get(`get-beam/${referenceNo}/`);
        const jsonData = res.data
         if (jsonData.ERROR === "Beam not found") {
                console.log("Response from Backend:", jsonData.ERROR);
      
              } else {
              console.log("Response from Backend:", jsonData);
              // const tools=jsonData.data.tools
              // console.log(jsonData.data["tools"])
              // tools.pointLoad?.forEach(tool => {
              //   tool["img"]=getImg(tool.id.split("_")[0])
              // });
              // tools.rollerSupport?.forEach(tool => {
              //   tool["img"]=getImg(tool.id.split("_")[0])
              // });
              // tools.hingedSupport?.forEach(tool => {
              //   tool["img"]=getImg(tool.id.split("_")[0])
              // });
              
              console.log("Response made:", jsonData.data);
              setBeams(prevState => ([
                  ...prevState, 
                jsonData.data
              ]));
              
            }
      } catch (error) {
        console.log(error.message);
      }
    };
  return (
         <InputGroup style={{height:"40px"}} id="tour-loadBeam">
         
        <Form.Control
          placeholder="Load Beam"
          aria-label="Load Beam"
          aria-describedby="basic-addon2"style={{maxWidth:"200px"}}
          onChange={(e)=>setbeamIDValue(e.target.value)}
          />
          
        <Button variant="primary" id="button-addon2"
          onClick={()=> getBeam(beamIDValue)}
          >
          Load Beam
        </Button>
      </InputGroup>
  )
}
