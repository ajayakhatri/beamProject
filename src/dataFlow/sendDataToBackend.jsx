import axios from "./axios.jsx";
import React, { useState, useEffect, useRef } from "react";


export const SendData = ({ beams, beamID, setPlot, beamLength }) => {
    const [localBeams, setlocalBeams] = useState(beams)
    const beamsRef = useRef(localBeams);

    // Call the arrangeData function before sending the data to the backend
    useEffect(() => {
        if (beams !== beamsRef.current) {
            console.log("<_______________>")
            console.log(beams)
            sendDataToBackend()
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

        // pointLoad_input = {5: -1e3, 15: -1e3}
        if (beamIndex !== -1) {
            const beam = beamlist[beamIndex]
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
        }

        const beamLengthToSend = beamLength
        console.log(" data:", {
            "point_load_input": point_load_input,
            "distributed_load_input": distributed_load_input,
            "support_input": support_input,
            "beam_length": beamLengthToSend,
        })
        try {
            const response = await axios({
                method: 'post',
                url: 'url/',
                data: {
                    "point_load_input": point_load_input,
                    "distributed_load_input": distributed_load_input,
                    "support_input": support_input,
                    "beam_length": beamLengthToSend,
                }
            });

            console.log("🚀 ~ file: sendDataToBackend.jsx:75 ~ SendData ~ beamLength:", typeof beamLength)
            if (response.data.ERROR === "Beam is empty") {
                console.log("Response from Backend:", response.data.ERROR);
                setPlot(null)
            } else {
                setPlot(response.data)
            }
        } catch (error) {
            console.log("Error: ", error.message);
        }
    };



    return (
        <button className='btn btn-outline-primary p-1' onClick={(e) => {
            e.preventDefault();
            e.isPropagationStopped()
            sendDataToBackend();
        }}>
            sendDataToBackend</button>
    );
};

