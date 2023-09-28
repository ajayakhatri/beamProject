import React, { useEffect, useRef, useState } from 'react';
import ToolBar, { getImg, getToolWidth } from './ToolBar';
import { produce } from "immer";
import { DropableNew } from './DndStage2';
import { BeamBar } from './DndStage1';
import { ImgDistributedLoad } from './Img';
import Switch from './Switch';
import { getRandomColorHex } from './utility';
import { SendData } from '../dataFlow/sendDataToBackend';
import { MyCharts } from './Chart';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Alert from 'react-bootstrap/Alert';
import { BeamInfo } from './BeamInfo';
import OnBoarding from './OnBoarding';
import { LoadBeam } from './LoadBeam';
import { SaveBeam } from './SaveBeam';
import MessageBox from './Message';


function InputBeamLength({ beam, onChange, updateScale, actualBeamLength, showInfoBorder }) {

  const [inputValue, setInputValue] = useState(beam.length);
  const [section, setSection] = useState("Rectangular");
  const [radiusValue, setRadiusValue] = useState(0.15);
  const [depthValue, setDepthValue] = useState(0.45);
  const [widthValue, setWidthValue] = useState(0.30);
  const [MOI, setMOI] = useState(0.002278);
  const [youngModulus, setYoungModulus] = useState(210);
  const [isinputVisible, setisInputVisible] = useState(false);

  return (<>
    <div className='d-flex' style={{ width: actualBeamLength, height: "20px" }}>
      <div>
        <div className='strikethrough'>|</div>
      </div>

      <div className="border-dark" style={{ width: "100%", marginTop: "11px", borderTop: "1px solid" }}></div>

      {!isinputVisible ? (
        <div onClick={() => setisInputVisible(true)} id="tour-beamLength" className='inputPointer' style={{ fontSize: "15px", border: !showInfoBorder && "none" }}>
          {inputValue + beam.unit}
        </div>
      ) : (
        <div className="input-group input-group-sm" style={{ maxWidth: "180px" }} >
          <input
            type="number"
            autoFocus={true}
            inputMode="numeric"
            min={1}
            className="form-control "
            aria-label={`Enter beam length for Beam ${beam.id}`}
            value={inputValue}
            onChange={(e) => {
              e.stopPropagation()
              if ((e.nativeEvent.data === "-" || e.nativeEvent.data === "+")) {
                e.target.value = inputValue
              }
              setInputValue(e.target.value);
              const newValue = (e.target.value.length === 0 ? 1 : parseFloat(e.target.value));
              const scale = newValue / parseFloat(actualBeamLength)
              console.log("Check on Length Change", {
                "scale": scale,
                "newValue": newValue,
                "check": e.target.value.length === 0 ? 1 : parseFloat(e.target.value),
              })

              const newLength = e.target.value.length === 0 || newValue === 0 ? beam.length : newValue
              const newScale = e.target.value.length === 0 || newValue === 0 ? beam.scale : scale

              updateScale(beam.id, newScale, newLength)
              onChange(beam.id, "scale", newScale);
              onChange(beam.id, "length", newLength);
            }}
            onBlur={(e) => {
              setisInputVisible(false)
              setInputValue(e.target.value.length === 0 || parseFloat(e.target.value) === 0 ? 1 : e.target.value);
            }}
          />
        </div>
      )}

      <div className="border-dark" style={{ width: "100%", marginTop: "11px", borderTop: "1px solid" }}></div>
      <div>
        <div className='strikethrough'>|</div>
      </div>
    </div>

  </>
  )
}


