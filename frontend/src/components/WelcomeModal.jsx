// Welcome Modal

import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function WelcomePage(props) {
    return (
      <div>
        <h1 className='text-center'>Welcome to the Beam Calculator App</h1>
        
        <h2 className='text-center'><small>A Tool for Beam Analysis</small>
        </h2>
        <p className='text-center my-5'>
        <Button style={{fontSize:"30px"}} onClick={()=>{props.onHide(),props.startOnboarding()}}>Take Tour of the App !!</Button>
        </p>
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

