import React, { useRef, useEffect, useState } from 'react';
import interact from 'interactjs';
import { getToolWidth } from './ToolBar';
import { TbArrowBackUp } from 'react-icons/tb';
import { RiDeleteBin5Line } from 'react-icons/ri';

export function DropableNew(props) {
    const { status, actualBeamLength, beamID, style, id, dlspan, toolType, load, color } = props
    const [changeDLSpan, deleteTool, changeBeamValue, changeToolValue] = props.changefunctions
    const beamLength = parseFloat(props.beamLength);
    const [inputValue, setinputValue] = useState(parseFloat(parseFloat(props.positionOnBeam).toFixed(3)))
    const [dlSpanValue, setdlspanValue] = useState(parseFloat(parseFloat(dlspan).toFixed(3)))
    const localDlSpanRef = useRef(dlSpanValue);
    const toolsRef = useRef(null);
    const [isShown, setIsShown] = useState(false)
    const [isShowDlLoadInput, setIsShowDlLoadInput] = useState(true)

    const [loadStart, setloadStart] = useState(parseFloat(toolType == "distributedLoad" ? load.loadStart : load))
    const [loadEnd, setloadEnd] = useState(parseFloat(toolType == "distributedLoad" ? load.loadEnd : 1))
    const loadStartRef = useRef(loadStart);
    const loadEndRef = useRef(loadEnd);

    useEffect(() => {
        // setdlspanValue(dlspan);
        localDlSpanRef.current = dlSpanValue; // Update the ref whenever dlSpanValue changes
    }, [dlspan, dlSpanValue]);
    // useEffect(() => {
    //     changeDLSpan(beamID, id, "span", ((dlSpanValue > beamLength) ? beamLength : dlSpanValue), beamLength / actualBeamLength, loadStartRef.current, loadEndRef.current)
    // }, [props.positionOnBeam]);
    useEffect(() => {
        loadStartRef.current = loadStart;
    }, [loadStartRef, loadStart]);
    useEffect(() => {
        loadEndRef.current = loadEnd;
    }, [loadEnd, loadEndRef]);


    function changeshown(e) {
        console.log(e)
        // e.stopPropagation();
        // e.stopImmediatePropagation()
        console.log("isShowDelete", isShown)
        setIsShown(!isShown)
    }

    useEffect(() => {
        const sliderElement = toolsRef.current;
        interact(sliderElement)
            .draggable({
                inertia: true,
                autoScroll: true,
                allowFrom: `#Svg${id}`,
                modifiers: [
                    interact.modifiers.restrictRect({
                        restriction: 'parent',
                        elementRect: { top: 0, left: 0.50, bottom: 0, right: 0.50 }
                    }),
                ],
                listeners: {
                    start: function (e) {
                        // setIsShown(false)
                    },
                    move: handleMove,
                    end: handleEnd
                }
            })
            .on(
                'hold', function (e) {
                    changeshown(e)
                })
            .pointerEvents({
                holdDuration: 500,
                allowFrom: `#Svg${id}`,
            })
        return () => {
            // Clean up any e listeners or resources if needed
        };
    }, []);

    function handleEnd(e) {
        e.stopPropagation();
        e.stopImmediatePropagation()
        setIsShowDlLoadInput(true)
        let actualPosition = parseFloat(e.target.getAttribute("data-actualPosition"))
        let positionOnBeam = parseFloat(e.target.getAttribute("data-positionOnBeam"))

        // setinputValue(positionOnBeam)
        changeToolValue(beamID, id, "actualPosition", actualPosition)
        changeToolValue(beamID, id, "positionOnBeam", positionOnBeam)
        setinputValue(positionOnBeam)
        console.log(localDlSpanRef.current)
        if (toolType === "distributedLoad") {
            changeDLSpan(beamID, id, "span", localDlSpanRef.current, beamLength / actualBeamLength, loadStartRef.current, loadEndRef.current)
        }
    }

    function handleMove(e) {
        e.stopPropagation();
        e.stopImmediatePropagation()
        // e.target.style.removeProperty("left");
        if (e.target.parentElement === null || e.target === null) {
            return
        }
        setIsShowDlLoadInput(false)
        const sliderRect = interact.getElementRect(e.target);
        // console.log("e", e.target.parentElement)
        const barRect = interact.getElementRect(e.target.parentElement);
        // const sliderRect = interact.getElementRect(e.target);
        // const barRect = interact.getElementRect(e.target.parentElement);
        const actualPosition = sliderRect.left - barRect.left
        const positionOnBeam = (sliderRect.left - barRect.left + sliderRect.width / 2) * props.beamLength / actualBeamLength
        // const positionOnBeam = (sliderRect.left - barRect.left + sliderRect.width / 2)
        // console.log({
        //     "sliderRect.left": sliderRect.left,
        //     "barRect.left": barRect.left,
        //     "positionONBeam": sliderRect.left - barRect.left
        // })
        // console.log(sliderRect)
        var target = e.target
        var x = (parseFloat(target.getAttribute('data-x')) || 0) + e.dx
        target.style.transform = 'translate(' + x + 'px)'
        target.setAttribute('data-x', x)
        target.setAttribute('data-actualPosition', actualPosition)
        target.setAttribute('data-positionOnBeam', positionOnBeam)
        // console.log("sdfdf", `(${positionOnBeam} + ${dlSpanValue}) > ${beamLength}= `, (positionOnBeam + dlSpanValue) > beamLength)
        setinputValue(positionOnBeam)
        if (toolType == "distributedLoad" && positionOnBeam + dlSpanValue > beamLength) {
            console.log(beamLength - positionOnBeam)
            setdlspanValue(Math.max((beamLength - positionOnBeam), 0.1))
        }


    };
    const combinedStyle = {
        ...style,
        // border: "2px solid black",
        zIndex: "1",
        // backgroundColor: "red",
        touchAction: "none",
        userSelect: "none",
        height: "40px",
        position: "absolute",
        display: "flex",
        flexDirection: "column",
    }
    if (toolType === "distributedLoad") {
        combinedStyle["alignItems"] = "center"
    }



    function handleInputChange(e) {
        e.stopPropagation()
        if ((e.nativeEvent.data === "-" || e.nativeEvent.data === "+")) {
            e.target.value = inputValue
        }
        setinputValue(parseFloat(e.target.value))
    }
    function handleSpanChange(e) {
        e.stopPropagation()
        if ((e.nativeEvent.data === "-" || e.nativeEvent.data === "+")) {
            e.target.value = dlSpanValue
        }
        setdlspanValue(parseFloat(e.target.value))
    }
    const handleChangeLoadStart = (e) => {
        e.stopPropagation()
        if ((e.nativeEvent.data === "-" || e.nativeEvent.data === "+")) {
            e.target.value = loadStart
        }
        setloadStart(parseFloat(e.target.value))
    }

    const handleChangeLoadEnd = (e) => {
        e.stopPropagation()
        if ((e.nativeEvent.data === "-" || e.nativeEvent.data === "+")) {
            e.target.value = loadEnd
        }
        setloadEnd(parseFloat(e.target.value))
    }
    const a = dlSpanValue
    const [margin, setmargin] = useState(a)
    return (
        <div ref={toolsRef} id={id} key={id} style={combinedStyle} className={`SlidingTools_Beam_${beamID}`} >
            <div id={`Svg${id}`}>
                {props.children}
            </div>
            {
                toolType == "pointLoad" && (
                    <>
                        {status.loadSet && (
                            <input
                                type="number"
                                inputMode="numeric"
                                min={0.01}
                                value={loadStart}
                                className="dlLoadSet loadSet"
                                style={{ display: isShowDlLoadInput ? "block" : "none", width: "40px", textAlign: "center", height: "25px", position: "absolute", top: "-90px" }}
                                onChange={handleChangeLoadStart}
                                onBlur={(e) => {
                                    e.stopPropagation()
                                    setloadStart(e.target.value.length === 0 ? 0 : parseFloat(e.target.value))
                                    changeToolValue(beamID, id, "load", e.target.value.length === 0 ? 0.1 : parseFloat(e.target.value))
                                }
                                }
                            />
                        )}
                    </>
                )}

            {
                toolType == "distributedLoad" && (
                    <>
                        {status.loadSet && (
                            <>
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    min={0.01}
                                    value={loadStart}
                                    className="dlLoadSet loadSet"
                                    style={{ display: isShowDlLoadInput ? "block" : "none", width: "40px", textAlign: "center", height: "25px", position: "absolute", top: "-72px" }}
                                    onChange={handleChangeLoadStart}
                                    onBlur={(e) => {
                                        e.stopPropagation()
                                        setloadStart(e.target.value.length === 0 ? 0 : parseFloat(e.target.value))
                                        changeDLSpan(beamID, id, "loadStart", localDlSpanRef.current, beamLength / actualBeamLength, e.target.value.length === 0 ? 0 : parseFloat(e.target.value), loadEndRef.current)
                                    }
                                    }
                                />
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    min={0.01}
                                    value={loadEnd}
                                    className="dlLoadSet loadSet"
                                    style={{ display: isShowDlLoadInput ? "block" : "none", width: "40px", textAlign: "center", height: "25px", position: "absolute", top: "-72px", right: `-${-10 + margin / (beamLength / actualBeamLength)}px` }}
                                    onChange={handleChangeLoadEnd}
                                    onBlur={(e) => {
                                        e.stopPropagation()
                                        setloadEnd(e.target.value.length === 0 ? 0 : parseFloat(e.target.value))
                                        console.log(
                                            {
                                                "isNaN(newLoad)": e.target.value.length,
                                                "loadStartRef.current": loadStartRef.current,
                                                "loadEndRef.current": loadEndRef.current
                                            }
                                        )
                                        changeDLSpan(beamID, id, "loadEnd", localDlSpanRef.current, beamLength / actualBeamLength, loadStartRef.current, e.target.value.length === 0 ? 0 : parseFloat(e.target.value))
                                    }
                                    }
                                />

                            </>
                        )}
                        {/* DL span input */}
                        <div className='d-flex justify-content-between' style={{ width: dlSpanValue / (beamLength / actualBeamLength), marginLeft: `${(margin / (beamLength / actualBeamLength))}px` }}>
                            |<span style={{ color: color }}>&#8592;</span>
                            <div style={{ width: "100%", marginTop: "13px", borderTop: "1px dashed", color: color }}></div>
                            <input
                                type="number"
                                inputMode="numeric"
                                min={0.1}
                                className="form-control-sm dlSpanSet"
                                aria-label={`Change span of ${id}`}
                                value={dlSpanValue}
                                id={`setdlspan${id}`}
                                style={{ display: status.dlSpanSet ? "block" : "none", width: "50px", textAlign: "center", height: "22px" }}
                                // style={{ display: status.dlSpanSet ? "block" : "none", width: "60px", textAlign: "center", height: "22px", marginLeft: `${(margin / (beamLength / actualBeamLength))}px` }}
                                onChange={handleSpanChange}
                                onBlur={(e) => {
                                    e.stopPropagation()
                                    const positionOnBeam = inputValue
                                    console.log(props.beamLength)
                                    console.log("newSpan", beamLength)
                                    console.log("newSpan", isNaN(dlSpanValue))
                                    console.log("newSpan", localDlSpanRef.current)
                                    // e.target.value < 0 || e.target.value === "") ? 0 : e.target.value > props.beamLength ? props.beamLength : e.target.value
                                    localDlSpanRef.current = isNaN(dlSpanValue) || dlSpanValue.length === 0 ? 0.1 : localDlSpanRef.current
                                    setdlspanValue(localDlSpanRef.current)
                                    console.log("dff", localDlSpanRef.current)
                                    console.log("dff", dlSpanValue, ">", beamLength, dlSpanValue > beamLength)
                                    if ((positionOnBeam + dlSpanValue) > beamLength) {
                                        console.log(beamLength - positionOnBeam)
                                        changeToolValue(beamID, id, "actualPosition", (- getToolWidth() / 2))
                                        changeToolValue(beamID, id, "positionOnBeam", 0)
                                        setdlspanValue(Math.max((beamLength - positionOnBeam), 0.1))

                                        changeDLSpan(beamID, id, "span", ((localDlSpanRef.current > beamLength) ? beamLength : localDlSpanRef.current), beamLength / actualBeamLength, loadStartRef.current, loadEndRef.current)
                                    } else {
                                        changeDLSpan(beamID, id, "span", ((localDlSpanRef.current > beamLength) ? beamLength : localDlSpanRef.current), beamLength / actualBeamLength, loadStartRef.current, loadEndRef.current)
                                    }
                                    setmargin((localDlSpanRef.current > beamLength) ? beamLength : localDlSpanRef.current)
                                }} />
                            <div style={{ width: "100%", marginTop: "13px", borderTop: "1px dashed", color: color }}></div>
                            <span style={{ color: color }}>&#8594;</span>|
                        </div>
                    </>
                )}


            <div style={{ position: "absolute", marginTop: "32px", marginLeft: "-6px", display: "flex", justifyContent: "center", flexDirection: "column", gap: "2px" }}>
                {/* Position Input */}
                <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    className="form-control-sm lengthSet"
                    aria-label={`Change position of ${id}`}
                    value={inputValue}
                    id={`setLength${id}`}
                    style={{ display: status.lengthSet ? "block" : "none", width: "60px", textAlign: "center", marginLeft: toolType === "distributedLoad" && (`${getToolWidth() + 8}px`) }}
                    onChange={handleInputChange} // Handle input changes
                    // Handle input changes
                    onBlur={(e) => {
                        e.stopPropagation()
                        console.log(e.target.value)
                        let newPosition = (parseFloat(e.target.value)).toFixed(3)
                        console.log(newPosition)
                        newPosition = Math.max(newPosition, 0)
                        newPosition = Math.min(newPosition, props.beamLength)
                        console.log(((e.target.value < 0 || e.target.value === "") ? 0 : (parseFloat(e.target.value) > props.beamLength) ? props.beamLength : parseFloat(e.target.value)))
                        setinputValue((e.target.value.length === 0 || isNaN(e.target.value)) ? 0 : (parseFloat(e.target.value) > props.beamLength) ? props.beamLength : parseFloat(e.target.value))
                        changeToolValue(beamID, id, "actualPosition", (((e.target.value < 0 || e.target.value === "") ? 0 : (parseFloat(e.target.value) > props.beamLength) ? props.beamLength : e.target.value) / (beamLength / actualBeamLength)) - (getToolWidth() / 2))
                        changeToolValue(beamID, id, "positionOnBeam", ((e.target.value < 0 || e.target.value === "") ? 0 : (parseFloat(e.target.value) > props.beamLength) ? props.beamLength : e.target.value))
                            ;
                    }} />
                {isShown &&
                    (
                        <div>
                            <div style={{ border: "2px solid black", borderRadius: "8px", width: "60px", marginLeft: toolType === "distributedLoad" && (`${getToolWidth() + 8}px`) }}>
                                <button onClick={() => deleteTool(beamID, id)} className='btn btn-danger w-100' style={{ borderRadius: "0px" }}>
                                    <RiDeleteBin5Line />
                                </button>
                                <button onClick={() => setIsShown(false)} className='btn btn-primary w-100' style={{ borderRadius: "0px", height: "28px", display: "flex", justifyContent: "center", alignContent: "center" }}>
                                    <TbArrowBackUp />
                                </button>
                            </div>
                            {toolType === "distributedLoad" && (
                                <input type="color" style={{ marginLeft: (`${getToolWidth() + 8}px`) }}
                                    onBlur={(e) => { console.log(e.target.value); changeToolValue(beamID, id, "color", e.target.value) }
                                    } />
                            )}
                        </div>
                    )
                }
            </div>
        </div>
    )
}
