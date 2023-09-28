// Handles dragging of elements on beam

import React, { useRef, useEffect, useState } from 'react';
import interact from 'interactjs';
import { getToolWidth } from './ToolBar';
import { TbArrowBackUp } from 'react-icons/tb';
import { RiDeleteBin5Line } from 'react-icons/ri';

export function DropableNew(props) {
    const { status, beamID, style, id, toolType, load, color, unit,loadUnit } = props
    const [changeDLSpan, deleteTool, changeBeamValue, changeToolValue] = props.changefunctions
    const dlspan = parseFloat(props.dlspan);
    const actualBeamLength = parseFloat(props.actualBeamLength);
    const beamLength = parseFloat((props.beamLength).toFixed(3));
    const [inputValue, setinputValue] = useState(parseFloat(parseFloat(props.positionOnBeam).toFixed(3)))
    const [dlSpanValue, setdlspanValue] = useState(parseFloat(parseFloat(dlspan).toFixed(3)))
    const localDlSpanRef = useRef(dlSpanValue);
    const toolsRef = useRef(null);
    const [isShown, setIsShown] = useState(false)

    const [loadStart, setloadStart] = useState(parseFloat(toolType == "distributedLoad" ? load.loadStart : load))
    const [loadEnd, setloadEnd] = useState(parseFloat(toolType == "distributedLoad" ? load.loadEnd : 1))
    const loadStartRef = useRef(loadStart);
    const loadEndRef = useRef(loadEnd);
    const [showleninput, setshowleninput] = useState(false)

    useEffect(() => {
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
                    move: handleMove,
                    end: handleEnd
                }
            })
            .on(
                'hold', function (e) {
                    changeshown(e)
                    setshowleninput(false)
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
        setshowleninput(false)
        let actualPosition = parseFloat(e.target.getAttribute("data-actualPosition"))
        let positionOnBeam = parseFloat(e.target.getAttribute("data-positionOnBeam"))

        // setinputValue(positionOnBeam)
        changeToolValue(beamID, id, "actualPosition", actualPosition)
        changeToolValue(beamID, id, "positionOnBeam", positionOnBeam)
        setinputValue(positionOnBeam)
        // console.log("On Ending Moving Tool", {
        //     "localDlSpanRef.current": localDlSpanRef.current,
        //     "beamLength": beamLength,
        //     "scale": beamLength / actualBeamLength,
        //     "actualPosition": actualPosition,
        //     "positionOnBeam": positionOnBeam,
        //     "beamLength - positionOnBeam": beamLength - positionOnBeam,
        // })
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
        setshowleninput(true)
        const sliderRect = interact.getElementRect(e.target);
        const barRect = interact.getElementRect(e.target.parentElement);
        const actualPosition = sliderRect.left - barRect.left
        const positionOnBeam = parseFloat(((sliderRect.left - barRect.left + sliderRect.width / 2) * beamLength / actualBeamLength).toFixed(3))
        // console.log("On Moving Tool", {
        //     "beamLength":  beamLength,
        //     "sliderRect.left": sliderRect.left,
        //     "sliderElement": sliderRect.width,
        //     "barRect.left": barRect.left,
        //     "positionOnBeam": positionOnBeam,
        //     "beamLength - positionOnBeam": beamLength - positionOnBeam,
        // })
        var target = e.target
        var x = (parseFloat(target.getAttribute('data-x')) || 0) + e.dx
        target.style.transform = 'translate(' + x + 'px)'
        target.setAttribute('data-x', x)
        target.setAttribute('data-actualPosition', actualPosition)
        target.setAttribute('data-positionOnBeam', positionOnBeam)
        // console.log("sdfdf", `(${positionOnBeam} + ${dlSpanValue}) > ${beamLength}= `, (positionOnBeam + dlSpanValue) > beamLength)
        setinputValue(positionOnBeam)
        if (toolType == "distributedLoad" && positionOnBeam + dlSpanValue > beamLength) {
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
        fontSize:"13px",
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
        if ((e.nativeEvent.data === "+")) {
        // if ((e.nativeEvent.data === "-" || e.nativeEvent.data === "+")) {
            e.target.value = loadStart
        }
        setloadStart(parseFloat(e.target.value))
    }

    const handleChangeLoadEnd = (e) => {
        e.stopPropagation()
        if ((e.nativeEvent.data === "+")) {
        // if ((e.nativeEvent.data === "-" || e.nativeEvent.data === "+")) {
            e.target.value = loadEnd
        }
        setloadEnd(parseFloat(e.target.value))
    }

    const a = dlSpanValue
    const [margin, setmargin] = useState(a)
    const [isPLInputVisible, setPLInputVisible] = useState(false)
    const [isDLLeftInputVisible, setDLLeftInputVisible] = useState(false)
    const [isDLRightInputVisible, setDLRightInputVisible] = useState(false)
    const [isDLSpanInputVisible, setDLSpanInputVisible] = useState(false)
    return (
        <div  ref={toolsRef} id={id} key={id} style={combinedStyle} className={`SlidingTools_Beam_${beamID}`} >
            <div onClick={()=> {setshowleninput(!showleninput)}}id={`Svg${id}`}>
                {props.children}
            </div>
            {
                toolType == "pointLoad" && status.loadSet && (
                    <>
                       {!isPLInputVisible?
                        (
                        <div onClick={() => setPLInputVisible(true)}  className='inputPointer' style={{position: "absolute", top: "-90px",border:!props.showInfoBorder&&"none" }}>
                            {loadStart+" "+loadUnit}
                        </div>
                    ):(
                            <input
                                type="number"
                                inputMode="numeric"
                                min={0.01}
                                autoFocus={true}
                                value={loadStart}
                                className="dlLoadSet loadSet"
                                style={{  width: "60px", textAlign: "center", height: "25px", position: "absolute", top: "-90px" }}
                                onChange={handleChangeLoadStart}
                                onBlur={(e) => {
                                    e.stopPropagation()
                                    setPLInputVisible(false)
                                    setloadStart(e.target.value.length === 0 ? 0 : parseFloat(e.target.value))
                                    changeToolValue(beamID, id, "load", e.target.value.length === 0 ? 0.1 : parseFloat(e.target.value))
                                }
                                }
                            />
                        )}
                    </>
                )}

            {
                /* DL load input */
                toolType == "distributedLoad" && status.loadSet &&(
                    <>
                    { !isDLLeftInputVisible ?(
                        <div onClick={()=>setDLLeftInputVisible(true)}  className='inputPointer' style={{   position: "absolute", top: "-90px",border:!props.showInfoBorder&&"none" }}>
                            {loadStart+" "+loadUnit}/{unit}
                        </div>
                    ):(

                                <input
                                    type="number"
                                    autoFocus={true}
                                    inputMode="numeric"
                                    min={0.01}
                                    value={loadStart}
                                    className="dlLoadSet loadSet"
                                    style={{  width: "60px", textAlign: "center", height: "25px", position: "absolute", top: "-90px" }}
                                    onChange={handleChangeLoadStart}
                                    onBlur={(e) => {
                                        e.stopPropagation()
                                        setDLLeftInputVisible(false)
                                        setloadStart(e.target.value.length === 0 ? 0 : parseFloat(e.target.value))
                                        changeDLSpan(beamID, id, "loadStart", localDlSpanRef.current, beamLength / actualBeamLength, e.target.value.length === 0 ? 0 : parseFloat(e.target.value), loadEndRef.current)
                                    }
                                    }
                                />
                        )}
                    { !isDLRightInputVisible ?(
                        <div onClick={()=>setDLRightInputVisible(true)} className='inputPointer' style={{  position: "absolute", top: "-90px", right: `-${-10 + margin / (beamLength / actualBeamLength)}px`,border:!props.showInfoBorder&&"none" }}>
                           {loadEnd+" "+loadUnit}/{unit}
                        </div>
                    ):(
                                <input
                                    type="number"
                                    autoFocus={true}
                                    inputMode="numeric"
                                    min={0.01}
                                    value={loadEnd}
                                    className="dlLoadSet loadSet"
                                    style={{  width: "60px", textAlign: "center", height: "25px", position: "absolute", top: "-90px", right: `-${-10 + margin / (beamLength / actualBeamLength)}px` }}
                                    onChange={handleChangeLoadEnd}
                                    onBlur={(e) => {
                                        e.stopPropagation()
                                        setDLRightInputVisible(false)
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
                        )}
                        
                        {/* DL span input */}
                    
                            <div className='d-flex justify-content-between' style={{ marginTop:"33px",zIndex:"10", width: dlSpanValue / (beamLength / actualBeamLength), marginLeft: `${(margin / (beamLength / actualBeamLength))}px` }}>
                                <div className='strikethrough'>|</div>

                                <div style={{ width: "100%", marginTop: "11px", borderTop: "1px solid" }}></div>
                        {!isDLSpanInputVisible? (
                             <div onClick={()=>setDLSpanInputVisible(true)}  className='inputPointer tour-inputSpan' style={{border:!props.showInfoBorder&&"none"}}>
                             {dlSpanValue+unit}
                                   </div>
                                ): (
                                <div className="btn" style={{ border: `1px solid ${color}`, borderRadius: "0.375rem", display: "flex", alignItems: "center", backgroundColor: "white", padding: "0px", paddingRight: "0.5px" }}>
                                    <input
                                        autoFocus={true}
                                        type="number"
                                        inputMode="numeric"
                                        min={0.1}
                                        className="dlSpanSet"
                                        aria-label={`Change span of ${id}`}
                                        value={dlSpanValue}
                                        id={`setdlspan${id}`}
                                        style={{ width: "60px", textAlign: "center", height: "22px", border: "none" }}
                                        onChange={handleSpanChange}
                                        onBlur={(e) => {
                                            e.stopPropagation()
                                            setDLSpanInputVisible(false)
                                            const positionOnBeam = inputValue
                                            console.log("On Changing span length", {
                                                "isNaN(dlSpanValue)": isNaN(dlSpanValue),
                                                "beamLength": beamLength,
                                                "localDlSpanRef.current": localDlSpanRef.current,
                                            })
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
                                        </div>
                                )}
                                <div style={{ width: "100%", marginTop: "11px", borderTop: "1px solid" }}></div>
                                <div className='strikethrough'>|</div>
                            </div>
                        
                    </>
                )}

            <div style={{ position: "absolute", top:toolType === "distributedLoad"?"50px":"45px", marginLeft: "-6px", display: "flex", justifyContent: "center", flexDirection: "column", gap: "2px" }}>
                {/* Position Input */}
                {status.lengthSet && showleninput && (
                    <div className="btn" style={{ border: "1px solid", borderRadius: "0.375rem", display: "flex", alignItems: "center", backgroundColor: "white", padding: "0px", margin: "0px", paddingRight: "0.5px", marginLeft: toolType === "distributedLoad" && (`${getToolWidth() + 8}px`) }}>
                        <input
                            type="number"
                            inputMode="numeric"
                            min={0}
                            className="lengthSet mt-1"
                            aria-label={`Change position of ${id}`}
                            value={inputValue}
                            id={`setLength${id}`}
                            style={{ width: "50px", height: "20px", textAlign: "center", padding: "0px", margin: "0px", border: "none" }}
                            onChange={handleInputChange} // Handle input changes
                            // Handle input changes
                            onBlur={(e) => {
                                e.stopPropagation()
                                console.log(e.target.value)
                                let newPosition = (parseFloat(e.target.value)).toFixed(3)
                                console.log(newPosition)
                                newPosition = Math.max(newPosition, 0)
                                newPosition = Math.min(newPosition, beamLength)
                                console.log(((e.target.value < 0 || e.target.value === "") ? 0 : (parseFloat(e.target.value) > beamLength) ? beamLength : parseFloat(e.target.value)))
                                setinputValue((e.target.value.length === 0 || isNaN(e.target.value)) ? 0 : (parseFloat(e.target.value) > beamLength) ? beamLength : parseFloat(e.target.value))
                                changeToolValue(beamID, id, "actualPosition", (((e.target.value < 0 || e.target.value === "") ? 0 : (parseFloat(e.target.value) > beamLength) ? parseFloat(beamLength) : parseFloat(e.target.value)) / (beamLength / parseFloat(actualBeamLength))) - (getToolWidth() / 2))
                                changeToolValue(beamID, id, "positionOnBeam", ((e.target.value < 0 || e.target.value === "") ? 0 : (parseFloat(e.target.value) > beamLength) ? parseFloat(beamLength) : parseFloat(e.target.value)))
                                   
                            }} />
                    </div>
                )}
                {isShown &&
                    (
                        <>
                            <div style={{ border: "2px solid black", borderRadius: "8px", width: "70px", marginLeft: toolType === "distributedLoad" && (`${getToolWidth() + 8}px`) }}>
                                <button onClick={() => deleteTool(beamID, id)} className='btn btn-danger w-100' style={{ borderRadius: "0px", height: "30px" }}>
                                    <RiDeleteBin5Line />
                                </button>
                                <button onClick={() => setIsShown(false)} className='btn btn-primary w-100' style={{ borderRadius: "0px", height: "28px" }}>
                                    <TbArrowBackUp />
                                </button>
                                {toolType === "distributedLoad" && (
                                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
                                        Color:
                                        <input type="color"
                                            defaultValue={color}
                                            onBlur={(e) => { console.log(e.target.value); changeToolValue(beamID, id, "color", e.target.value) }
                                            } />
                                    </div>
                                )}
                            </div>
                        </>
                    )
                }
            </div>

        </div>
    )
}
