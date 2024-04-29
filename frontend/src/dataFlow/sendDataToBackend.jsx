// Sends data to backend

import { convertToMeterUnit } from "../components/utility.js";
import axios from "./axios.jsx";
import { useState, useEffect, useRef } from "react";

export const SendData = ({ setMessage, show, beams, beamID, setPlot, beamLength, plot, children }) => {

    const [localBeams, setlocalBeams] = useState(beams)
    const beamsRef = useRef(localBeams);

    useEffect(() => {
        if (beams !== beamsRef.current) {
            console.log("<_______________>")
            console.log(beams)
            show && sendDataToBackend()
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
        let moi = 0
        let area = 0
        let youngModulus = 0
        let analysisMethod = 1
        let unit = "m"
        // eg: pointLoad_input = {5: -1e3, 15: -1e3}
        if (beamIndex !== -1) {
            const beam = beamlist[beamIndex]
            moi = beam.moi
            area = beam.area
            unit = beam.unit
            youngModulus = beam.youngModulus
            analysisMethod = beam.analysisMethod

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
            if (beam.fixedSupportLeft === true) {
                support_input[0] = 0
            }
            if (beam.fixedSupportRight === true) {
                support_input[beam.length] = 0
            }
        }

        const beamLengthToSend = beamLength
        console.log(" sending data to backend:", {
            "beam": beams,
            "point_load_input": point_load_input,
            "distributed_load_input": distributed_load_input,
            "support_input": support_input,
            "beam_length": beamLengthToSend,
            "analysisMethod": analysisMethod,
            "moi": convertToMeterUnit(moi, unit, 4),
            "area": convertToMeterUnit(area, unit, 2),
            "young_modulus": youngModulus,
        })
        const url = '/api/plot/'
        try {
            const response = await axios({
                method: 'post',
                url: url,
                data: {
                    "point_load_input": point_load_input,
                    "distributed_load_input": distributed_load_input,
                    "support_input": support_input,
                    "beam_length": beamLengthToSend,
                    "analysisMethod": analysisMethod,
                    "moi": convertToMeterUnit(moi, unit, 4),
                    "area": convertToMeterUnit(area, unit, 2),
                    "young_modulus": youngModulus,
                }
            });

            if (response.data.ERROR === "Beam is empty") {
                console.log("Response from Backend:", response.data.ERROR);

                setPlot({ ...plot, [beamID]: null });
            } else {
                setPlot({ ...plot, [beamID]: response.data.plots });
                console.log({ "Data send": response.data.data, "Plots received": response.data.plots })
            }
        } catch (error) {
            setPlot({ ...plot, [beamID]: null });
            // Network Error
            const errorMessage = error.message === "Network Error" ? "Could not connect to the server, ensure the server is running at " + axios.defaults.baseURL : "Server could not find the resources at " + axios.defaults.baseURL + url
            setMessage(["danger",
                <>
                    <p style={{ fontSize: "16px", fontWeight: "bold" }}>
                        {error.message}
                    </p>
                    <li>
                        {errorMessage}
                    </li>
                </>
                , true])
        }
    };

    return (
        <span onClick={() => sendDataToBackend()}>{children}</span>
    )

};

