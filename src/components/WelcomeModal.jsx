import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function WelcomePage(props) {
 

    return (
      <div>
        <h1 className='text-center'>Welcome to the Beam Calculator App</h1>
        
        <h2 className='text-center'><small>Tool for Beam Analysis</small>
        </h2>
        <p className='text-center my-5'>
        <Button style={{fontSize:"30px"}} onClick={()=>{props.onHide(),props.startOnboarding()}}>Take Tour of the App !!</Button>
        </p>
        <p>
          Beam Calculator App is here to assist you in analyzing and understanding the behavior of beams with ease.
        </p>

        
        <h3><small>Key Features:</small></h3>
        <ul>
          <li>
            <strong>Interactive Beam Modeling:</strong>
            <ul>
              <li>Easily create your beam model by dragging and dropping loads and supports onto the beam.</li>
              <li>Change the length of loads and supports by simply dragging them along the beam.</li>
              <li>Specify load units, beam length, and beam dimension units to match your specific requirements.</li>
            </ul>
          </li>
          
      
          
          <li>
            <strong>Comprehensive Analysis:</strong>
            <ul>
              <li>Explore how the beam deforms under different loads with the Deformation Curve.</li>
              <li>Visualize how shear forces vary along the length of your beam with the Shear Force Diagram (SFD).</li>
              <li>Understand the distribution of bending moments within the beam using the Bending Moment Diagram (BMD).</li>
            </ul>
          </li>
          <li>
            <strong>Automatic Moment of Inertia Calculation:</strong>
            <ul>
              <li>Select the beam section type (rectangular, solid circular, or custom) and let the app calculate the Moment of Inertia (MOI) for you.</li>
              <li>Input your custom Moment of Inertia if needed.</li>
              <li>Specify the Young's Modulus to suit the material properties of your beam.</li>
            </ul>
          </li>
          <li>
            <strong>Save and Share:</strong>
            <ul>
              <li>Save your beam models and analysis for future reference.</li>
              <li>Share your analysis results with colleagues or peers easily.</li>
            </ul>
          </li>
         
          
        </ul>
           
      </div>
    );
  }
function MyVerticallyCenteredModal(props) {

    
    const { startOnboarding,dontshowagain, ...restProps } = props;

  return (
    <Modal
      {...restProps}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      scrollable
    >
      <Modal.Body  >
       <WelcomePage onHide={props.onHide} startOnboarding={props.startOnboarding}/>
      </Modal.Body>
      <Modal.Footer className='justify-content-between'>
        <button onClick={()=>props.dontshowagain()} className='btn btn-dark'>{!(localStorage.getItem('modalShow') === 'false' ? false : true)?"":"Don't "}Show Again On Reopening Application</button>
        <button onClick={()=>props.onHide()} className='btn btn-dark'>Get Started!!</button>
      </Modal.Footer>
   
    </Modal>
  );
}

export const WelcomeModal=({startOnboarding,modalShow,setModalShow})=> {
  const toggleModal = () => {
    setModalShow(false);
    localStorage.setItem('modalShow', !(localStorage.getItem('modalShow') === 'false' ? false : true));
    console.log("localStorage.getItem('modalShow')",!(localStorage.getItem('modalShow') === 'false' ? false : true))
  }; 
  


  return ( 
 <div className='d-flex align-items-center'>
 
    <MyVerticallyCenteredModal
    style={{maxHeight:"90%"}}
    startOnboarding={startOnboarding}
    show={modalShow}
    dontshowagain={toggleModal}
    onHide={()=>setModalShow(false)}
    />

    </div>
  );
}

