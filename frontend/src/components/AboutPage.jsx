// Welcome Modal

import React from "react";
import Modal from "react-bootstrap/Modal";

const About = () => {
  return (
    <>
      <>
        <h1 id="beam-calculator-app">Beam App</h1>
        <p>
          <strong>Table of Contents</strong>
        </p>
        <ul>
          <li>
            <a href="#introduction">Introduction</a>
            <ul>
              <li>
                <a href="#inspiration">Inspiration</a>
              </li>
              <li>
                <a href="#how-does-this-entire-web-app-work">
                  How does this entire web app work?
                </a>
              </li>
            </ul>
          </li>
              <li>
                <a href="#features">Features</a>
              </li>
          <li>
            <a href="#additional-information">Additional Information</a>
          </li>
          <li>
            <a href="#contacts">Contacts</a>
          </li>
        </ul>
        <h2 id="introduction">Introduction</h2>
        <ul>
          <li>
            <p>
              Purpose: The application is designed for modeling and analyzing
              beam structures.
            </p>
          </li>
          <li>
            <p>
              Analysis Method: It employs the finite element method for
              structural analysis. This method involves dividing the beam into
              several finite elements.
            </p>
            <ul>
              <li>
                <p>
                  Element Division: The beam is divided into finite elements
                  such that their maximum length is set to 0.05 times the total
                  length of the beam. 
                </p>
              </li>
              <li>
                <p>
                  Degrees of Freedom: Each nodes of beam element is considered
                  to have two degrees of freedom. These are described as:
                </p>
                <ul>
                  <li>
                    Rotation about the normal to the plane of the model (RZ).
                  </li>
                  <li>Translation in the vertical direction (UY).</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
        <p>
          It was developed as a final project for CS50W, using React as frontend
          Javascript library, Django as backend Python framework and NumPy for
          calculation. Frontend sends data of a beam model to the backend via an
          HTTP request, and there is a Django model for handling the read and
          write operations of beam data in the database. Click{" "}
          <a href="#features">here</a> to learn about features.
        </p>
        <ul>
          <li>
            Demo video (CS50W Submission):{" "}
            <a target="_blank" href="https://youtu.be/q1yYABC7Nis">
              https://youtu.be/q1yYABC7Nis
            </a>
          </li>
        </ul>
        <h2 id="inspiration">Inspiration</h2>
        <p>
          I, as a recent civil engineering graduate, wanted my CS50W final project to be related to civil
          enginnering itself. I googled and found that the existing beam apps on
          the internet were not very fun to use, they needed more interactivity.
          And thus, I began my journey by learning React and NumPy.
        </p>
        <h2 id="how-does-this-entire-web-app-work">
          How does this entire web app work?
        </h2>
        <p>
          The flowchart below shows integaration of different components of the
          web app.
        </p>
        <ul>
          <li>
            <img src="img/flowchart.svg" alt="flowchart" />
          </li>
        </ul>

        <h2 id="features">
Features        
</h2>
        <p>
          The Beam Calculator App stands out due to its combination of
          interactive modeling thanks to <strong>React</strong>, a javascript
          library and analysis of modelled beam in{" "}
          <strong>Django backend</strong> by{" "}
          <strong>Finite Element Method</strong> with the use of NumPy, a python
          library. Features like onboarding guide, save, load and print are plus
          points to this web project. The web app is{" "}
          <strong>mobile responsive</strong> as well. The distinctiveness are
          mentioned below:
        </p>
        <ul>
          <li>
            <p>
              <strong>Interactive Beam Modeling:</strong>
            </p>
            <ul>
              <li>
                <p>
                  Users can create their beam model by dragging and dropping
                  elements like loads and supports onto the beam.
                </p>
              </li>
              <li>
                <p>
                  The position of loads and supports can be changed by simply
                  dragging them along the beam or changed manually.
                </p>
              </li>
               

                <img style={{maxWidth:"100%"}}src="img/demo.gif" alt="Demo" />
             
              <li>
                Distributed load changes its image when its loads are changed.
                User can also change colour of distributed load.
              </li>
                <img  style={{maxWidth:"100%"}} src="img/colourChange.gif" alt="Distributed load changes its image when its loads are changed." />
            </ul>
            
          </li>
          <li>
            <p>
              <strong>
                Finite Element Analysis with Numpy And Visualization:
              </strong>{" "}
              Calculations done on backend are depicted as charts (Deformation
              Curve, Shear Force Diagram and Bending Moment Diagram) on
              Front-end for effective visualization.
            </p>
                <img  style={{maxWidth:"90vw"}} src="img/charts.gif" alt="Data Visualization" />
         
          </li>
          <li>
            <p>
              <strong>Onboarding guide with intro.js:</strong> Users are
              provided with onboarding guide option via welcome modal as well as
              a button on top section of the web app. The guide gives the tour
              of the most important features of this app so as to make users
              even more familiar when navigating.
            </p>
                <img style={{maxWidth:"90vw"}} src="img/onboarding.gif" alt="Onboarding" />
        
          </li>
          <li>
            <p>
              <strong>Working with Multiple beams:</strong> Users can{" "}
              <strong>work with multiple beams</strong> on a single app
              independently. This opens up possibility of comparing different
              beams.
            </p>
          </li>
          <li>
            <p>
              <strong>Print:</strong> Users can print the beam with its
              information and charts.
            </p>
          </li>
          <li>
            <p>
              <strong>Save, Share and Delete:</strong> Users can save their beam
              models and analysis for future reference. The application also
              allows users to share them with colleagues or peers easily. User
              can delete beams from database by logging in as admin in django
              server.
            </p>
          </li>
          <li>
            <p>
              <strong>Other features:</strong>The application allows users to
              specify units, beam length, and Young's Modulus to suit the
              material properties of their beams. Users can choose beam section
              from preset for automatic calculation of Moment of Inertia or
              specify the custom value.
            </p>
          </li>
        </ul>
  
      
        <h2 id="additional-information">Additional Information</h2>
            <p>
              For optimal printing, it may be necessary to adjust the dimensions
              of the PDF. While testing on desktops using Edge and Chrome, the
              print was satisfactory.
            </p>
         
        <h2 id="contacts">Contacts</h2>
        <p>Any feedback will be highly appreciated.</p>
        <p>
          <a href="mailto:mrajayakhatri@gmail.com" target="blank">
            <img
              align="center"
              src="https://raw.githubusercontent.com/gauravghongde/social-icons/master/SVG/Color/Gmail.svg"
              alt="ajaya-khatri-7b9715254"
              height={30}
              width={40}
            />
            mrajayakhatri@gmail.com
          </a>
        </p>
        <p>
          <a
            href="https://linkedin.com/in/ajaya-khatri-7b9715254"
            target="blank"
          >
            <img
              align="center"
              src="https://raw.githubusercontent.com/gauravghongde/social-icons/master/SVG/Color/LinkedIN.svg"
              alt="ajaya-khatri-7b9715254"
              height={30}
              width={40}
            />
            ajayakhatri
          </a>
        </p>
      </>
    </>
  );
};

export const AboutPage = ({ showAboutPage, setShowAboutPage }) => {
  return (
    <>
      <Modal
        show={showAboutPage}
        fullscreen={true}
        onHide={() => setShowAboutPage(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Beam App</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <About />
        </Modal.Body>
      </Modal>
    </>
  );
};
