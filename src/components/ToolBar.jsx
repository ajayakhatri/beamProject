import React, { useState, useRef } from 'react';
import { BiSolidCircle } from 'react-icons/bi';
import { BsFillTriangleFill, BsArrowDown } from 'react-icons/bs';
import { BeamBar, DropablePreset } from './DndStage1';

export function getImg(toolType) {
    const img = {
        "pointLoad": <BsArrowDown />,
        "rollerSupport": <BiSolidCircle />,
        "hingedSupport": <BsFillTriangleFill />
    }
    return img[toolType]
}
export function getToolWidth() {
    return 50;
}
export function beamLength() {
    return 400;
}
export function getDroppables(beamID) {

    return [{
        id: "pointLoad_tool_" + beamID,
        type: "pointLoad",
        isUp: true,
        img: getImg("pointLoad"),
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
                scale: "1.8", display: "flex", flexDirection: "row", justifyContent: "center",
                marginTop: tool.isUp && "-22px"
            }}>
                {tool.img}
            </div>
        </DropablePreset>
    )

    return (
        <div className='d-flex gap-2 justify-content-center'>
            {DroppablesDivs}
        </div>
    );

}
export default ToolBar;


