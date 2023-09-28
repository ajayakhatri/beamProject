import React from 'react';
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import { WelcomeModal } from './WelcomeModal';
function OnBoarding({modalShow,setModalShow}) {
 
    
   const options={ 
    showProgress: true,
    steps:[
    {
    element: "#tour-beam",
    intro: "This is the beam where you work on",
    },
    {
        element: "#tour-draggable",
        intro: "You can Drag and Drop these on the beam to add them.",
        position: "left",
    },
    {
        element: "#tour-fixedEnds",
        intro: "Click these to toggle fixed ends supports",
        position: "left",
    },
    {
        element: "#tour-beamInfo",
        intro: "You can change units, beam section, dimensions, Youngs Modulus and Moment of Intertia",
    },
    {
        element: "#tour-beamLength",
        intro: "Click on this length to unhide input for beam length",
    },
    {
        element: ".tour-svg",
        intro: `<ul><li>You can change position by dragging or click on the loads to unhide input for manual change. Click the loads again to hide the input.</li>
        <li>Hold the images to unhide option to delete them. You can also change colour of distributed loads.</li>
        </ul>`,
        position: "bottom",
    },
    {
        element: ".inputPointer",
        intro: "Click on the loads to change them",
    },
    {
        element: '.tour-inputSpan',
        intro: 'Click on the spans of distributed load to change them',
    },
    {
        element: "#tour-toggle",
        intro: "You can toggle these as your desire",
        position:"left"
    },
    {
        element: "#tour-diagramAndDelete",
        intro:  `<ul><li>If the support conditions are valid then you can see the analysis digrams. You can also delete this entire beam.</li>
        <li>You can save the beam, it will give you a reference number which you can share with others</li>
        </ul>`,
        position:"top"
    },
    {
        element: "#tour-loadBeam",
        intro: "Use the reference number to load saved beams.",
        position:"top"
    },
  
  ]}
  const intro = introJs();
  intro.setOptions(options)

  const startOnboarding = () => {
      const timer = setTimeout(() => {
          intro.start()
      }, 500);
};

  return (
    <>
    <WelcomeModal modalShow={modalShow} setModalShow={setModalShow} startOnboarding={startOnboarding}/>
        <button  className='btn btn-outline-primary' style={{fontWeight:"bold",height:"30px",width:"100px", borderRadius:"10px",boxShadow:"#422800 4px 4px 0 0"}} onClick={startOnboarding}>Take a Tour</button>
    </>
  );
}

export default OnBoarding;

