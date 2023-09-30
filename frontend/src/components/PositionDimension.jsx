import React from 'react'
import { getToolWidth } from './ToolBar'

const PositionDimension = ({ beam, actualBeamLength,scale }) => {

    const toolWidth = getToolWidth()
    let positionA = 0
    let positionB = 0
    let leftA = 0
    let leftB = 0
    let i = 0
    const positions = [];
    const positionsBeam = [];
    const toolTypes = Object.values(beam.tools);
    for (let toolType of toolTypes) {

      toolType.forEach(tool => {
        positions.push(parseFloat(tool.positionOnBeam/scale));
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
          leftB = positions[i]
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
                    width: (actualBeamLength - positions[i - 1]).toFixed(3) + "px",
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

export default PositionDimension