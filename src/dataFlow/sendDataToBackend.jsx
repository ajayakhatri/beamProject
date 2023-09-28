import axios from "./axios.jsx";
import  { useState, useEffect, useRef } from "react";


export const SendData = ({ show,beams, beamID, setPlot, beamLength,plot,children}) => {

    const [localBeams, setlocalBeams] = useState(beams)
    const beamsRef = useRef(localBeams);

    useEffect(() => {
        if (beams !== beamsRef.current) {
            console.log("<_______________>")
            console.log(beams)
            show&&sendDataToBackend()
            setlocalBeams(beams)
            // Update the ref with the new value of beams
            beamsRef.current = localBeams;
        }
    }, [beams]);
    
    const sendDataToBackend = async () => {
        const beamlist = beams
        let point_load_input = []
        let distributed_load_input = []
        let support_input = {}
        const beamIndex = beamlist.findIndex((beam) => beam.id === beamID);
        let moi=0
        let youngModulus=0
        // eg: pointLoad_input = {5: -1e3, 15: -1e3}
        if (beamIndex !== -1) {
            const beam = beamlist[beamIndex]
            moi=beam.moi
            youngModulus=beam.youngModulus
            
            Object.values(beam.tools).forEach((toolType) => {
                toolType.forEach(tool => {
                    if (tool.id.split("_")[0] === "pointLoad") {
                        point_load_input.push([tool.positionOnBeam, tool.load])
                    }
                    if (tool.id.split("_")[0] === "distributedLoad") {
                        distributed_load_input.push(["d", tool.positionOnBeam, [tool.span, tool.loadStart, tool.loadEnd]])
                    }
                    if (tool.id.split("_")[0] === "hingedSupport") {
                        support_input[tool.positionOnBeam] = 1
                    }
                    if (tool.id.split("_")[0] === "rollerSupport") {
                        support_input[tool.positionOnBeam] = 1
                    }
                });
            });
            if (beam.fixedSupportLeft===true) {
                support_input[0] = 0
            }
            if (beam.fixedSupportRight===true) {
                support_input[beam.length] = 0
            }
        }

        const beamLengthToSend = beamLength
        console.log(" sending data to backend:", {
            "beam":beams,
            "point_load_input": point_load_input,
            "distributed_load_input": distributed_load_input,
            "support_input": support_input,
            "beam_length": beamLengthToSend,
            "moi": moi,
            "young_modulus": youngModulus,
        })
        try {
            const response = await axios({
                method: 'post',
                url: 'plot/',
                data: {
                    "point_load_input": point_load_input,
                    "distributed_load_input": distributed_load_input,
                    "support_input": support_input,
                    "beam_length": beamLengthToSend,
                    "moi": moi,
                    "young_modulus": youngModulus,
                }
            });

            if (response.data.ERROR === "Beam is empty") {
                console.log("Response from Backend:", response.data.ERROR);

                setPlot({ ...plot, [beamID]: null });
            } else {
                setPlot({ ...plot, [beamID]: response.data });
            }
        } catch (error) {
            console.log("Error: ", error.message);
        }
    };

    return(
        <span onClick={()=>sendDataToBackend()}>{children}</span>
    )

};