function Beam() {
  const mediaQueryRef = useRef(null);

  function calculateInitialBeamLength() {
    if (window.matchMedia("(max-width: 800px)").matches) {
      return window.innerWidth - 100;
    } else {
      return 800;
    }
  }
  const [actualBeamLength, setactualBeamLength] = useState(calculateInitialBeamLength());


  useEffect(() => {
    mediaQueryRef.current = window.matchMedia("(max-width: 800px)");
    // Function to handle changes in the media query
    const handleMediaQueryChange = (event) => {
      if (event.matches) {
        // Media query matches (screen width is less than 900px)
        setactualBeamLength(window.innerWidth - 100); // Adjust component as needed
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
    setactualBeamLength(x > 950 ? 800 : x - 100);
  }
  useEffect(() => {
    const handleWindowResize = () => {
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
      scale: 10 / actualBeamLength,
      unit: "m",
      loadUnit: "kN",
      moi: 0.002278,
      fixedSupportLeft: true,
      fixedSupportRight: false,
      youngModulus: 210,
      section: "Rectangular",
      radius: 0.15,
      depth: 0.45,
      width: 0.3,
      tools: {
        distributedLoad: [
          {
            id: 'distributedLoad_1_1',
            actualPosition: -25,
            positionOnBeam: 0,
            isUp: true,
            loadEnd: 5,
            loadStart: 5,
            span: 2,
            img: <ImgDistributedLoad hasid={true} newSpanValue={2} scale={10 / actualBeamLength} spacing={20} loadEnd={5} loadStart={5} />
          }
        ]
      },
    }
  ]);

  const addBeam = () => {
    const newBeam = {
      id: beams.length + 1,
      length: 10,
      scale: 10 / actualBeamLength,
      unit: "m",
      loadUnit: "kN",
      moi: 0.002278,
      youngModulus: 210,
      section: "Rectangular",
      radius: 0.15,
      depth: 0.45,
      width: 0.3,
      tools: {
      },
    };
    setBeams([...beams, newBeam]);
  }

  const [supportPositions, setSupportPositions] = useState({})
  function findPositionBySupportID(valueToFind) {
    for (const key in supportPositions) {
      if (supportPositions[key] === valueToFind) {
        return key; // Return the first key that matches the value
      }
    }
    return null; // Return null if the value is not found
  }
  function printInfo(beamID) {
    const beamIndex = beams.findIndex((beam) => beam.id === beamID);
    const beamPointLoad = beams[beamIndex]?.tools?.pointLoad || [];
    const distributedLoad = beams[beamIndex]?.tools?.distributedLoad || [];
    const beamRollerSupport = beams[beamIndex]?.tools?.rollerSupport || [];
    const beamHingedSupport = beams[beamIndex]?.tools?.hingedSupport || [];
    const beamfixedSupportLeft = beams[beamIndex]?.fixedSupportLeft
    const beamfixedSupportRight = beams[beamIndex]?.fixedSupportRight
    console.log(`----Info of beam ${beamID}----`)
    console.log("Beams", beams)
    console.log("Roller Supports", beamRollerSupport.length, beamRollerSupport)
    console.log("Point Loads", beamPointLoad.length, beamPointLoad)
    console.log("Distributed Load", distributedLoad.length, distributedLoad)
    console.log("Hinged Supports", beamHingedSupport.length, beamHingedSupport)
    console.log("Beam Fixed Support Left", beamfixedSupportLeft)
    console.log("Beam Fixed Support Right", beamfixedSupportRight)
    console.log("Support Position", supportPositions)
    console.log("-------------")
  }


  const addSupportPositions = (beamID, position, supportID) => {
    if (supportPositions[position] !== supportID) {
      if (findPositionBySupportID(supportID) !== null) {
        removeSupportPositions(findPositionBySupportID(supportID))
      }
      if (position in supportPositions) {
        if (supportPositions[position] === "fixedSupportLeft" || supportPositions[position] === "fixedSupportRight") {
          deleteTool(beamID, supportID)
        } else {
          deleteTool(beamID, supportPositions[position])
        }
      }
      removeSupportPositions(position)
      setSupportPositions(prevState => ({
        ...prevState,
        [position]: supportID
      }));
    };
  }

  const removeSupportPositions = (position) => {
    setSupportPositions(prevState => {
      const newState = { ...prevState };
      delete newState[position];
      return newState;
    });
  };


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



  function changeOrAddBeamProperty(id, property, newValue) {
    console.log(`changing....,${property} of Beam ${id} to ${newValue}`)
    setBeams((prevBeams) =>
      prevBeams.map((beam) =>
        beam.id === id ? { ...beam, [property]: newValue } : beam
      )
    );
  }
  function deleteBeamProperty(id, propertyToDelete) {
    setBeams((prevBeams) =>
      prevBeams.map((beam) => {
        if (beam.id === id) {
          const updatedBeam = { ...beam };
          delete updatedBeam[propertyToDelete];
          return updatedBeam;
        } else {
          return beam;
        }
      })
    );
  }

  const changeToolValue = (beamID, toolID, property, newValue) => {
    console.log(`changing....,${property} of ${toolID} of Beam_${beamID} to ${newValue}`)
    if (property === "positionOnBeam") {
      if (toolID.split("_")[0] === "hingedSupport" || toolID.split("_")[0] === "rollerSupport") {
        addSupportPositions(beamID, newValue, toolID)
      }
    }
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
            draftBeams[beamIndex].tools[toolType][toolIndex][property] = newValue;
          }
        }
      })
    );
  }

  const updateScale = (beamID, newScale, newLength) => {
    setBeams((prevBeams) => {
      return produce(prevBeams, (draft) => {
        const beamIndex = draft.findIndex((beam) => beam.id === beamID);
        if (beamIndex !== -1) {
          const beam = draft[beamIndex];
          const preScale = beam.scale;
          // setbeamscale(newScale)
          Object.values(beam.tools).forEach((toolType) => {
            toolType.forEach((tool) => {
              console.log("tool.positionOnBeam = (tool.positionOnBeam * newScale) / preScale", tool.positionOnBeam, "=", newScale, "/", preScale, "=", (tool.positionOnBeam * newScale) / preScale)
              tool.positionOnBeam = (tool.positionOnBeam * newScale) / preScale;
              if (tool.id.split("_")[0] === "distributedLoad") {
                console.log("(tool.span + tool.positionOnBeam) > beam.length", tool.span, "+", tool.positionOnBeam, ">", newLength)
                if ((tool.span + tool.positionOnBeam) > newLength) {
                  console.log("tool.span = newLength - tool.positionOnBeam", tool.span, "=", newLength, "-", tool.positionOnBeam)
                  tool.span = (newLength - tool.positionOnBeam) < 0 ? tool.span : newLength - tool.positionOnBeam
                }
              }
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
          }
          newTool["id"] = `${toolType}_${beamID}_${beam.tools[toolType].length + 1}`
          newTool["actualPosition"] = actualPosition
          newTool["positionOnBeam"] = positionOnBeam
          newTool["isUp"] = toolType === "rollerSupport" || toolType === "hingedSupport" ? false : true
          newTool["img"] = getImg(toolType)
          newTool["value"] = 0

          if (toolType === "distributedLoad") {
            const color = getRandomColorHex()
            newTool["color"] = color
            const newSpan = 0.2 * beam.length
            console.log("On Adding Tool",
              {
                "scale": scale,
                "beam.length": beam.length,
                "newSpan": newSpan
              })
            // const newSpan = ((0.4 * beam.length) + positionOnBeam) > beam.length ? (beam.length - positionOnBeam) : (0.4 * beam.length)
            if ((newSpan + parseFloat(positionOnBeam)) > beam.length) {
              newTool["actualPosition"] = -25 + (beam.length - newSpan) / scale
              newTool["positionOnBeam"] = beam.length - newSpan
            }
            newTool["span"] = newSpan
            newTool["img"] = <ImgDistributedLoad newSpanValue={newSpan} scale={scale} spacing={20} loadEnd={5} loadStart={5} color={color} />
            newTool["loadStart"] = 5
            newTool["loadEnd"] = 5
          }
          else if (toolType === "pointLoad") {
            newTool["load"] = 5
          } else {
            addSupportPositions(beamID, positionOnBeam, newTool["id"])
          }
          beam.tools[toolType].push(newTool); // Update the beam object directly
        }
      });
    });

  };

  const changeDLSpan = (beamID, toolID, property, newSpanValue, scale, loadStart, loadEnd) => {
    if (property === "span") {
      changeToolValue(beamID, toolID, property, parseFloat(newSpanValue.toFixed(3)))
    } else if (property === "loadStart") {
      changeToolValue(beamID, toolID, property, parseFloat(loadStart.toFixed(3)))
    } else {
      changeToolValue(beamID, toolID, property, parseFloat(loadEnd.toFixed(3)))
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

    const color = property === "loadStart" ? null : toollist[toolIndex]["color"]
    console.log({ 'loadEnd': loadEnd, 'loadStart': loadStart })
    console.log(toollist[toolIndex]["loadStart"], "loadStart")
    const newImg = <ImgDistributedLoad newSpanValue={newSpanValue} scale={scale} spacing={20} loadEnd={loadEnd} loadStart={loadStart} color={color} />
    changeToolValue(beamID, toolID, "img", newImg)
  }

  const [loadSet, setloadSet] = useState(true)
  const [lengthSet, setlengthSet] = useState(true)


  const PositionDimension = ({ beam, actualBeamLength }) => {
    const toolWidth = getToolWidth()
    let positionA = 0
    let positionB = 0
    let leftA = 0
    let leftB = 0
    let i = 0
    const tools = beam.tools
    const positions = [];
    const positionsBeam = [];
    const toolTypes = Object.values(beam.tools);
    for (let toolType of toolTypes) {

      toolType.forEach(tool => {
        positions.push(parseFloat(tool.actualPosition));
        positionsBeam.push(parseFloat(tool.positionOnBeam));
      });
    }

    positions.sort((a, b) => a - b);
    positionsBeam.sort((a, b) => a - b);

    let alldivs = Object.values(beam.tools).map((toolType) =>

      toolType.slice().sort((a, b) => parseFloat(a.positionOnBeam) - parseFloat(b.positionOnBeam))
        .map((tool) => {
          const isLastTool = i === positions.length - 1;
          leftA = leftB
          leftB = positions[i] + toolWidth / 2
          positionA = positionB
          positionB = positionsBeam[i]
          i += 1
          return (
            <div key={tool.id}>
              {(positionB - positionA) !== 0 && (
                <div
                  className='d-flex justify-content-between mt-1'
                  style={{
                    width: leftB - leftA,
                    left: leftA,
                    position: "absolute",
                  }}>
                  <div className='strikethrough'>|</div>

                  <div style={{ width: "100%", marginTop: "9.5px", borderTop: "1px solid" }}></div>
                  {(positionB - positionA).toFixed(3) + beam.unit}
                  <div style={{ width: "100%", marginTop: "9.5px", borderTop: "1px solid" }}></div>
                  {(isLastTool && beam.length - positionB === 0) && (

                    <div className='strikethrough'>|</div>

                  )}
                </div>
              )}
              {isLastTool && beam.length - positionB !== 0 && (
                <div
                  className='d-flex justify-content-between mt-1'
                  style={{
                    width: (actualBeamLength - positions[i - 1] - toolWidth / 2).toFixed(3) + "px",
                    left: leftB,
                    position: "absolute",
                  }}>
                  <div className='strikethrough'>|</div>

                  <div style={{ width: "100%", marginTop: "9.5px", borderTop: "1px solid" }}></div>
                  {(beam.length - positionB).toFixed(3) + beam.unit}
                  <div style={{ width: "100%", marginTop: "9.5px", borderTop: "1px solid" }}></div>
                  <div className='strikethrough'>|</div>

                </div>
              )}
            </div>
          )
        }))
    return (<div className='d-flex justify-content-center flex-row position-relative' style={{ color: "DimGray", fontSize: "12px", marginBottom: 50 + "px" }}>
      {alldivs}
    </div>)
  }

  const [showInfoBorder, setShowInfoBorder] = useState(false);

  const AllDivs = ({ beamID, scale }) => {
    const toolWidth = getToolWidth()
    const beamIndex = beams.findIndex((beam) => beam.id === beamID);
    let beam = beams[beamIndex]


    let alldivs = Object.values(beam.tools).map((toolType) =>
      toolType !== "fixedSupportLeft" && toolType !== "fixedSupportRight" &&
      toolType.map((tool) =>
        <DropableNew
          key={tool.id}
          unit={beam.unit}
          loadUnit={beam.loadUnit}
          status={{ "loadSet": loadSet, "lengthSet": lengthSet }}
          id={tool.id}
          toolType={tool.id.split("_")[0]}
          actualBeamLength={actualBeamLength}
          beamID={beamID}
          load={tool.isUp ? tool.id.split("_")[0] === "distributedLoad" ? { "loadStart": tool.loadStart, "loadEnd": tool.loadEnd } : tool.load : 1}
          changefunctions={[changeDLSpan, deleteTool, changeOrAddBeamProperty, changeToolValue]}
          showInfoBorder={showInfoBorder}
          setshowInfoBorder={setShowInfoBorder}
          //Length
          dlspan={tool.id.split("_")[0] === "distributedLoad" ? parseFloat(tool.span) : 1}
          beamLength={beam.length}
          positionOnBeam={tool.positionOnBeam}
          //style
          color={tool.id.split("_")[0] === "distributedLoad" ? tool.color : null}
          style={{ width: toolWidth + "px", left: tool.actualPosition ? tool.actualPosition : 0 }}>
          <div style={{
            marginTop: tool.isUp ? "4px" : "23px",
            display: "flex", flexDirection: "row", justifyContent: tool.id.split("_")[0] === "distributedLoad" ? "start" : "center",
          }}>
            {tool.id.split("_")[0] === "distributedLoad" ?
              <ImgDistributedLoad hasid={true} newSpanValue={tool.span} scale={scale} spacing={20} loadEnd={tool.loadEnd} loadStart={tool.loadStart} color={tool.color} />
              :
              getImg(tool.id.split("_")[0])
            }
          </div>
        </DropableNew >
      )
    )
    return alldivs;
  }

  const [modalShow, setModalShow] = useState(localStorage.getItem('modalShow') === 'false' ? false : true);

  const [plot, setPlot] = useState({})

  const [isFigAvailable, setIsFigAvailable] = useState({});
  const [showFigNotAvailable, setShowFigNotAvailable] = useState({});
  const [showFig, setShowFig] = useState({});
  const [showAlert, setShowAlert] = useState({});
  const [message, setMessage] = useState(["warning", "message", false]);

  const setState = (state, id, value) => {
    state((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };
  return (
    <div>
      <MessageBox message={message} setMessage={setMessage} />
      <div className='d-flex justify-content-between' >
        <div className='d-flex gap-2 align-items-center'>
          <h1 style={{ fontSize: "30px" }}>Beams</h1>
          {beams.length > 0 &&
            <div className={(actualBeamLength < 660 ? 'flex-column mb-2 ' : "") + "d-flex " + "gap-2"}>
              <OnBoarding modalShow={modalShow} setModalShow={setModalShow} />
              <button className='btn btn-outline-primary' style={{ fontWeight: "bold", height: "30px", width: "100px", borderRadius: "10px", boxShadow: "#422800 4px 4px 0 0" }} onClick={() => setModalShow(true)}>About</button>
            </div>
          }
        </div>
        {beams.length > 0 && (
          <div id="tour-toggle" className={actualBeamLength > 660 ? "d-flex gap-2 align-items-center ms-4" : 'ms-4'} style={{ fontSize: "14px", minWidth: "120px" }}>
            <Switch label={"Loads"} status={loadSet} setstatus={setloadSet} />
            <Switch label={"Length"} status={lengthSet} setstatus={setlengthSet} />
            <Switch label={"Border"} status={showInfoBorder} setstatus={setShowInfoBorder} />
          </div>
        )}
      </div>
      {beams.map((beam) => (
        <div key={beam.id} className='border-1 border-black border py-5 mb-4 position-relative d-flex flex-column align-items-center' style={{ borderRadius: "8px", padding: "0px 20px", boxShadow: "#422800 4px 4px 0 0" }}>
          <div style={{ color: "white", backgroundColor: "black", position: "absolute", top: 0, left: 0, margin: "5px", padding: "2px 6px", border: "solid 2px white", borderRadius: "6px" }}>Beam {beam.referenceNo ? "Ref no." + beam.referenceNo : ""}</div>

          <ToolBar
            beam={beam}
            beamID={beam.id}
            changeOrAddBeamProperty={changeOrAddBeamProperty}
            deleteBeamProperty={deleteBeamProperty}
            addSupportPositions={addSupportPositions}
            removeSupportPositions={removeSupportPositions}
            beamLength={beam.length}
            actualBeamLength={actualBeamLength}
          />

          <div style={{ marginTop: "110px", display: "flex", flexDirection: "column", justifyContent: "center", }}>
            <BeamBar beamID={beam.id} addTool={addTool} scale={beam.length / actualBeamLength} actualBeamLength={actualBeamLength}
              checkedLeft={beam.fixedSupportLeft}
              checkedRight={beam.fixedSupportRight}
            >
              <AllDivs beamID={beam.id} scale={beam.length / actualBeamLength} />
            </BeamBar>
            {lengthSet &&
              <PositionDimension beam={beam} actualBeamLength={actualBeamLength} />
            }
          </div>
          <InputBeamLength beam={beam} onChange={changeOrAddBeamProperty} updateScale={updateScale} actualBeamLength={actualBeamLength} showInfoBorder={showInfoBorder} />
          <div className='align-self-start'>
            <BeamInfo beam={beam} onChange={changeOrAddBeamProperty} actualBeamLength={actualBeamLength} />
          </div>

          <div className='d-flex gap-2 mt-5 position-relative' id="tour-diagramAndDelete">
            {showFigNotAvailable[beam.id] &&
              !(
                beam.tools?.rollerSupport?.length >= 2 ||
                beam.tools?.hingedSupport?.length >= 2 ||
                (beam.tools?.rollerSupport?.length + beam.tools?.hingedSupport?.length >= 2) ||
                beam.fixedSupportLeft ||
                beam.fixedSupportRight
              ) && showAlert[beam.id] &&
              <div style={{ maxHeight: "10px", position: "absolute", top: "-50px" }}>
                <Alert style={{ fontSize: "12px" }} variant="danger" onClose={() => setState(setShowAlert, beam.id, false)} dismissible>
                  Invalid Support Condition!!
                </Alert>
              </div>}
            <ToggleButton
              id={`toggle-check-${beam.id}`}
              type="checkbox"
              variant="outline-primary"
              checked={isFigAvailable[beam.id] && (
                beam.tools?.rollerSupport?.length >= 2 ||
                beam.tools?.hingedSupport?.length >= 2 ||
                (beam.tools?.rollerSupport?.length + beam.tools?.hingedSupport?.length >= 2) ||
                beam.fixedSupportLeft ||
                beam.fixedSupportRight
              )}
              value="1"
              onChange={(e) => {
                (
                  beam.tools?.rollerSupport?.length >= 2 ||
                  beam.tools?.hingedSupport?.length >= 2 ||
                  (beam.tools?.rollerSupport?.length + beam.tools?.hingedSupport?.length >= 2) ||
                  beam.fixedSupportLeft ||
                  beam.fixedSupportRight
                ) ? (setState(setIsFigAvailable, beam.id, e.currentTarget.checked), setState(setShowFigNotAvailable, beam.id, false), setState(setShowFig, beam.id, true)) : (setState(setIsFigAvailable, beam.id, false),
                  (setState(setShowFigNotAvailable, beam.id, true), setState(setShowAlert, beam.id, true)))
              }
              }
            >
              <SendData beams={beams} beamID={beam.id} setPlot={setPlot} plot={plot} beamLength={parseFloat(beam.length)}
                show={
                  isFigAvailable[beam.id] && (
                    beam.tools?.rollerSupport?.length >= 2 ||
                    beam.tools?.hingedSupport?.length >= 2 ||
                    (beam.tools?.rollerSupport?.length + beam.tools?.hingedSupport?.length >= 2) ||
                    beam.fixedSupportLeft ||
                    beam.fixedSupportRight
                  )
                }>
                {isFigAvailable[beam.id] && (
                  beam.tools?.rollerSupport?.length >= 2 ||
                  beam.tools?.hingedSupport?.length >= 2 ||
                  (beam.tools?.rollerSupport?.length + beam.tools?.hingedSupport?.length >= 2) ||
                  beam.fixedSupportLeft ||
                  beam.fixedSupportRight
                ) ? "Hide Diagrams" : "Show Diagrams"}
              </SendData>
            </ToggleButton>

            {/* For Debugging purpose */}
            {/* <button className='btn btn-outline-primary p-1' onClick={() => printInfo(beam.id)}>Info</button>
            <button className='btn btn-outline-primary p-1' onClick={() => console.clear()}>clear</button> */}

            <SaveBeam setMessage={setMessage} beam={beam} changeOrAddBeamProperty={changeOrAddBeamProperty} />
            <button className='btn btn-danger p-1' onClick={() => {
              deleteBeam(beam.id)
              setMessage(["info", "Beam is successfully deleted", true])
            }}>🗑️ Delete Beam</button>
          </div>
          {

            plot[beam.id] && isFigAvailable[beam.id] && showFig[beam.id] &&
            <MyCharts plot={plot[beam.id]} actualBeamLength={actualBeamLength} unit={beam.unit} loadUnit={beam.loadUnit} />
          }

        </div>
      ))}
      <div className='d-flex justify-content-center gap-4 mb-2'>
        <button className="btn btn-primary" style={{ minWidth: "120px" }} onClick={() => {
          addBeam()
          setMessage(["primary", "New Beam is added", true])

        }

        }>Add New Beam</button>
        <LoadBeam setBeams={setBeams} beams={beams} setMessage={setMessage} />
      </div>

    </div>

  )

}

export default Beam;

