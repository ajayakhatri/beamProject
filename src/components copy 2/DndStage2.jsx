import React, { useRef, useEffect, useState } from 'react';
import interact from 'interactjs';
import { actualbeamLength, getToolWidth } from './ToolBar';
import { TbArrowBackUp } from 'react-icons/tb';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { useStateValue } from './StateContext';

export function DropableNew(props) {
    const { status, setstatus, beamID, changeToolValue, beamLength, style, id, deleteTool, dlspan, changeDLSpan, toolType, load } = props
    const [inputValue, setinputValue] = useState((props.positionOnBeam).toFixed(3))
    const [dlSpanValue, setdlspanValue] = useState((dlspan).toFixed(3))
    const localDlSpanRef = useRef(dlSpanValue);
    // console.log('handleEnd', inputValue);
    const toolsRef = useRef(null);
    const [isShown, setIsShown] = useState(false)
    const [isShowDlLoadInput, setIsShowDlLoadInput] = useState(true)

    const [loadStart, setloadStart] = useState(toolType == "distributedLoad" ? load.loadStart : 1)
    const [loadEnd, setloadEnd] = useState(toolType == "distributedLoad" ? load.loadEnd : 1)
    const loadStartRef = useRef(loadStart);
    const loadEndRef = useRef(loadEnd);

    useEffect(() => {
        // setdlspanValue(dlspan);
        localDlSpanRef.current = dlSpanValue; // Update the ref whenever dlSpanValue changes
    }, [dlspan, dlSpanValue]);
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
                'doubletap', function (e) {
                    changeshown(e)
                })
            .pointerEvents({
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
        // console.log('handleEnd', positionOnBeam);
        // setinputValue(positionOnBeam)
        changeToolValue(beamID, e.target.id, "actualPosition", actualPosition)
        changeToolValue(beamID, e.target.id, "positionOnBeam", positionOnBeam)
        setinputValue(positionOnBeam)
        console.log(localDlSpanRef.current)
        if (toolType === "distributedLoad") {
            changeDLSpan(beamID, id, "span", parseFloat(localDlSpanRef.current), beamLength / actualbeamLength(), loadStartRef.current, loadEndRef.current)
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
        const positionOnBeam = (sliderRect.left - barRect.left + sliderRect.width / 2) * props.beamLength / actualbeamLength()
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
        // console.log("sdfdf", `(${positionOnBeam} + ${dlSpanValue}) > ${beamLength}= `, (parseFloat(positionOnBeam) + parseFloat(dlSpanValue)) > parseFloat(beamLength))
        setinputValue(positionOnBeam)
        if (toolType == "distributedLoad" && parseFloat(positionOnBeam) + parseFloat(dlSpanValue) > parseFloat(beamLength)) {
            console.log(parseFloat(beamLength) - parseFloat(positionOnBeam))
            setdlspanValue(Math.max((parseFloat(beamLength) - parseFloat(positionOnBeam)), 0.1))
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
        setinputValue(e.target.value)
    }
    function handleSpanChange(e) {
        e.stopPropagation()
        if ((e.nativeEvent.data === "-" || e.nativeEvent.data === "+")) {
            e.target.value = dlSpanValue
        }
        // let newSpaan = Math.max(e.target.value, "")
        let newSpaan = Math.min(e.target.value, props.beamLength)
        console.log(newSpaan)
        // setdlspanValue(newSpaan)
        setdlspanValue(e.target.value)
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
    return (
        <div ref={toolsRef} id={id} key={id} style={combinedStyle} className={`SlidingTools_Beam_${beamID}`} >
            <div id={`Svg${id}`}>
                {props.children}
            </div>

            {
                toolType == "distributedLoad" && (
                    <>
                        <input
                            type="number"
                            inputMode="numeric"
                            min={0.1}
                            className="form-control-sm dlSpanSet"
                            aria-label={`Change span of ${id}`}
                            value={dlSpanValue}
                            id={`setdlspan${id}`}
                            style={{ display: status.dlSpanSet ? "block" : "none", width: "60px", textAlign: "center", height: "22px", marginLeft: `${getToolWidth() + 8}px` }}
                            onChange={handleSpanChange}
                            onBlur={(e) => {
                                e.stopPropagation()
                                const positionOnBeam = inputValue
                                console.log(props.beamLength)
                                console.log("newSpan", beamLength)
                                console.log("newSpan", dlSpanValue)
                                console.log("newSpan", localDlSpanRef.current)
                                if (parseFloat(positionOnBeam) + parseFloat(dlSpanValue) > parseFloat(beamLength)) {
                                    console.log(parseFloat(beamLength) - parseFloat(positionOnBeam))
                                    changeToolValue(beamID, id, "actualPosition", (- getToolWidth() / 2))
                                    changeToolValue(beamID, id, "positionOnBeam", 0)
                                    setdlspanValue(Math.max((parseFloat(beamLength) - parseFloat(positionOnBeam)), 0.1))
                                    changeDLSpan(beamID, id, "span", ((dlSpanValue > beamLength) ? beamLength : dlSpanValue), beamLength / actualbeamLength(), loadStartRef.current, loadEndRef.current)
                                } else {
                                    changeDLSpan(beamID, id, "span", ((dlSpanValue > beamLength) ? beamLength : dlSpanValue), beamLength / actualbeamLength(), loadStartRef.current, loadEndRef.current)
                                }
                            }} />
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
                                        changeDLSpan(beamID, id, "loadStart", parseFloat(localDlSpanRef.current), beamLength / actualbeamLength(), e.target.value.length === 0 ? 0 : parseFloat(e.target.value), loadEndRef.current)
                                    }
                                    }
                                />
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    min={0.01}
                                    value={loadEnd}
                                    className="dlLoadSet loadSet"
                                    style={{ display: isShowDlLoadInput ? "block" : "none", width: "40px", textAlign: "center", height: "25px", position: "absolute", top: "-72px", right: `-${dlSpanValue}px` }}
                                    onChange={handleChangeLoadEnd}
                                    onBlur={(e) => {
                                        e.stopPropagation()
                                        setloadEnd(e.target.value.length === 0 ? 0 : parseFloat(e.target.value))
                                        console.log(
                                            {
                                                "isNaN(newLoad)": e.target.value.length,
                                                "loadStartRef.current": loadStartRef.current,
                                                "loadEndRef.current": parseFloat(loadEndRef.current)
                                            }
                                        )
                                        changeDLSpan(beamID, id, "loadEnd", parseFloat(localDlSpanRef.current), beamLength / actualbeamLength(), loadStartRef.current, e.target.value.length === 0 ? 0 : parseFloat(e.target.value))
                                    }
                                    }
                                />

                            </>
                        )}
                    </>
                )}


            <div style={{ position: "absolute", marginTop: "32px", marginLeft: "-6px", display: "flex", justifyContent: "center", flexDirection: "column", gap: "2px" }}>
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
                        console.log(props.beamLength)
                        setinputValue(e.target.value)
                        changeToolValue(beamID, id, "actualPosition", (newPosition / (beamLength / actualbeamLength())) - getToolWidth() / 2)
                        changeToolValue(beamID, id, "positionOnBeam", newPosition)
                            ;
                    }} />
                {isShown &&
                    (
                        <div style={{ border: "2px solid black", borderRadius: "8px", width: "60px", }}>
                            <button onClick={() => deleteTool(beamID, id)} className='btn btn-danger w-100' style={{ borderRadius: "0px" }}>
                                <RiDeleteBin5Line />
                            </button>
                            <button onClick={() => setIsShown(false)} className='btn btn-primary w-100' style={{ borderRadius: "0px", height: "28px", display: "flex", justifyContent: "center", alignContent: "center" }}>
                                <TbArrowBackUp />
                            </button>
                        </div>
                    )
                }

            </div>


        </div>
    )
}