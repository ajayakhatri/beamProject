import React, { useState } from 'react';
import ToolBar, { beamLength, getImg, getToolWidth } from './ToolBar';
import { produce } from "immer";
import { DropableNew } from './DndStage2';
import { BeamBar } from './DndStage1';
import BeamLen from './BeamLen';



function Beam() {
  // const [calcBeamLength, setCalcBeamLength] = useState(beam.length);

  const [beams, setBeams] = useState([
    {
      id: 1,
      length: 400,
      unit: "m",
      tools: {
      },
    }
  ]);

  function addBeam() {
    const newBeam = {
      id: beams.length + 1,
      length: 400,
      unit: "m",
      tools: {
      },
    };
    setBeams([...beams, newBeam]);
  }

  function printInfo(beamID) {
    const beamIndex = beams.findIndex((beam) => beam.id === beamID);
    const beamRollerSupport = beams[beamIndex]?.tools?.rollerSupport || [];
    const beamPointLoad = beams[beamIndex]?.tools?.pointLoad || [];
    const beamHingedSupport = beams[beamIndex]?.tools?.hingedSupport || [];
    console.log(`----Info of beam ${beamID}----`)
    console.log("Roller Supports", beamRollerSupport.length, beamRollerSupport)
    console.log("Point Loads", beamPointLoad.length, beamPointLoad)
    console.log("Hinged Supports", beamHingedSupport.length, beamHingedSupport)
    console.log("-------------")
  }


  function deleteBeam(id) {
    const updatedBeams = beams.filter((beam) => beam.id !== id);
    const updatedBeamsWithIDs = updatedBeams.map((beam, index) => ({
      ...beam,
      id: index + 1,
    }));
    setBeams(updatedBeamsWithIDs);
  }

  function changeBeamValue(id, property, newValue) {
    setBeams((prevBeams) =>
      prevBeams.map((beam) =>
        beam.id === id ? { ...beam, [property]: newValue } : beam
      )
    );
  }

  const changeToolValue = (beamID, toolID, property, newValue) => {
    console.log(`changing....,${property} of ${toolID} of Beam_${beamID} to ${newValue}`)
    setBeams((prevBeams) =>
      produce(prevBeams, (draftBeams) => {
        const toolType = toolID.split("_")[0]
        const beamIndex = draftBeams.findIndex((beam) => beam.id === beamID);
        // console.log(draftBeams)
        if (beamIndex !== -1) {
          const toolIndex = draftBeams[beamIndex].tools[toolType].findIndex(
            (tool) => tool.id === toolID
          );
          if (toolIndex !== -1) {
            // console.log(newValue)
            // console.log(draftBeams[beamIndex].tools[toolType][toolIndex][property])
            draftBeams[beamIndex].tools[toolType][toolIndex][property] = newValue;
          }
        }
      })
    );
  }

  function addTool(beamID, toolType, actualPosition) {
    const toolWidth = getToolWidth()
    console.log("Adding tool.....", {
      "toolType": toolType,
      "position": actualPosition,
      "ToolWidth": toolWidth,
    })
    const beamIndex = beams.findIndex((beam) => beam.id === beamID);
    setBeams(previousBeams => {
      const nextState = produce(previousBeams, (draftBeams) => {
        if (beamIndex !== -1) {
          draftBeams[beamIndex]["tools"] = draftBeams[beamIndex]["tools"] || {};
          draftBeams[beamIndex]["tools"][toolType] = draftBeams[beamIndex]["tools"][toolType] || [];
          console.log(`Received... beamID: ${beamID} and toolType: ${toolType}`)
          const newTool = {
            id: `${toolType}_${beamID}_${draftBeams[beamIndex].tools[toolType].length + 1}`,
            actualPosition: actualPosition,
            positionOnBeam: actualPosition,
            isUp: toolType === "rollerSupport" || toolType === "hingedSupport" ? false : true,
            img: getImg(toolType)
          };
          draftBeams[beamIndex].tools[toolType].push(newTool);
        }
      });
      return nextState;
    });
  }


  return (
    <div>
      <h2>Beams</h2>
      {beams.map((beam) => (
        <div key={beam.id} className='border-1 border-black border p-5 mb-4 position-relative' style={{ borderRadius: "8px" }}>
          <div style={{ color: "white", backgroundColor: "black", position: "absolute", top: 0, left: 0, margin: "5px", padding: "2px 6px", border: "solid 2px white", borderRadius: "6px" }}>Beam {beam.id}</div>
          <BeamLen beam={beam} beams={beams} addTool={addTool} changeBeamValue={changeBeamValue} changeToolValue={changeToolValue} />

          <div className='d-flex justify-content-end gap-2 mt-3'>
            <button onClick={() => deleteBeam(beam.id)}>Delete</button>
            <button onClick={() => printInfo(beam.id)}>Info</button>
            <button onClick={() => console.clear()}>clear</button>
            <button onClick={() => changeToolValue(beam.id, "rollerSupport_1_1", "isUp", true)}>change</button>
          </div>
          {beam.length}
          {beam.unit}
          {beam.scale}
        </div>
      ))}
      <button onClick={addBeam}>Add Beam</button>

    </div>
  )

}

export default Beam;


  // function MakeNewTools({ beamID }) {
  //   const beamIndex = beams.findIndex((beam) => beam.id === beamID);
  //   let beam = beams[beamIndex]
  //   const toolWidth = getToolWidth()
  //   let newToolsDiv = Object.values(beam.tools).map((toolType) =>
  //     toolType.map((tool) =>
  //       <DropableNew beamID={beam.id} id={tool.id} key={tool.id} style={{ width: toolWidth + "px", left: tool.position }}>
  //         <div style={{
  //           scale: "1.8", display: "flex", flexDirection: "row", justifyContent: "center",
  //           marginTop: tool.isUp ? "-44px" : "0px",
  //         }}>
  //           {tool.img}
  //         </div>
  //       </DropableNew >
  //     )
  //   )
  //   return newToolsDiv
  // }
