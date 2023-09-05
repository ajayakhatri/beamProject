import React,{useState} from 'react'
import ToolBar, { getToolWidth } from './ToolBar'
import { BeamBar } from './DndStage1';
import { DropableNew } from './DndStage2';


function InputBeamLength({ beam, changeBeamValue, beamLength, setBeamLength }) {


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
                    value={beamLength}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setBeamLength(newValue);
                        changeBeamValue(beam.id, "length", newValue === "" ? 1 : newValue);
                    }}
                    onBlur={(e) => {
                        setBeamLength(e.target.value === "" ? 1 : e.target.value);
                    }}
                />
                <select style={{ maxWidth: "80px", width: "80px" }} className="form-select form-select-sm" onChange={(e) => changeBeamValue(beam.id, "unit", e.target.value)}>
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

const AllDivs = ({ beamID, beams, beamLength, setBeamLength,changeToolValue }) => {
    const toolWidth = getToolWidth()
    const beamIndex = beams.findIndex((beam) => beam.id === beamID);
    let beam = beams[beamIndex]
    let alldivs = Object.values(beam.tools).map((toolType) =>
        toolType.map((tool, index) =>
            <DropableNew beamLength={beamLength} setBeamLength={setBeamLength} positionOnBeam={tool.positionOnBeam} beamID={beamID} id={tool.id} key={index} changeToolValue={changeToolValue} style={{ width: toolWidth + "px", left: tool.actualPosition, display: "flex", flexDirection: "column" }}>
                <div style={{
                    scale: "1.8", display: "flex", flexDirection: "row", justifyContent: "center",
                    marginTop: tool.isUp ? "-44px" : "0px",
                }}>
                    {tool.img}
                </div>
            </DropableNew >
        )
    )
    return alldivs;
}


const BeamLen = ({ beam, beams, addTool, changeBeamValue,changeToolValue }) => {
    const [beamLength, setBeamLength] = useState(beam.length);
    // const [positionOnBeam, setpositionOnBeam] = useState(beam.length);
    // const [beamLength, setBeamLength] = useState(beam.length);

    return (
        <>
            <ToolBar beamID={beam.id} />
            <BeamBar beamID={beam.id} addTool={addTool} beamLength={beamLength} setBeamLength={setBeamLength}>
                <AllDivs beamID={beam.id} beams={beams} beamLength={beamLength} setBeamLength={setBeamLength} changeToolValue={changeToolValue} />
            </BeamBar>
            <InputBeamLength beam={beam} changeBeamValue={changeBeamValue} beamLength={beamLength} setBeamLength={setBeamLength} />
        </>
    )
}

export default BeamLen