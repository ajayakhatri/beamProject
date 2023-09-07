import React, { useRef, useEffect, useState } from 'react';
import interact from 'interactjs';
import { actualbeamLength, getToolWidth } from './ToolBar';
import { TbArrowBackUp } from 'react-icons/tb';
import { RiDeleteBin5Line } from 'react-icons/ri';

export function DropableNew(props) {
    const { beamID, changeToolValue, beamLength, style, id, deleteTool, dlspan, changeDLSpan } = props
    const [inputValue, setinputValue] = useState((props.positionOnBeam).toFixed(3))
    const [dlspanValue, setdlspanValue] = useState((dlspan).toFixed(3))
    // console.log('handleEnd', inputValue);
    const toolsRef = useRef(null);
    const [isShown, setIsShown] = useState(false)


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
        let actualPosition = parseFloat(e.target.getAttribute("data-actualPosition"))
        let positionOnBeam = parseFloat(e.target.getAttribute("data-positionOnBeam"))
        // console.log('handleEnd', positionOnBeam);
        // setinputValue(positionOnBeam)
        changeToolValue(beamID, e.target.id, "actualPosition", actualPosition)
        changeToolValue(beamID, e.target.id, "positionOnBeam", positionOnBeam)
        setinputValue(positionOnBeam)
    }
    function handleMove(e) {
        e.stopPropagation();
        e.stopImmediatePropagation()
        // e.target.style.removeProperty("left");
        // console.log("e", e)
        const sliderRect = interact.getElementRect(e.target);
        const barRect = interact.getElementRect(e.target.parentElement);
        // const sliderRect = interact.getElementRect(e.target);
        // const barRect = interact.getElementRect(e.target.parentElement);
        const actualPosition = sliderRect.left - barRect.left
        const positionOnBeam = (sliderRect.left - barRect.left + sliderRect.width / 2) * props.beamLength / actualbeamLength()
        // const positionOnBeam = (sliderRect.left - barRect.left + sliderRect.width / 2)
        // console.log({
        //     "sliderRect.left": sliderRect.left,
        //     "barRect.left": barRect.left,
        //     "positionONBeam": sliderRect.left - barRect.left + sliderRect.width / 2
        // })
        // console.log(sliderRect)
        var target = e.target
        var x = (parseFloat(target.getAttribute('data-x')) || 0) + e.dx
        target.style.transform = 'translate(' + x + 'px)'
        target.setAttribute('data-x', x)
        target.setAttribute('data-actualPosition', actualPosition)
        target.setAttribute('data-positionOnBeam', positionOnBeam)
        setinputValue(positionOnBeam)

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
    if (id.split("_")[0] === "distributedLoad") {
        combinedStyle["alignItems"] = "start"

    }



    function handleInputChange(e) {
        if ((e.nativeEvent.data === "-" || e.nativeEvent.data === "+")) {
            e.target.value = inputValue
        }
        setinputValue(e.target.value)
    }
    function handleSpanChange(e) {
        if ((e.nativeEvent.data === "-" || e.nativeEvent.data === "+")) {
            e.target.value = dlspanValue
        }
        setdlspanValue(e.target.value)
    }

    return (
        <div ref={toolsRef} id={id} key={id} style={combinedStyle} className={`SlidingTools_Beam_${beamID}`} >
            <div id={`Svg${id}`}>
                {props.children}
            </div>
            {
                id.split("_")[0] == "distributedLoad" && (<input
                    type="number"
                    inputMode="numeric"
                    min={0.1}
                    // className="form-control-sm"  
                    aria-label={`Change position of ${id}`}
                    value={dlspanValue}
                    id={`setdlspan${id}`}
                    style={{ width: "60px", textAlign: "center", height: "22px" }}
                    onChange={handleSpanChange}
                    onBlur={(e) => {
                        e.stopPropagation()
                        let newSpan = (parseFloat(e.target.value)).toFixed(3)
                        newSpan = Math.max(newSpan, 0.1)
                        newSpan = Math.min(newSpan, props.beamLength)
                        console.log(props.beamLength)
                        setdlspanValue(newSpan)
                        changeDLSpan(beamID, id, "span", (newSpan / (beamLength / actualbeamLength())))
                    }} />)
            }

            <div style={{ position: "absolute", marginTop: "32px", marginLeft: "-6px", display: "flex", justifyContent: "center", flexDirection: "column", gap: "2px" }}>
                <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    className="form-control-sm"
                    aria-label={`Change position of ${id}`}
                    value={inputValue}
                    id={`setLength${id}`}
                    style={{ width: "60px", textAlign: "center", }}
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

