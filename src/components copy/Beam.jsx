import React, { useState } from 'react';
import ToolBar, { actualbeamLength, getImg, getToolWidth } from './ToolBar';
import { produce } from "immer";
import { DropableNew } from './DndStage2';
import { BeamBar } from './DndStage1';

function InputBeamLength({ beam, onChange, updateScale }) {

  const [inputValue, setInputValue] = useState(beam.length);
  const [a, seta] = useState(null);

  return (
    <div className='d-flex justify-content-between'>
      |<span className="text-primary">&#8592;</span>
      <div className="border-primary" style={{ width: "100%", marginTop: "13px", borderTop: "1px dashed" }}></div>
      <div className="input-group input-group-sm mb-3" style={{ minWidth: "180px" }} >
        <input
          type="number"
          inputMode="numeric"
          min={1}
          className="form-control"
          aria-label={`Enter beam length for Beam ${beam.id}`}
          value={inputValue}
          onChange={(e) => {
            e.stopPropagation()
            if ((e.nativeEvent.data === "-" || e.nativeEvent.data === "+")) {
              e.target.value = inputValue
            }
            const newValue = (e.target.value < 0 ? e.target.value * -1 : e.target.value);
            setInputValue(newValue);
            const scale = newValue / actualbeamLength()
            updateScale(beam.id, newValue === "" || isNaN(newValue) ? 1 : scale)
            onChange(beam.id, "scale", newValue === "" || isNaN(newValue) ? 1 : scale);
            onChange(beam.id, "length", newValue === "" || isNaN(newValue) ? 1 : newValue);
          }}
          onBlur={(e) => {
            setInputValue(e.target.value === "" || isNaN(e.target.value) ? 1 : e.target.value);
          }}
        />
        <select style={{ maxWidth: "80px", width: "80px" }} className="form-select form-select-sm" onChange={(e) => onChange(beam.id, "unit", e.target.value)}>
          <option defaultValue="">m</option>
          <option value="cm">cm</option>
          <option value="ft">ft</option>
          <option value="in.">in.</option>
        </select>
      </div>
      <div className="border-primary" style={{ width: "100%", marginTop: "13px", borderTop: "1px dashed" }}></div>
      <span className="text-primary">&#8594;</span>|
      {a}
    </div>
  )
}


