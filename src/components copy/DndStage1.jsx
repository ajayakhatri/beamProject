import React, { useRef, useEffect, useState } from 'react';
import interact from 'interactjs';
import { getToolWidth } from './ToolBar';

export const BeamBar = (props) => {
    const beamID = props.beamID
    const addTool = props.addTool
    const children = props.children
    const scale = parseFloat(props.scale)
    const actualBeamLength = parseFloat(props.actualBeamLength)
    const [localBeamscale, setLocalBeamscale] = useState(scale);
    const localBeamscaleRef = useRef(localBeamscale);

    const beamRef = useRef(null);

    console.log(localBeamscaleRef.current)
    useEffect(() => {
        setLocalBeamscale(scale);
        localBeamscaleRef.current = localBeamscale; // Update the ref whenever localBeamscale changes
    }, [scale, localBeamscale]);


    useEffect(() => {
        const beamElement = beamRef.current;
        interact(beamElement)
            .dropzone({
                accept: `.Tools_Beam_${beamID}`,
                overlap: 0.2,
                ondropactivate: function (e) {
                    e.stopPropagation();
                    e.stopImmediatePropagation()
                },
                ondragenter: function (e) {
                    e.stopPropagation();
                    e.stopImmediatePropagation()
                    e.target.classList.add('drop-enter')
                    e.target.classList.remove('drop-no-enter')
                },
                ondragleave: function (e) {
                    e.stopPropagation();
                    e.stopImmediatePropagation()
                    console.log("leave", e)
                    console.log("leave", localBeamscale)
                    e.target.classList.remove('drop-enter')
                    e.target.classList.add('drop-no-enter')
                    e.relatedTarget.style.transform = 'translate(' + 0 + 'px, ' + 0 + 'px)'
                },
                ondrop: function (e) {
                    e.stopPropagation()
                    e.stopImmediatePropagation()
                    const target = interact.getElementRect(e.target);
                    const relatedTarget = interact.getElementRect(e.relatedTarget);
                    const actualPosition = parseFloat(relatedTarget.left) - parseFloat(target.left)
                    const positionOnBeam = (parseFloat(relatedTarget.left) - parseFloat(target.left) + parseFloat(relatedTarget.width) / 2) * parseFloat(localBeamscaleRef.current)
                    console.log("scale:beamLength / actualBeamLength", localBeamscaleRef.current)
                    console.log("actualPosition", actualPosition)
                    console.log("positiononBeam", positionOnBeam)
                    e.stopPropagation()
                    e.stopImmediatePropagation()
                    e.target.classList.remove('drop-enter')
                    e.target.classList.add('drop-no-enter')
                    e.relatedTarget.style.transform = 'translate(' + 0 + 'px, ' + 0 + 'px)'
                    console.log(localBeamscale)
                    console.log("localBeamscaleRef.current", localBeamscaleRef.current)

                    addTool(beamID, e.relatedTarget.id.split("_")[0], (actualPosition < 0 ? -25 : actualPosition), positionOnBeam < 0 ? 0 : positionOnBeam, e.relatedTarget.id.split("_")[0] === "distributedLoad" ? localBeamscaleRef.current : localBeamscaleRef.current)
                },
                ondropdeactivate: function (e) {
                    e.stopPropagation();
                    e.stopImmediatePropagation()
                    e.target.classList.remove('drop-enter')
                    e.target.classList.add('drop-no-enter')
                }
            });
    }, [scale, localBeamscale]);

    return (
        <>
            <div ref={beamRef} id={`Beam_${beamID}`} className='d-flex drop-no-enter' style={{
                position: "relative", width: actualBeamLength + "px", height: "70px", borderTop: "solid 3px", /* This hides the overflowing content */
            }}>
                {children}
            </div>
        </>
    )
}

export function DropablePreset(props) {
    const { id } = props
    const toolsRef = useRef(null);

    useEffect(() => {
        const sliderElement = toolsRef.current;

        interact(sliderElement).draggable({
            inertia: true,
            autoScroll: true,
            modifiers: [
                interact.modifiers.restrictRect({
                    // restriction: 'parent',
                    // endOnly: true
                })
            ],
            // dragMoveListener from the dragging demo above
            listeners: {
                move: dragMoveListener,
                end: dragEndListener,
            }
        })


        return () => {
            // Clean up any e listeners or resources if needed
        };
    }, []);
    return (
        <div ref={toolsRef} id={id} key={id} style={{ zIndex: "1", touchAction: "none", width: getToolWidth() + "px", height: "40px", margin: 0, padding: 0 }}
            className={`Tools_Beam_${id.split("_")[id.split("_").length - 1]}`} >
            {props.children}
        </div>
    )
}

function dragMoveListener(e) {
    e.stopPropagation();
    var target = e.target
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + e.dx
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + e.dy

    // translate the element
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

    // update the posiion attributes
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)
}

function dragEndListener(e) {
    e.stopPropagation()
    e.target.style.transform = 'translate(' + 0 + 'px, ' + 0 + 'px)'
    e.target.setAttribute('data-x', 0)
    e.target.setAttribute('data-y', 0)
}


