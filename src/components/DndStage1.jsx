import React, { useRef, useEffect } from 'react';
import interact from 'interactjs';
import { beamLength, getToolWidth } from './ToolBar';


{/* beamID, addTool, beamLength, setBeamLength */}

export const BeamBar = (props) => {

    const beamRef = useRef(null);

    useEffect(() => {
        const beamElement = beamRef.current;

        interact(beamElement)
            .dropzone({
                accept: `.Tools_Beam_${props.beamID}`,
                overlap: 0.2,

                ondropactivate: function (e) {
                    e.stopImmediatePropagation()
                    e.stopPropagation();
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
                    e.target.classList.remove('drop-enter')
                    e.target.classList.add('drop-no-enter')
                    e.relatedTarget.style.transform = 'translate(' + 0 + 'px, ' + 0 + 'px)'
                },
                ondrop: function (e) {
                    const target = interact.getElementRect(e.target);
                    const relatedTarget = interact.getElementRect(e.relatedTarget);
                    let position = relatedTarget.left - target.left
                    position = Math.min(target.width - relatedTarget.width / 2, position)
                    position = Math.max(- relatedTarget.width / 2, position)
                    console.log(position)
                    e.stopPropagation()
                    e.stopImmediatePropagation()
                    e.target.classList.remove('drop-enter')
                    e.target.classList.add('drop-no-enter')
                    e.relatedTarget.style.transform = 'translate(' + 0 + 'px, ' + 0 + 'px)'
                    props.addTool(props.beamID, e.relatedTarget.id.split("_")[0], position)
                },
                ondropdeactivate: function (e) {
                    e.stopPropagation();
                    e.stopImmediatePropagation()
                    e.target.classList.remove('drop-enter')
                    e.target.classList.add('drop-no-enter')
                }
            });

        return () => {
            // Clean up any e listeners or resources if needed
        };
    }, []);

    return (
        <div ref={beamRef} id={`Beam_${props.beamID}`} className='my-3 d-flex drop-no-enter' style={{ position: "relative", width: beamLength() + "px", height: "43px", borderTop: "solid 3px" }}>
            {props.children}
        </div>
    )
}

export function DropablePreset(props) {
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
            autoScroll: true,
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
        <div ref={toolsRef} id={props.id} key={props.id} style={{ zIndex: "1", touchAction: "none", border: "1px solid black", width: getToolWidth() + "px", height: "40px", margin: 0, padding: 0 }}
            className={`Tools_Beam_${props.id.split("_")[props.id.split("_").length - 1]}`} >
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


