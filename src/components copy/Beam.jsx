import React, { useEffect, useRef, useState } from 'react';
import ToolBar, { getImg, getToolWidth } from './ToolBar';
import { produce } from "immer";
import { DropableNew } from './DndStage2';
import { BeamBar } from './DndStage1';
import { ImgDistributedLoad } from './Img';
import Switch from './Switch';
import { getRandomColorHex } from './utility';

function InputBeamLength({ beam, onChange, updateScale, actualBeamLength }) {

  const [inputValue, setInputValue] = useState(beam.length);

  return (
    <div className='d-flex justify-content-between' style={{ width: actualBeamLength }}>
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
            const scale = newValue / actualBeamLength
            updateScale(beam.id, newValue === "" || isNaN(newValue) ? 1 : scale)
            onChange(beam.id, "scale", newValue === "" || isNaN(newValue) ? 1 : scale);
            onChange(beam.id, "length", newValue === "" || isNaN(newValue) ? 1 : newValue);
            // changeDLSpan(beam.id, id, "span", ((dlSpanValue > beamLength) ? beamLength : dlSpanValue), beamLength / actualBeamLength, loadStartRef.current, loadEndRef.current)
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
    </div>
  )
}


function Beam() {
  const mediaQueryRef = useRef(null);
  const [actualBeamLength, setactualBeamLength] = useState(10);


  useEffect(() => {
    mediaQueryRef.current = window.matchMedia("(max-width: 800px)");
    console.log(mediaQueryRef.current)
    // Function to handle changes in the media query
    const handleMediaQueryChange = (event) => {
      if (event.matches) {
        console.log(window.innerWidth)
        // Media query matches (screen width is less than 900px)
        setactualBeamLength(window.innerWidth - 60); // Adjust component as needed
      } else {
        setactualBeamLength(800); // Adjust component as needed
        // Media query does not match (screen width is 900px or greater)
      }
    };

    // Initial check of the media query
    handleMediaQueryChange(mediaQueryRef.current);

    // Add event listener for media query changes
    mediaQueryRef.current.addListener(handleMediaQueryChange);

    // Cleanup by removing the event listener when the component unmounts
    return () => {
      mediaQueryRef.current.removeListener(handleMediaQueryChange);
    };
  }, []);


  function checkBeamLength(x) {
    setactualBeamLength(x > 800 ? 800 : x - 60);
  }
  useEffect(() => {
    const handleWindowResize = () => {
      console.log(window.innerWidth);
      checkBeamLength(window.innerWidth)
    };

    window.addEventListener('resize', handleWindowResize);
    window.addEventListener('load', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
      window.removeEventListener('load', handleWindowResize);
    };
  });


  const [beams, setBeams] = useState([
    {
      id: 1,
      length: 10,
      scale: 1,
      unit: "m",
      tools: {
      },
    }
  ]);

  function addBeam() {
    const newBeam = {
      id: beams.length + 1,
      length: 10,
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
    const distributedLoad = beams[beamIndex]?.tools?.distributedLoad || [];
    const beamHingedSupport = beams[beamIndex]?.tools?.hingedSupport || [];
    console.log(`----Info of beam ${beamID}----`)
    console.log("Roller Supports", beamRollerSupport.length, beamRollerSupport)
    console.log("Point Loads", beamPointLoad.length, beamPointLoad)
    console.log("Distributed Load", distributedLoad.length, distributedLoad)
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
  // const [beamscale, setbeamscale] = useState(10/actualBeamLength)

  const updateScale = (beamID, newScale) => {
    setBeams((prevBeams) => {
      return produce(prevBeams, (draft) => {
        const beamIndex = draft.findIndex((beam) => beam.id === beamID);
        if (beamIndex !== -1) {
          const beam = draft[beamIndex];
          const preScale = beam.scale;
          // setbeamscale(newScale)
          // console.log("setbeamscale", beamscale)
          Object.values(beam.tools).forEach((toolType) => {
            toolType.forEach((tool) => {
              tool.positionOnBeam = (tool.positionOnBeam * newScale) / preScale;
              console.log("sdfdf", beams)
              // if (tool.id.split("_")[0] === "distributedLoad"){
              //   tool.span=
              // }
            });
          });
        }
      });
    });
  }


  const addTool = (beamID, toolType, actualPosition, positionOnBeam, scale) => {
    const toolWidth = getToolWidth()
    console.log("Adding tool.....", {
      "toolType": toolType,
      "position": actualPosition,
      "ToolWidth": toolWidth,
      "scale": scale,
    })

    const beamIndex = beams.findIndex((beam) => beam.id === beamID);

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
            value: 0,
          };
          if (toolType === "distributedLoad") {
            newTool["span"] = 0.4 * beam.length
            const color = getRandomColorHex()
            newTool["color"] = color
            console.log("scale", scale)
            console.log("beam.length", beam.length)
            newTool["img"] = <ImgDistributedLoad newSpanValue={(0.4 * beam.length)} scale={scale} spacing={20} loadEnd={5} loadStart={5} color={color} />
            newTool["loadStart"] = 5
            newTool["loadEnd"] = 5
          }
          else if (toolType !== "rollerSupport" || toolType !== "hingedSupport") {
            newTool["load"] = 5
          }
          beam.tools[toolType].push(newTool); // Update the beam object directly
        }
      });
    });

  };


  // changeDLSpan(beamID, id, "span", newSpan)
  const changeDLSpan = (beamID, toolID, property, newSpanValue, scale, loadStart, loadEnd) => {
    if (property === "span") {
      changeToolValue(beamID, toolID, property, parseFloat(newSpanValue))
    } else if (property === "loadStart") {
      changeToolValue(beamID, toolID, property, parseFloat(loadStart))
    } else {
      changeToolValue(beamID, toolID, property, parseFloat(loadEnd))
    }
    console.log({
      "beamID": beamID,
      "toolID": toolID,
      "property": property,
      "newValue": newSpanValue,
      "scale": scale,
    })
    const beamIndex = beams.findIndex((beam) => beam.id === beamID);
    const toollist = beams[beamIndex].tools[toolID.split("_")[0]]
    const toolIndex = toollist.findIndex((tool) => tool.id === toolID);

    const color = property === "loadStart" ? newLoad : toollist[toolIndex]["color"]
    console.log({ 'loadEnd': loadEnd, 'loadStart': loadStart })
    console.log(toollist[toolIndex]["loadStart"], "loadStart")
    const newImg = <ImgDistributedLoad newSpanValue={newSpanValue} scale={scale} spacing={20} loadEnd={loadEnd} loadStart={loadStart} color={color} />
    changeToolValue(beamID, toolID, "img", newImg)
  }

  const [loadSet, setloadSet] = useState(true)
  const [lengthSet, setlengthSet] = useState(true)
  const [dlSpanSet, setdlSpanSet] = useState(true)

  const AllDivs = ({ beamID, scale }) => {
    const toolWidth = getToolWidth()
    const beamIndex = beams.findIndex((beam) => beam.id === beamID);
    let beam = beams[beamIndex]
    console.log(scale, "beammIndex].scale")
    // console.log(beamscale, "beammscaleDiv")

    let alldivs = Object.values(beam.tools).map((toolType) =>
      toolType.map((tool, index) =>
        <DropableNew
          status={{ "loadSet": loadSet, "lengthSet": lengthSet, "dlSpanSet": dlSpanSet }}
          // setstatus={[setloadSet, setlengthSet, setdlSpanSet]}
          id={tool.id} key={index}
          toolType={tool.id.split("_")[0]}
          actualBeamLength={actualBeamLength}
          beamID={beamID}
          load={tool.isUp ? tool.id.split("_")[0] === "distributedLoad" ? { "loadStart": tool.loadStart, "loadEnd": tool.loadEnd } : tool.load : 1}
          changefunctions={[changeDLSpan, deleteTool, changeBeamValue, changeToolValue]}
          //Length
          dlspan={tool.id.split("_")[0] === "distributedLoad" ? parseFloat(tool.span) : 1}
          beamLength={beam.length}
          positionOnBeam={tool.positionOnBeam}
          //style
          color={tool.id.split("_")[0] === "distributedLoad" ? tool.color : null}
          style={{ width: toolWidth + "px", left: tool.actualPosition ? tool.actualPosition : 0 }}>
          <div style={{
            display: "flex", flexDirection: "row", justifyContent: tool.id.split("_")[0] === "distributedLoad" ? "start" : "center",
          }}>

            {tool.id.split("_")[0] === "distributedLoad" ?
              <ImgDistributedLoad newSpanValue={tool.span} scale={scale} spacing={20} loadEnd={tool.loadEnd} loadStart={tool.loadStart} color={tool.color} />
              : tool.img}
          </div>
        </DropableNew >
      )
    )
    return alldivs;
  }




  return (
    <div>
      <div>actualBeamLength: {actualBeamLength}</div>
      <div className='d-flex justify-content-between' >
        <h2 className='fs-1'>Beams</h2>
        {beams.length > 0 && (
          <div style={{ fontSize: "16px", minWidth: "140px" }}>
            <Switch label={"Loads"} status={loadSet} setstatus={setloadSet} />
            <Switch label={"Length"} status={lengthSet} setstatus={setlengthSet} />
            <Switch label={"DLSpan"} status={dlSpanSet} setstatus={setdlSpanSet} />
          </div>
        )}
      </div>
      {beams.map((beam) => (
        <div key={beam.id} className='border-1 border-black border py-5 px-3 mb-4 position-relative' style={{ borderRadius: "8px" }}>
          <div style={{ color: "white", backgroundColor: "black", position: "absolute", top: 0, left: 0, margin: "5px", padding: "2px 6px", border: "solid 2px white", borderRadius: "6px" }}>Beam {beam.id}</div>
          <div className='mt-4'>
            <ToolBar beamID={beam.id} />
          </div>
          <div style={{ marginTop: "100px", display: "flex", justifyContent: "center" }}>
            <BeamBar beamID={beam.id} addTool={addTool} scale={beam.length / actualBeamLength} actualBeamLength={actualBeamLength} >
              <AllDivs beamID={beam.id} scale={beam.length / actualBeamLength} />
            </BeamBar>
          </div>
          <InputBeamLength beam={beam} onChange={changeBeamValue} updateScale={updateScale} actualBeamLength={actualBeamLength} />
          <div className='d-flex justify-content-end gap-2 mt-3'>
            <button className='btn btn-outline-primary p-1' onClick={() => deleteBeam(beam.id)}>Delete</button>
            <button className='btn btn-outline-primary p-1' onClick={() => printInfo(beam.id)}>Info</button>
            <button className='btn btn-outline-primary p-1' onClick={() => console.clear()}>clear</button>
          </div>
          {/* {beam.length}
          {beam.unit}
          {beam.scale} */}
        </div>
      ))}
      <button onClick={addBeam}>Add Beam</button>

    </div>
  )

}

export default Beam;

