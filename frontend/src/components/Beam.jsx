// Beam component contains the all beam instances

import React, { useEffect, useRef, useState } from 'react';
import ToolBar, { getImg, getToolWidth } from './ToolBar';
import { produce } from "immer";
import { DropableNew } from './DndStage2';
import { BeamBar } from './DndStage1';
import { ImgDistributedLoad, ImgPointLoad } from './Img';
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
import PDFGenerator from './Print';
import InputBeamLength from './InputBeamLength';
import PositionDimension from './PositionDimension';
import { AboutPage } from './AboutPage';




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
        console.log("(max-width: 800px)",true)
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
      youngModulus: 210000000,
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
            span: 5,
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




  const [showInfoBorder, setShowInfoBorder] = useState(false);

  const AllDivs = ({ beamID, scale}) => {
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
          style={{ width: toolWidth + "px", left: (tool.positionOnBeam/scale)-toolWidth/2 ? (tool.positionOnBeam/scale)-toolWidth/2: 0 }}>
          <div style={{
            marginTop: tool.isUp ? "4px" : "23px",
            display: "flex", flexDirection: "row", justifyContent: tool.id.split("_")[0] === "distributedLoad" ? "start" : "center",
          }}>
            {tool.id.split("_")[0] === "distributedLoad" ?
              <ImgDistributedLoad hasid={true} newSpanValue={tool.span} scale={scale} spacing={20} loadEnd={tool.loadEnd} loadStart={tool.loadStart} color={tool.color} />
              :tool.id.split("_")[0] === "pointLoad" ?<ImgPointLoad load={tool.load}/>:
              getImg(tool.id.split("_")[0])
            }
          </div>
        </DropableNew >
      )
    )
    return alldivs;
  }

  const [modalShow, setModalShow] = useState(localStorage.getItem('modalShow') === 'false' ? false : true);
  const [showAboutPage, setShowAboutPage] = useState(false);
  const [plot, setPlot] = useState({})
  const [isFigAvailable, setIsFigAvailable] = useState({});
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
      <div className='d-flex justify-content-between not-printable' >
        <div className='d-flex gap-2 align-items-center'>
          <h1 id="webtitle"style={{ fontSize: "30px" }}>Beams</h1>
          {beams.length > 0 &&
            <div className={(actualBeamLength < 660 ? 'flex-column mb-2 ' : "") + "d-flex " + "gap-2"}>
              <OnBoarding modalShow={modalShow} setModalShow={setModalShow} setShowAboutPage={setShowAboutPage}/>
              <button className='btn btn-outline-primary not-printable' style={{ fontWeight: "bold", height: "30px", width: "100px", borderRadius: "10px", boxShadow: "#422800 4px 4px 0 0" }} onClick={() => setShowAboutPage(!showAboutPage)}>About</button>
            </div>
          }
        {
             showAboutPage&&
             <AboutPage showAboutPage={showAboutPage} setShowAboutPage={setShowAboutPage} />
           } 
        </div>
        {beams.length > 0 && (
          <div id="tour-toggle" className={actualBeamLength > 660 ? "d-flex gap-2 align-items-center ms-4 not-printable" : 'ms-4 not-printable'} style={{ fontSize: "14px", minWidth: "120px" }}>
            <Switch label={"Loads"} status={loadSet} setstatus={setloadSet} />
            <Switch label={"Length"} status={lengthSet} setstatus={setlengthSet} />
            <Switch label={"Border"} status={showInfoBorder} setstatus={setShowInfoBorder} />
          </div>
        )}
      </div>
      {beams.map((beam,index) => (
        <div key={beam.id} id={"toPrint"+beam.id} 
        className={`beamground dimensionline  border-1 position-relative d-flex flex-column align-items-center`}>
          <div className="not-printable" style={{ color: "white", backgroundColor: "black", position: "absolute", top: 0, left: 0, margin: "5px",padding: "2px 6px", border: "solid 2px white", borderRadius: "6px" }}>Beam {beam.referenceNo ? "Ref no." + beam.referenceNo : ""}</div>
        <div className='not-printable'style={{ marginBottom: "70px"}}>
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
        </div>
         
        <div id={`beamFig-${beam.id}`} style={{ marginTop: "30px"}}>
            <BeamBar beamID={beam.id} addTool={addTool} scale={beam.length / actualBeamLength} actualBeamLength={actualBeamLength}
              checkedLeft={beam.fixedSupportLeft}
              checkedRight={beam.fixedSupportRight}
            >
              <AllDivs beamID={beam.id} scale={beam.length / actualBeamLength}/>
            </BeamBar>
            {lengthSet &&
            <>
              <PositionDimension beam={beam} actualBeamLength={actualBeamLength} scale={beam.length / actualBeamLength} />
          <InputBeamLength beam={beam} onChange={changeOrAddBeamProperty} updateScale={updateScale} actualBeamLength={actualBeamLength} showInfoBorder={showInfoBorder} />
            </>
            }
      
          </div>
          <div className={`align-self-start beaminfo-${beam.id}`}>
            <BeamInfo beam={beam} onChange={changeOrAddBeamProperty} actualBeamLength={actualBeamLength} />
          </div>

          <div className='d-flex gap-2 mt-5 not-printable' id="tour-diagramAndDelete">
            {!isFigAvailable[beam.id] &&
              !(
                beam.tools?.rollerSupport?.length >= 2 ||
                beam.tools?.hingedSupport?.length >= 2 ||
                (beam.tools?.rollerSupport?.length + beam.tools?.hingedSupport?.length >= 2) ||
                beam.fixedSupportLeft ||
                beam.fixedSupportRight
              ) && showAlert[beam.id] &&
              <div  className='alert' style={{ minHeight: "100px", position: "fixed", bottom: "5%",zIndex:4}}>
                <Alert style={{ fontSize: "12px"}} variant="danger" onClose={() => setState(setShowAlert, beam.id, false)} dismissible>
                <Alert.Heading>"Error"</Alert.Heading>
                  Invalid Support Condition!!
                </Alert>
              </div>}
              <SendData setMessage={setMessage} beams={beams} beamID={beam.id} setPlot={setPlot} plot={plot} beamLength={parseFloat(beam.length)}
                show={
                  isFigAvailable[beam.id] && (
                    beam.tools?.rollerSupport?.length >= 2 ||
                    beam.tools?.hingedSupport?.length >= 2 ||
                    (beam.tools?.rollerSupport?.length + beam.tools?.hingedSupport?.length >= 2) ||
                    beam.fixedSupportLeft ||
                    beam.fixedSupportRight
                  )
                }>
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
                ) ? (setState(setIsFigAvailable, beam.id, e.currentTarget.checked)) : (setState(setIsFigAvailable, beam.id, false),
                  (setState(setShowAlert, beam.id, true)))
              }
              }
            >
                {isFigAvailable[beam.id] && (
                  beam.tools?.rollerSupport?.length >= 2 ||
                  beam.tools?.hingedSupport?.length >= 2 ||
                  (beam.tools?.rollerSupport?.length + beam.tools?.hingedSupport?.length >= 2) ||
                  beam.fixedSupportLeft ||
                  beam.fixedSupportRight
                ) ? "Hide Diagrams" : "Show Diagrams"}
            </ToggleButton>
              </SendData>

            {/* For Debugging purpose */}
           {/* <button className='btn btn-outline-primary p-1' onClick={() => printInfo(beam.id)}>Info</button>
            <button className='btn btn-outline-primary p-1' onClick={() => console.clear()}>clear</button>  */}

            <SaveBeam setMessage={setMessage} beam={beam} changeOrAddBeamProperty={changeOrAddBeamProperty} />
            <button className='btn btn-danger p-1' onClick={() => {
              deleteBeam(beam.id)
              setMessage(["info", "Beam is successfully deleted", true])
            }}>🗑️ Delete Beam</button>
          </div>
          {
          plot[beam.id] && isFigAvailable[beam.id] && (
            beam.tools?.rollerSupport?.length >= 2 ||
            beam.tools?.hingedSupport?.length >= 2 ||
            (beam.tools?.rollerSupport?.length + beam.tools?.hingedSupport?.length >= 2) ||
            beam.fixedSupportLeft ||
            beam.fixedSupportRight
          ) &&
          <>
            <MyCharts beamID={beam.id} plot={plot[beam.id]} actualBeamLength={actualBeamLength} unit={beam.unit} loadUnit={beam.loadUnit} />
            <PDFGenerator beamID={beam.id}/>
          </>       
          }

        </div>
      ))}
      <div className='d-flex justify-content-center gap-2 mb-2 not-printable'>
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

