import React, { useRef, useEffect, useState } from 'react';
import interact from 'interactjs';
import { beamLength, getToolWidth } from './ToolBar';

export function DropableNew(props) {
    const [inputValue, setinputValue] = useState(props.positionOnBeam)
    console.log('handleEnd', inputValue);
    const toolsRef = useRef(null);

    useEffect(() => {
        const sliderElement = toolsRef.current;
        interact(sliderElement).draggable({
            inertia: true,
            autoScroll: true,
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
        props.changeToolValue(props.beamID, e.target.id, "actualPosition", actualPosition)
        props.changeToolValue(props.beamID, e.target.id, "positionOnBeam", positionOnBeam)
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
        const positionOnBeam = (sliderRect.left - barRect.left + sliderRect.width / 2) * props.beamLength / beamLength()
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
        ...props.style,
        border: "2px solid black",
        zIndex: "1",
        backgroundColor: "red",
        touchAction: "none",
        userSelect: "none",
        height: "40px",
        position: "absolute"
    }
    function handleInputChange(e) {
        let newPosition = e.target.value;
        setinputValue(newPosition)
    }
    return (
        <div ref={toolsRef} id={props.id} key={props.id} style={combinedStyle} className={`SlidingTools_Beam_${props.beamID}`} >
            {props.children}
            <div style={{ position: "absolute", bottom: "-20px", backgroundColor: "blue" }}>
                <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    className="form-control"
                    aria-label={`Change position of ${props.id}`}
                    value={inputValue}
                    id={`setLength${props.id}`}
                    style={{ width: "150px" }}
                    onChange={handleInputChange} // Handle input changes
                    onBlur={(e) => {
                        e.stopPropagation()
                        // e.preventDefault()
                        let newPosition = e.target.value
                        newPosition = Math.max(newPosition, 0)
                        newPosition = Math.min(newPosition, props.beamLength)
                        props.changeToolValue(props.beamID, props.id, "actualPosition", parseFloat(newPosition) - getToolWidth() / 2)
                        props.changeToolValue(props.beamID, props.id, "positionOnBeam", parseFloat(newPosition))
                    }} />
                hello
            </div>
        </div>
    )
}

