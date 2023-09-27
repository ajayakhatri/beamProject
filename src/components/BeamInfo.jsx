import React, { useState } from 'react'
import Form from 'react-bootstrap/Form';

export const BeamInfo = ({beam,onChange,actualBeamLength}) => {
    const [section, setSection] = useState(beam.section?beam.section:"Rectangular");
    const [radiusValue, setRadiusValue] = useState(beam.radius?beam.radius:0.15);
    const [lengthUnitValue, setLengthUnitValue] = useState(beam.unit?beam.unit:"m");
    const [loadUnitValue, setLoadUnitValue] = useState(beam.loadUnit?beam.loadUnit:"kN");
    const [depthValue, setDepthValue] = useState(beam.depth?beam.depth:0.45);
    const [widthValue, setWidthValue] = useState(beam.width?beam.width:0.30);
    const [MOI, setMOI] = useState(beam.moi);
    const [youngModulus, setYoungModulus] = useState(beam.youngModulus);

    
  return (
    <div style={{marginTop:"55px", position:"relative"}} id="tour-beamInfo">
    <div className='d-flex gap-2 align-items-center  mb-2'>
    <Form.Label htmlFor={`input-loadunit-of-${beam.id}`} style={{width:"105px"}}>Unit of Load :</Form.Label>
<Form.Select  style={{ maxWidth: "120px"}} aria-label="Select Unit of Length of Beam"  id={`input-loadunit-of-${beam.id}`}  

onChange={(e) => {onChange(beam.id, "loadUnit", e.target.value)
setLoadUnitValue(e.target.value)
}}>
      <option style={{backgroundColor:"DimGray", color:"white"}}>{loadUnitValue}</option>
      <option value="kN">kN</option>
      <option value="N">N</option>
      <option value="lb">lb</option>
    </Form.Select>
        </div>
        <div className='d-flex gap-2 align-items-center mb-2' >
    <Form.Label htmlFor={`input-unit-of-length-of-${beam.id}`} style={{width:"105px"}}>Unit of Length :</Form.Label>
<Form.Select style={{ maxWidth: "120px"}} aria-label="Select Unit of Length of Beam"  id={`input-unit-of-length-of-${beam.id}`}  
onChange={(e) => {
  onChange(beam.id, "unit", e.target.value)
  setLengthUnitValue(e.target.value)
  } }>
      <option style={{backgroundColor:"DimGray", color:"white"}}>{lengthUnitValue}</option>
      <option value="m">m</option>
      <option value="cm">cm</option>
      <option value="ft">ft</option>
      <option value="in">in</option>
    </Form.Select>
    </div>
      <div className='d-flex gap-2 align-items-center mb-2' >
         <Form.Label htmlFor={`input-Young-Modulus-of-length${beam.id}`} style={{width:"105px"}}>E ({beam.loadUnit}/{beam.unit}<sup>2</sup>) :</Form.Label>
          <input
          style={{ maxWidth: "120px"}}
               type="number"
               inputMode="numeric"
               min={1}
               value={youngModulus}
               className="form-control "
               id={`input-Young-Modulus-of-length${beam.id}`}
               aria-label={`Enter Young Modulus for Beam ${beam.id}`}
               onChange={(e) => {
                 e.stopPropagation()
                 if ((e.nativeEvent.data === "-" || e.nativeEvent.data === "+")) {
                   return
                 }
                 setYoungModulus(e.target.value);
               }}
               onBlur={(e) =>
               {
                 if(radiusValue===""){
                  setYoungModulus(210);
                  onChange(beam.id, "youngModulus", 210);
                }else{
                  setYoungModulus(e.target.value)
                  onChange(beam.id, "youngModulus", parseFloat(e.target.value));
                 }
               }
               }
             />
         </div>

         
      <div className='d-flex gap-2 align-items-center'>
    <Form.Label htmlFor={`input-beam-section-of-length${beam.id}`} style={{width:"105px"}}>Beam Section :</Form.Label>
<Form.Select style={{ maxWidth: "117px"}} aria-label="Select Unit of Length of Beam"  id={`input-beam-section-of-length${beam.id}`}  
onChange={(e) => {
  setSection(e.target.value)
onChange(beam.id, "section", e.target.value);
setMOI(e.target.value==="Rectangular"?(widthValue*Math.pow(depthValue,3)/12):e.target.value==="Solid Circle"?(Math.PI*Math.pow(radiusValue,4)/4):MOI)

const moiValue=e.target.value==="Rectangular"?(widthValue*Math.pow(depthValue,3)/12):e.target.value==="Solid Circle"?(Math.PI*Math.pow(radiusValue,4)/4):MOI

onChange(beam.id, "moi",moiValue );

setMOI(moiValue)
}}>
      <option style={{backgroundColor:"DimGray", color:"white"}}>{section}</option>
      <option value="Rectangular">Rectangular</option>
      <option value="Solid Circle">Solid Circle</option>
      <option value="Other">Other</option>
    </Form.Select>
        </div>


  {section==="Solid Circle"&&
         <div className='d-flex gap-2 flex-column my-2' >
        <div className='d-flex gap-2'>
         <Form.Label htmlFor={`input-radius-of-${beam.id}`} style={{width:"105px"}}>Radius of Beam :</Form.Label>
          <input
          style={{ maxWidth: "120px"}}
               type="number"
               inputMode="numeric"
               min={1}
               value={radiusValue}
               id={`input-radius-of-${beam.id}`}
               className="form-control "
               aria-label={`Enter Depth of Beam for Beam ${beam.id}`}
               onChange={(e) => {
                 e.stopPropagation()
                 if ((e.nativeEvent.data === "-" || e.nativeEvent.data === "+")) {
                   return
                 }
                 setRadiusValue(e.target.value);
               }}
               onBlur={(e) =>
               {
                 if(radiusValue===""){
                  setRadiusValue(150);
                }else{
                   setRadiusValue(e.target.value)
                   setMOI(Math.PI*Math.pow(radiusValue,4)/4)
                   onChange(beam.id, "radius", radiusValue);
                   onChange(beam.id, "moi", Math.PI*Math.pow(radiusValue,4)/4);
                 }
               }
               }
               />
               </div>
             <div>
                 <div style={{top:"50%",left:actualBeamLength>400?"260px":"0px",position:actualBeamLength>400?"absolute":"relative",height:"100px",width:"100px",border:"solid 1px", borderRadius:"50%"}}>
                <div style={{right:"0",top:"50%",position:"absolute",width:"55px",display:"flex",alignItems:"start"}}>
                <div className="border-dark" style={{ width: "100%", borderTop: "1px solid" }}></div>
                <div style={{marginTop:"-25%"}}>{radiusValue+beam.unit}</div>
                <div className="border-dark" style={{ width: "100%", borderTop: "1px solid" }}></div>
                </div>
                </div>
             </div>
         </div>
        }
{section==="Rectangular"&&
<>  
    <div className='d-flex gap-2 align-items-center my-2' >
    <Form.Label htmlFor={`input-depth-of-${beam.id}`} style={{width:"105px"}}>Depth of Beam :</Form.Label>
     <input
     style={{ maxWidth: "120px"}}
          type="number"
          inputMode="numeric"
          min={1}
          id={`input-depth-of-${beam.id}`}
          value={depthValue}
          className="form-control "
          aria-label={`Enter Depth of Beam for Beam ${beam.id}`}
          onChange={(e) => {
            e.stopPropagation()
            if ((e.nativeEvent.data === "-" || e.nativeEvent.data === "+")) {
              return
            }
            setDepthValue(e.target.value);
          }}
          onBlur={(e) =>
          {
            if(depthValue!==""){
              setDepthValue(e.target.value)
              setMOI((widthValue*Math.pow(depthValue,3)/12))
              onChange(beam.id, "depth", depthValue);
              onChange(beam.id, "moi", (widthValue*Math.pow(depthValue,3)/12));
            }
          }
          }
        />
    </div>
    <div className='d-flex gap-2 align-items-center my-2' >
    <Form.Label htmlFor={`input-width-of${beam.id}`} style={{width:"105px"}}>Width of Beam :</Form.Label>
    <input
    style={{ maxWidth: "120px"}}
          type="number"
          inputMode="numeric"
          min={1}
          id={`input-width-of${beam.id}`}
          value={widthValue}
          className="form-control "
          aria-label={`Enter Width of Beam for Beam ${beam.id}`}
          onChange={(e) => {
            e.stopPropagation()
            if ((e.nativeEvent.data === "-" || e.nativeEvent.data === "+")) {
              return
            }
            setWidthValue(e.target.value);
          }}          
          onBlur={(e) => {
            if(widthValue!==""){
              setWidthValue(e.target.value)
              setMOI((widthValue*Math.pow(depthValue,3)/12))
              onChange(beam.id, "width", widthValue);
              onChange(beam.id, "moi", (widthValue*Math.pow(depthValue,3)/12));
            }
            }
            }
        />
    </div>
    <div>
    <div style={{top:"50%",left:actualBeamLength>400?"260px":"0px",position:actualBeamLength>400?"absolute":"relative",width:"90px", height:"90px",border:"solid 1px"}}>
      {/* Width */}
      <div style={{position:"absolute",top:"100%",display:"flex",justifyContent:"center",width:"100%"}}>
          <div className='strikethrough'>|</div>
          <div className="border-dark" style={{ width: "100%", marginTop: "10px", borderTop: "1px solid" }}></div>
        {widthValue+beam.unit}
          <div className="border-dark" style={{ width: "100%", marginTop: "10px", borderTop: "1px solid" }}></div>
          <div className='strikethrough'>|</div>
      </div>
      {/* Depth */}
      <div style={{position:"absolute",left:"-20px",marginLeft:"10px",display:"flex",justifyContent:"center",flexDirection:"column",height:"90px"}}>
          <div className='mirror-image' style={{position:"absolute",left:"-1.2px",top:"-12px"}}>
          <div className='strikethrough'>|</div>
          </div>
          <div className="border-dark" style={{ height: "100%", borderLeft: "1px solid"}}>
    </div>
    <span style={{transform: "rotate(-90deg)",
    transformOrigin:" left bottom", marginLeft:"20px",height:"100%"}}>
        {depthValue+beam.unit}
    </span>
          <div className="border-dark" style={{ height: "100%", borderLeft: "1px solid" }}></div>
          <div className='mirror-image' style={{position:"absolute",left:"-1.2px",top:"78px"}}>
          <div className='strikethrough'>|</div>
          </div>
      </div>
    </div>
    </div>
    </>
  }

{section==="Other"?
<>
<div className='d-flex gap-2 align-items-center my-2' > 
<Form.Label htmlFor={`input-moi-of${beam.id}`} style={{width:"105px"}}>Moment of Intertia ({beam.unit}<sup>4</sup>):</Form.Label>
     <input
     style={{ maxWidth: "120px"}}
          type="number"
          inputMode="numeric"
          min={1}
          id={`input-moi-of${beam.id}`}
          value={MOI}
          className="form-control "
          aria-label={`Enter Depth of Beam for Beam ${beam.id}`}
          onChange={(e) => {
            e.stopPropagation()
            if ((e.nativeEvent.data === "-" || e.nativeEvent.data === "+")) {
              return
            }
            setMOI(e.target.value);
          }}
          onBlur={(e) =>
          {
            if(depthValue!==""){
              setMOI(parseFloat(e.target.value))
              onChange(beam.id, "moi", parseFloat(e.target.value));
            }
          }
          }
        />
</div>
</>:
<div className={actualBeamLength<400?"mt-4":"mt-0"}>
    Moment of Inertia: {MOI.toExponential(4)+" "+beam.unit}<sup>4</sup>
</div>
    }
    </div>
  )
}

