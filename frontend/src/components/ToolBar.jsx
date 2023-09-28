// Contains toolbox of draggable elements

import React from 'react';
import { DropablePreset } from './DndStage1';
import { ImgDistributedLoad, ImgHingedSupport, ImgPointLoad, ImgRollerSupport } from './Img';
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

function ToolBar({ beam,
    beamID,
    changeOrAddBeamProperty,
    deleteBeamProperty,
    checkedLeft,
    setCheckedLeft,
    checkedRight,
    setCheckedRight,
    addSupportPositions,
    beamLength,
    removeSupportPositions,
    actualBeamLength }) {
    const Droppables = getDroppables(beamID)

    const DroppablesDivs = Droppables.map((tool) =>
    <div key={tool.id} style={{border:"1px solid",width:"65px",height:"65px", borderRadius:"10px",display: "flex", flexDirection: "row", justifyContent: "center",alignItems:"center"}}>
        <DropablePreset id={tool.id} >
            <div style={{
             scale:actualBeamLength<300?"0.8":null,display: "flex", flexDirection: "row", justifyContent: "center", marginTop: tool.isUp ?actualBeamLength<300? "40px":"55px" : "10px",marginLeft:tool.type==="distributedLoad"?actualBeamLength<300?"12px":"17px":null
            }}>
                {tool.img}
            </div>
        </DropablePreset>
            </div>
    )

    return (
        <div className='d-flex align-items-center justify-content-center gap-1' style={{width:actualBeamLength}}>
            <div style={{maxWidth:actualBeamLength<370?"220px":null}}  className='d-flex align-items-center justify-content-center gap-1' id="tour-draggable">
            {DroppablesDivs}
            </div>
            <div  className='d-flex align-items-center justify-content-center gap-1' id="tour-fixedEnds">
                <FixedEnds 
                beam={beam}
                changeOrAddBeamProperty={changeOrAddBeamProperty}
                deleteBeamProperty={deleteBeamProperty}
                checkedLeft={checkedLeft}
                setCheckedLeft={setCheckedLeft}
                checkedRight={checkedRight}
                setCheckedRight={setCheckedRight}
                addSupportPositions={addSupportPositions}
                beamLength={beamLength}
                removeSupportPositions={removeSupportPositions}
                actualBeamLength={actualBeamLength}/>
            </div>
                </div>
       
    );

}
export default ToolBar;


