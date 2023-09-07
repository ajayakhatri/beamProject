import React, { useState, useRef } from 'react';
import { BiSolidCircle } from 'react-icons/bi';
import { BsFillTriangleFill, BsArrowDown } from 'react-icons/bs';
import { BeamBar, DropablePreset } from './DndStage1';
import { ImgDistributedLoad, ImgHingedSupport, ImgPointLoad, ImgRollerSupport } from './Img';

export function getImg(toolType) {
    const img = {
        // "pointLoad": <BsArrowDown />,
        "pointLoad": <ImgPointLoad />,
        "distributedLoad": <ImgDistributedLoad width={80} spacing={20} />,
        "rollerSupport": <ImgRollerSupport />,
        "hingedSupport": <ImgHingedSupport />
    }
    return img[toolType]
}
export function getToolWidth() {
    return 50;
}
export function actualbeamLength() {
    return 400;
}
export function getDroppables(beamID) {

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

function ToolBar({ beamID }) {
    const Droppables = getDroppables(beamID)

    const DroppablesDivs = Droppables.map((tool) =>
        <DropablePreset id={tool.id} key={tool.id}>
            <div style={{
                display: "flex", flexDirection: "row", justifyContent: "center",
            }}>
                {tool.img}
            </div>
        </DropablePreset>
    )

    return (
        <div className='d-flex gap-2 justify-content-center mb-5'>
            {DroppablesDivs}
        </div>
    );

}
export default ToolBar;


