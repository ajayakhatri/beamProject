import axios from "./axios.jsx";
import React, { useState, useEffect } from "react";


// distributedload_input = {
//     15: [0, -10],
//     16: [-10, -20],
//     17: [-20, -30],
//     18: [-30, -40],
//     19: [-40, -50],
// }
// support_1_input = [(0,), (10, 0), (20,)]

// // ??
// if (beam.length > 0) beam.forEach((tools) => {

//     if (tools.pointLoad) {
//         tools.pointLoad.forEach(pl => {
//             point_load_input[pl.positionOnBeam] = pl.load
//         })
//     }

//     // 15: [0, -10],
//     if (tools.distributedLoad) {
//         tools.distributedLoad.forEach(dl => {
//             distributed_load_input[dl.positionOnBeam] = [dl.span, dl.loadStart, dl.loadEnd]
//         })
//     }

//     if (tools.hingedSupport) {
//         tools.hingedSupport.forEach(support => {
//             support_input.push([support.positionOnBeam, 0])
//         });
//     }
//     if (tools.rollerSupport) {
//         tools.rollerSupport.forEach(support => {
//             support_input.push([support.positionOnBeam, 0])
//         })
//     }
// });
export const sendDataToBackend = async (arrangedData, setPlot, beamLength) => {
    const dataToSend = arrangedData
    console.log(" data:", {
        "point_load_input": dataToSend["point_load_input"],
        "distributed_load_input": dataToSend["distributed_load_input"],
        "support_input": dataToSend["support_input"],
        "beam_length": beamLength,
    })
    try {
        const response = await axios({
            method: 'post',
            url: 'url/',
            data: {
                "point_load_input": dataToSend["point_load_input"],
                "distributed_load_input": dataToSend["distributed_load_input"],
                "support_input": dataToSend["support_input"],
            }
        });

        console.log("sdsd", response.data);
        console.log("🚀 ~ file: sendDataToBackend.jsx:75 ~ SendData ~ beamLength:", typeof beamLength)

        setPlot(response.data)
    } catch (err) {
        if (err.response.status === 404) {
            console.log('Resource could not be found!');
        } else {
            console.log(err.message);
        }
    }
};


export const SendData = ({ beams, beamID, setPlot, beamLength }) => {
    // console.log(beams)
    const [arrangedData, setarrangedData] = useState({
        "point_load_input": {},
        "distributed_load_input": {},
        "support_input": [],
        // "beamLength": beamLength,
    })

    const changeResponse = (tochange, newData) => {
        setarrangedData((prevData) => ({
            ...prevData,
            [tochange]: newData,
        }));
    };

    const arrangeData = (beams, beamID) => {
        let point_load_input = []
        let distributed_load_input = []
        let support_input = {}
        const beamIndex = beams.findIndex((beam) => beam.id === beamID);

        // pointLoad_input = {5: -1e3, 15: -1e3}
        if (beamIndex !== -1) {
            const beam = beams[beamIndex]
            Object.values(beam.tools).forEach((toolType) => {
                toolType.forEach(tool => {
                    if (tool.id.split("_")[0] === "pointLoad") {
                        point_load_input.push([tool.positionOnBeam, tool.load])
                    }
                    // # distributedload_ = [
                    //     # ["d", 0, [5, 5000, 1000]],
                    //     # ["d", 5, [5, 10000, 5000]],
                    //     # ]
                    //     # support_ = {2.5: 1, 7.5: 1, 10: 0}
                    //     # pointLoad_ = [[3, 12000], [6, 15000]]
                    // 15: [0, -10],
                    if (tool.id.split("_")[0] === "distributedLoad") {
                        distributed_load_input.push(["d", tool.positionOnBeam, [tool.span, tool.loadStart, tool.loadEnd]])
                    }

                    if (tool.id.split("_")[0] === "hingedSupport") {
                        support_input[tool.positionOnBeam] = 1
                    }
                    if (tool.id.split("_")[0] === "rollerSupport") {
                        support_input[tool.positionOnBeam] = 1
                        // support_input.push([tool.positionOnBeam,])
                    }

                });

            });
        }

        // changeResponse("beamLength", beams[beamIndex].length)
        changeResponse("point_load_input", point_load_input)
        changeResponse("distributed_load_input", distributed_load_input)
        changeResponse("support_input", support_input)

        // sendDataToBackend(arrangedData)
        // console.log("Info to send", {
        //     "point_load_input": point_load_input,
        //     "distributed_load_input": distributed_load_input,
        //     "support_input": support_input,
        // })
    }


    // Call the arrangeData function before sending the data to the backend
    useEffect(() => {
        arrangeData(beams, beamID);
        sendDataToBackend(arrangedData, setPlot,beamLength)
    }, [beams, beamID]);

    return (
        <button className='btn btn-outline-primary p-1' onClick={(e) => {
            e.preventDefault()
            // arrangeData(beams, beamID)
            sendDataToBackend(arrangedData, setPlot, beamLength)
        }}>
            sendDataToBackend</button>
    );
};


export const createNote = async () => {
    const data = {
        "field1": 'Hello, Django!',
        "field2": 'Hello!'
    }
    fetch(`http://127.0.0.1:8000/api/url/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}


export const updateNote = async () => {
    const data = {
        "field1": 'Hello, Django!',
        "field2": 'Hello!'
    }
    fetch(`/url/`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}