function Beam() {
  // const [calcBeamLength, setCalcBeamLength] = useState(beam.length);

  const [beams, setBeams] = useState([
    {
      id: 1,
      length: 400,
      scale: 1,
      unit: "m",
      tools: {
      },
    }
  ]);

  function addBeam() {
    const newBeam = {
      id: beams.length + 1,
      length: 400,
      scale: 1,
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

  function deleteTool(beamID, toolID) {
    console.log(`deleting...., ${toolID} of Beam_${beamID}`)
    setBeams((prevBeams) =>
      produce(prevBeams, (draftBeams) => {
        const toolType = toolID.split("_")[0]
        const beamIndex = draftBeams.findIndex((beam) => beam.id === beamID);
        // console.log(draftBeams)
        if (beamIndex !== -1) {
          const updatedTools = draftBeams[beamIndex].tools[toolType].filter((tool) => tool.id !== toolID);
          const updatedToolswithID = updatedTools.map((tool, index) => ({
            ...tool,
            id: `${toolType}_${beamID}_${index + 1}`,
          }));
          draftBeams[beamIndex].tools[toolType] = updatedToolswithID;
        }
      })
    );
  }

  function changeBeamValue(id, property, newValue) {
    setBeams((prevBeams) =>
      prevBeams.map((beam) =>
        beam.id === id ? { ...beam, [property]: newValue } : beam
      )
    );
  }

  // function updateScale(beamID, newScale) {
  //   setBeams((prevBeams) =>
  //     produce(prevBeams, (draftBeams) => {
  //       const beamIndex = draftBeams.findIndex((beam) => beam.id === beamID);
  //       if (beamIndex !== -1) {
  //         const toolIndex = draftBeams[beamIndex].tools[toolType].findIndex(
  //           (tool) => tool.id === toolID
  //         );
  //         if (toolIndex !== -1) {
  //           draftBeams[beamIndex].tools[toolType][toolIndex][property] = newValue;
  //         }
  //       }
  //     })
  //   );
  // }
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
  const [INdexcale, setINdexcale] = useState(1)
  const [beamscale, setbeamscale] = useState(1)

  const updateScale = (beamID, newScale) => {
    setBeams((prevBeams) => {
      return produce(prevBeams, (draft) => {
        const beamIndex = draft.findIndex((beam) => beam.id === beamID);
        if (beamIndex !== -1) {
          const beam = draft[beamIndex];
          const preScale = beam.scale;
          setbeamscale(newScale)
          console.log("setbeamscale", beamscale)
          Object.values(beam.tools).forEach((toolType) => {
            toolType.forEach((tool) => {
              tool.positionOnBeam = (tool.positionOnBeam * newScale) / preScale;
            });
          });
        }
      });
    });
  }

  const AllDivs = ({ beamID }) => {
    const toolWidth = getToolWidth()
    const beamIndex = beams.findIndex((beam) => beam.id === beamID);
    let beam = beams[beamIndex]
    console.log(beams[beamIndex].scale, "beammIndex].scale")
    console.log(beamscale, "beammscaleDiv")

    // console.log(beams)
    let alldivs = Object.values(beam.tools).map((toolType) =>
      // console.log("newTool", beams[beamIndex])
      toolType.map((tool, index) =>
        <DropableNew deleteTool={deleteTool} changeBeamValue={changeBeamValue} beamLength={beam.length} positionOnBeam={tool.positionOnBeam} beamID={beamID} id={tool.id} key={index} changeToolValue={changeToolValue} style={{ width: toolWidth + "px", left: tool.actualPosition ? tool.actualPosition : 0, display: "flex", flexDirection: "column" }}>
          <div style={{
            scale: "1.8", display: "flex", flexDirection: "row", justifyContent: "center",
            marginTop: tool.isUp ? "-25px" : "0px",
          }}>
            {tool.img}
          </div>
        </DropableNew >
      )
    )
    return alldivs;
  }


  const addTool = (beamID, toolType, actualPosition, positionOnBeam) => {
    const toolWidth = getToolWidth()
    console.log("Adding tool.....", {
      "toolType": toolType,
      "position": actualPosition,
      "ToolWidth": toolWidth,
    })

    const beamIndex = beams.findIndex((beam) => beam.id === beamID);
    console.log(beamscale, "bealeDiv")
    console.log(beams[beamIndex].scale, "beamm].scale")

    setBeams((previousBeams) => {
      return produce(previousBeams, (draftBeams) => {
        if (beamIndex !== -1) {
          const beam = draftBeams[beamIndex]; // Get a reference to the beam
          beam.tools = beam.tools || {};
          beam.tools[toolType] = beam.tools[toolType] || [];

          const newTool = {
            id: `${toolType}_${beamID}_${beam.tools[toolType].length + 1}`,
            actualPosition: actualPosition,
            positionOnBeam: positionOnBeam,
            isUp: toolType === "rollerSupport" || toolType === "hingedSupport" ? false : true,
            img: getImg(toolType),
          };
          beam.tools[toolType].push(newTool); // Update the beam object directly
        }
      });
    });

  };

  const addTools = (beamID, toolType, actualPosition, positionOnBeam) => {
    const toolWidth = getToolWidth()
    console.log("Adding tool.....", {
      "toolType": toolType,
      "position": actualPosition,
      "ToolWidth": toolWidth,
    })
    const beamIndex = beams.findIndex((beam) => beam.id === beamID);
    console.log(beamscale, "bealeDiv")
    console.log(beams[beamIndex].scale, "beamm].scale")
    setBeams(previousBeams => {
      const nextState = produce(previousBeams, (draftBeams) => {
        if (beamIndex !== -1) {
          draftBeams[beamIndex]["tools"] = draftBeams[beamIndex]["tools"] || {};
          draftBeams[beamIndex]["tools"][toolType] = draftBeams[beamIndex]["tools"][toolType] || [];
          console.log(`Received... beamID: ${beamID} and toolType: ${toolType}`)
          const newTool = {
            id: `${toolType}_${beamID}_${draftBeams[beamIndex].tools[toolType].length + 1}`,
            actualPosition: actualPosition,
            positionOnBeam: positionOnBeam,
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
          <ToolBar beamID={beam.id} />
          <BeamBar beamID={beam.id} addTool={addTool} scale={beamscale} >
            <AllDivs beamID={beam.id} />
          </BeamBar>
          <InputBeamLength beam={beam} onChange={changeBeamValue} updateScale={updateScale} />
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
