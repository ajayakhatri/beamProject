import React from 'react';
import { DropablePreset } from './DndStage1';
import { ImgDistributedLoad, ImgHingedSupport, ImgPointLoad, ImgRollerSupport,ImgFixedSupportOnBeam } from './Img';
import FixedEnds from './FixedEnds';

export function getImg(toolType) {
    const img = {
        "pointLoad": <ImgPointLoad />,
        "distributedLoad": <ImgDistributedLoad width={80} spacing={20} />,
        "rollerSupport": <ImgRollerSupport />,
        "hingedSupport": <ImgHingedSupport />,
    }
    return img[toolType]
}
export function getToolWidth() {
    return 50;
}

function getDroppables(beamID) {

    return [
        {
            id: "pointLoad_tool_" + beamID,
            type: "pointLoad",
            isUp: true,
            img: getImg("pointLoad"),
        },
        {
            id: "distributedLoad_tool_" + beamID,
            type: "distributedLoad",
            isUp: true,
            img: getImg("distributedLoad"),
        },
        {
            id: "rollerSupport_tool_" + beamID,
            type: "rollerSupport",
            isUp: false,
            img: getImg("rollerSupport"),
        },
        {
            id: "hingedSupport_tool_" + beamID,
            type: "hingedSupport",
            isUp: false,
            img: getImg("hingedSupport"),
        }
    ]
}

function ToolBar({ beamID,
    changeOrAddBeamProperty,
deleteBeamProperty,
    checkedLeft,
    setCheckedLeft,
    checkedRight,
    setCheckedRight,
    addSupportPositions,
    beamLength,
    removeSupportPositions }) {
    const Droppables = getDroppables(beamID)

    const DroppablesDivs = Droppables.map((tool) =>
    <div key={tool.id} style={{border:"1px solid", width:"70px",height:"70px", borderRadius:"10px",display: "flex", flexDirection: "row", justifyContent: "center",alignItems:"center"}}>
        <DropablePreset id={tool.id} >
            <div style={{
                display: "flex", flexDirection: "row", justifyContent: "center", marginTop: tool.isUp ? "55px" : "10px",marginLeft:tool.type==="distributedLoad"?"17px":null
            }}>
                {tool.img}
            </div>
        </DropablePreset>
            </div>
    )

    return (
        <div className='d-flex gap-4 justify-content-center mb-5 border border-2 border-primary border-top-0'>
            {DroppablesDivs}
                <FixedEnds beamID={beamID} 
                changeOrAddBeamProperty={changeOrAddBeamProperty}
                deleteBeamProperty={deleteBeamProperty}
                checkedLeft={checkedLeft}
                setCheckedLeft={setCheckedLeft}
                checkedRight={checkedRight}
                setCheckedRight={setCheckedRight}
                addSupportPositions={addSupportPositions}
                beamLength={beamLength}
                removeSupportPositions={removeSupportPositions}/>
            </div>
       
    );

}
export default ToolBar;


