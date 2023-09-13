import { useEffect } from 'react';
import React from 'react';
import interact from 'interactjs';

// Define a functional component
const Draggable1 = ({ ToolWidth, beamID, newToolID, children }) => {
    let positionX = 0
    const dragMoveListener = (e) => {

        // Update the position of the draggable element
        const target = e.target;
        const beamrect = document.querySelector(`#Beam_${beamID}`).getBoundingClientRect()
        const rect = target.getBoundingClientRect();
        console.log(rect)
        console.log(beamrect)
        console.log(e.clientX)
        const relativeX = e.clientX - rect.left;
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + e.dx;
        // const y = (parseFloat(target.getAttribute('data-y')) || 0) + e.dy;

        // Update the element's position
        positionX = relativeX
        target.style.transform = `translate(${x}px)`;
        // Update the data-x and data-y attributes
        target.setAttribute('data-x', x);
        // target.setAttribute('data-y', y);

    };

    // const position = { x: parseFloat(sliderObj.positionOnBeam.toFixed(3)) }
    const position = { x: 0 }
    useEffect(() => {
        // Enable draggables to be dropped into a dropzone
        // interact(`#Beam_${beamID}`).dropzone({
        //     // accept: '#yes-drop',
        //     overlap: 0.75,

        //     ondropactivate: (e) => {
        //         e.target.classList.add('drop-active');
        //     },
        //     ondragenter: (e) => {
        //         const draggableElement = e.relatedTarget;
        //         const dropzoneElement = e.target;

        //         dropzoneElement.classList.add('drop-target');
        //         draggableElement.classList.add('can-drop');
        //         draggableElement.textContent = 'Dragged in';
        //     },
        //     ondragleave: (e) => {
        //         e.target.classList.remove('drop-target');
        //         e.relatedTarget.classList.remove('can-drop');
        //         e.relatedTarget.textContent = 'Dragged out';
        //     },
        //     ondrop: (e) => {
        //         e.relatedTarget.textContent = 'Dropped';
        //     },
        //     ondropdeactivate: (e) => {
        //         e.target.classList.remove('drop-active');
        //         e.target.classList.remove('drop-target');
        //     }
        // });

        interact(`#${newToolID}`).draggable({
            inertia: true,
            autoScroll: true,
            listeners: {
                start(e) {
                    e.target.textContent = "Drag me"
                    // console.log(`#Beam_${beamID}`)
                },
                move: dragMoveListener,
                //         end(e) {
                //             const target = e.target;
                //             const beamrect = document.querySelector(`#Beam_${beamID}`).getBoundingClientRect()
                //             const rect = target.getBoundingClientRect();
                //             console.log("dfdfdfdf")
                //             const relativeX = e.clientX - rect.left;
                //             const x = (parseFloat(target.getAttribute('data-x')) || 0) + e.dx;
                //             const y = (parseFloat(target.getAttribute('data-y')) || 0) + e.dy;

                //             // Update the element's position
                // target.style.transform = `translate(${x}px)`;

                //         }
                // move(e) {
                //     const sliderRect = interact.getElementRect(e.target);
                //     console.log(e)
                //     const barWidth = ToolWidth;
                //     position.x += parseFloat(e.dx.toFixed(3))
                //     position.x = Math.min(barWidth - sliderRect.width / 2, position.x)
                //     position.x = Math.max(- sliderRect.width / 2, position.x)
                //     e.target.style.left = `${500}px`
                //     console.log("positionOnBeam", (position.x + sliderRect.width / 2).toFixed(3))
                //     // sliderObj.positionOnBeam = (position.x + sliderRect.width / 2).toFixed(3) * scale
                //     // seePositionSpan.innerHTML = sliderObj.positionOnBeam;
                //     // setPositionInput.value = sliderObj.positionOnBeam;
                // },
            }
        })
    }, []);

    return (
        <div>
            {children}
        </div>
    );
};

export default Draggable1;
