// Welcome Modal

import React from "react";
import Modal from "react-bootstrap/Modal";

const About = () => {
  return (
    <>
      <>
        <h1 id="beam-calculator-app">Beam Calculator App</h1>
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
            <a href="#distinctiveness-and-complexity">
              Distinctiveness and Complexity
            </a>
            <ul>
              <li>
                <a href="#distinctiveness">Distinctiveness</a>
              </li>
              <li>
                <a href="#complexity">Complexity</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="#whats-contained-in-each-file">
              What’s contained in each file?
            </a>
            <ul>
              <li>
                <a href="#back-end-file-structure">Back-end File Structure</a>
              </li>
              <li>
                <a href="#front-end-file-structure">Front-end File Structure</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="#additional-information">Additional Information</a>
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
                  length of the beam. This factor of 0.05 can be easily modified
                  in the views.py file.
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
          <a href="#distinctiveness">here</a> to learn about features.
        </p>
        <ul>
          <li>
            Demo video:{" "}
            <a target="_blank" href="https://youtu.be/q1yYABC7Nis">
              https://youtu.be/q1yYABC7Nis
            </a>
          </li>
        </ul>
        <h2 id="inspiration">Inspiration</h2>
        <p>
          I, as a recent civil engineering graduate, always had the affinity for
          structural analysis and wanted my CS50W final project to be related to
          enginnering itself. I googled and found that the existing beam apps on
          the internet were not very fun to use, they need more interactivity.
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

        <h2 id="distinctiveness-and-complexity">
          Distinctiveness and Complexity
        </h2>
        <h3 id="distinctiveness">Distinctiveness</h3>
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
              <li>
                <img src="img/demo.gif" alt="Demo" />
              </li>
              <li>
                Distributed load changes its image when its loads are changed.
                User can also change colour of distributed load.
              </li>
              <li>
                <img src="img/colourChange.gif" alt="Demo" />
              </li>
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
            <ul>
              <li>
                <img src="img/charts.gif" alt="Data Visualization" />
              </li>
            </ul>
          </li>
          <li>
            <p>
              <strong>Onboarding guide with intro.js:</strong> Users are
              provided with onboarding guide option via welcome modal as well as
              a button on top section of the web app. The guide gives the tour
              of the most important features of this app so as to make users
              even more familiar when navigating.
            </p>
            <ul>
              <li>
                <img src="img/onboarding.gif" alt="Onboarding" />
              </li>
            </ul>
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
        <h3 id="complexity">Complexity</h3>
        <p>
          The project's complexity is evident in its use of multiple
          technologies and the integration of various components. Besides the
          integration part what I found the most complex in the projects were:
        </p>
        <ol>
          <li>
            Logic for changing svg images dynamically based on value of loads on
            either ends(done in frontend/src/components/Img.jsx).
          </li>
          <li>
            Logic for arranging data from frontend into NumPy arrays and
            converting distributed load into many finite elements (done in
            backend/api/arrangeData.py).
          </li>
          <li>
            Logic for passing latest state of beam in different React
            components.
          </li>
        </ol>
        <p>
          Different libraries and packages used in the app along with their
          usage are:
        </p>
        <ul>
          <li>
            <p>Python Packages</p>
            <ol>
              <li>
                <p>
                  <strong>NumPy :</strong> It was used to make arrays of load,
                  support condition, nodes and beam elements for mathematical
                  operations related for Finite Element Analysis. Before feeding
                  the
                </p>
              </li>
              <li>
                <p>
                  <strong>djangorestframework :</strong> The api_view decorator
                  was used in Django REST framework to define API views. Example
                  : <code>@api_view(["GET"])</code>
                </p>
              </li>
              <li>
                <p>
                  <strong>django-cors-headers :</strong> Django CORS Headers is
                  a package for handling Cross-Origin Resource Sharing (CORS) in
                  Django applications
                </p>
              </li>
            </ol>
          </li>
          <li>
            <p>Dependencies in Front-end</p>
            <ol>
              <li>
                <p>
                  <strong>axios:</strong> It provides a simple API for
                  performing HTTP requests and processing responses.
                </p>
              </li>
              <li>
                <p>
                  <strong>chart.js:</strong> As its name suggest it was used to
                  plot charts of <strong>Deformation</strong>,{" "}
                  <strong>Shear Force</strong> and{" "}
                  <strong>Bending Moment</strong>.
                </p>
              </li>
              <li>
                <p>
                  <strong>react-chartjs-2:</strong> A React wrapper for
                  Chart.js.
                </p>
              </li>
              <li>
                <p>
                  <strong>immer:</strong> A package that was used to work with
                  immutable state in a more convenient way.
                </p>
              </li>
              <li>
                <p>
                  <strong>interactjs:</strong> A JavaScript library used for
                  drag and drop features.
                </p>
              </li>
              <li>
                <p>
                  <strong>intro.js:</strong> A library used for{" "}
                  <strong>onboarding guide</strong>.
                </p>
              </li>
              <li>
                <p>
                  <strong>intro.js-react:</strong> A React wrapper for intro.js.
                </p>
              </li>
              <li>
                <p>
                  <strong>react-bootstrap:</strong> A library that combines
                  Bootstrap with React. It allows developers to use Bootstrap's
                  components and styles, but with React's syntax.
                </p>
              </li>
              <li>
                <p>
                  <strong>bootstrap:</strong> A popular CSS framework used for
                  pre-designed styles and components to build responsive,
                  mobile-first web app.
                </p>
              </li>
              <li>
                <p>
                  <strong>react:</strong> A JavaScript library for building user
                  interfaces, primarily for single-page applications.
                </p>
              </li>
              <li>
                <p>
                  <strong>react-dom:</strong> A package that provides
                  DOM-specific methods that can be used at the top level of a
                  web app to enable an efficient way of managing DOM elements of
                  the web page.
                </p>
              </li>
              <li>
                <p>
                  <strong>concurrently:</strong> A utility that manages multiple
                  concurrent tasks. In this case, it was used to run both react
                  and django using a single command <code>npm run start</code>{" "}
                  in script of <strong>package.json</strong>.
                </p>
                <pre>
                  <code className="lang-json">
                    // <span className="hljs-keyword">in</span>{" "}
                    <span className="hljs-keyword">package</span>.json{"\n"}
                    {"  "}
                    <span className="hljs-string">"start"</span>:{" "}
                    <span className="hljs-string">"concurrently \"</span>cd
                    ../backend &amp;&amp; python manage.py runserver\
                    <span className="hljs-string">" \"</span>vite\
                    <span className="hljs-string">""</span>,{"\n"}
                  </code>
                </pre>
              </li>
            </ol>
          </li>
        </ul>
        <h2 id="whats-contained-in-each-file">
          What’s contained in each file?
        </h2>
        <p>
          Files in both back-end and front-end along with their information are
          given below:
        </p>
        <h3 id="back-end-file-structure">Back-end File Structure</h3>
        <p>Inside back-end folder :</p>
        <pre>
          <code>
            backend{"\n"}├── api/{"               "}# Django API app directory
            {"\n"}│{"   "}├── __pycache__/{"   "}# Cached Python files{"\n"}│
            {"   "}├── migrations/{"    "}# Database migrations{"\n"}│{"   "}├──
            __init__.py
            {"    "}# Initialization script for the{" "}
            <span className="hljs-string">'api'</span> app{"\n"}│{"   "}├──
            admin.py
            {"       "}# Django admin configuration{"\n"}│{"   "}├── apps.py
            {"        "}# Configuration for the{" "}
            <span className="hljs-string">'api'</span> app{"\n"}│{"   "}├──
            arrangeData.py # Function to arrange data{" "}
            <span className="hljs-keyword">from</span> frontend into NumPy
            arrays
            {"\n"}│{"   "}├── beamApp.py{"     "}# Contains beam{" "}
            <span className="hljs-keyword">class</span> to handle calculations
            {"\n"}│{"   "}├── models.py{"      "}# Database models{" "}
            <span className="hljs-keyword">definition</span>
            {"\n"}│{"   "}├── urls.py{"        "}# URL routing configuration
            {"\n"}│{"   "}└── views.py{"       "}# View functions for the{" "}
            <span className="hljs-string">'api'</span> app{"\n"}├── beam/
            {"              "}# Django project settings{"\n"}│{"   "}├──
            __pycache__/
            {"   "}# Cached Python files{"\n"}│{"   "}├── __init__.py{"    "}#
            Initialization script for the{" "}
            <span className="hljs-string">'beam'</span> project{"\n"}│{"   "}├──
            asgi.py{"        "}# ASGI configuration{"\n"}│{"   "}├── settings.py
            {"    "}# Django project settings{"\n"}│{"   "}├── urls.py
            {"        "}# Top-level URL routing configuration{"\n"}│{"   "}└──
            wsgi.py{"        "}# WSGI configuration{"\n"}├── db.sqlite3
            {"         "}# SQLite database file{"\n"}├── manage.py{"          "}
            # Django management script{"\n"}└── requirements.txt{"   "}# Python
            package dependencies{"\n"}
          </code>
        </pre>
        <h3 id="front-end-file-structure">Front-end File Structure</h3>
        <p>Inside front-end folder :</p>
        <pre>
          <code>
            frontend{"\n"}├── public/{"                       "}# Contains
            images for README.md and About page{"\n"}├── src/
            {"                          "}# Source{" "}
            <span className="hljs-keyword">code</span> directory{"\n"}│{"   "}
            ├── components/{"\n"}│{"   "}│{"   "}├── Beam.jsx{"              "}#
            Renders all beam and contains functions for making changes{"\n"}│
            {"   "}│{"   "}
            ├── BeamInfo.jsx{"          "}# Contains input for beam properties
            {"\n"}│{"   "}│{"   "}├── Chart.jsx{"             "}# Makes charts
            {"\n"}│{"   "}│{"   "}├── CopyButton.jsx{"        "}# Copies saved
            beam no. to clipboard
            {"\n"}│{"   "}│{"   "}├── DndStage1.jsx{"         "}# Handles
            dropping <span className="hljs-keyword">of</span> elements on beam
            {"\n"}│{"   "}│{"   "}├── DndStage2.jsx{"         "}# Handles
            dragging <span className="hljs-keyword">of</span> elements on beam
            {"\n"}│{"   "}│{"   "}├── FixedEnds.jsx{"         "}# Toggle for
            fixed ends supports
            {"\n"}│{"   "}│{"   "}├── Img.jsx{"               "}# Contains svg
            images <span className="hljs-keyword">of</span> elements{"\n"}│
            {"   "}│{"   "}├── InputBeamLength.jsx{"   "}# Changes length{" "}
            <span className="hljs-keyword">of</span> a beam{"\n"}│{"   "}│
            {"   "}├── LoadBeam.jsx{"          "}# Loads a beam{" "}
            <span className="hljs-keyword">from</span> its reference no.{"\n"}│
            {"   "}│{"   "}├── Message.jsx{"           "}# Displays messages
            dynamically
            {"\n"}│{"   "}│{"   "}├── OnBoarding.jsx{"        "}# Contains Logic
            for onboarding tour{"\n"}│{"   "}│{"   "}├── PositionDimension.jsx #
            Changes position dimensions when there is any change{"\n"}│{"   "}│
            {"   "}├── Print.jsx{"             "}# Prints the beam and charts
            {"\n"}│{"   "}│{"   "}├── SaveBeam.jsx{"          "}# Sends a beam
            to backend to be saved.{"\n"}│{"   "}│{"   "}├── Switch.jsx
            {"            "}# Toggles for length, load and border display{"\n"}│
            {"   "}│{"   "}├── ToolBar.jsx
            {"           "}# Contains toolbox{" "}
            <span className="hljs-keyword">of</span> draggable elements{"\n"}│
            {"   "}│{"   "}├── utility.js{"            "}# Contains fuction for
            random colour and hexToRGBA{"\n"}│{"   "}│{"   "}└──
            WelcomeModal.jsx{"      "}# Lunches Welcome Modal{"\n"}│{"   "}├──
            dataFlow/{"\n"}│{"   "}│{"   "}├── axios.jsx{"             "}# Input
            for baseUrl <span className="hljs-keyword">of</span> backend server
            {"\n"}│{"   "}│{"   "}└── sendDataToBackend.jsx # Sends data to
            backend{"\n"}│{"   "}├── App.css{"                   "}# Contains
            CSS styles{"\n"}│{"   "}├── App.jsx{"                   "}# React
            application entry point
            {"\n"}│{"   "}└── main.jsx{"                  "}# Main JavaScript
            file
            {"\n"}├── .eslintrc.cjs{"                 "}# ESLint configuration
            {"\n"}
            ├── index.html{"                    "}# HTML entry point{"\n"}├──
            package-lock.json{"             "}# Lock file for npm packages{"\n"}
            ├── package.json{"                  "}# npm package dependencies
            {"\n"}└── vite.config.js{"                "}# Configuration for
            Vite.js (build tool)
            {"\n"}
          </code>
        </pre>
        <h2 id="additional-information">Additional Information</h2>
        <ul>
          <li>
            Both default username and password for django admin panel is{" "}
            <strong>admin</strong> at "
            <a href="http://127.0.0.1:8000/admin">
              http://127.0.0.1:8000/admin
            </a>
            "
          </li>
          <li>
            <p>
              If the Django Server is being run on other address from "
              <a href="http://127.0.0.1:8000">http://127.0.0.1:8000</a>" then
              you can update baseURL in axios.jsx file:
            </p>
            <pre>
              <code>
                {" "}
                frontend{"\n"}
                {"  "}└── src/{"\n"}
                {"       "}└── dataFlow/{"\n"}
                {"            "}└── axios.jsx{"\n"}
                {"\n"}
                <span className="hljs-keyword">const</span> API = axios.create(
                {"{"}
                {"\n"}
                {"    "}baseURL:{" "}
                <span className="hljs-string">"http://127.0.0.1:8000"</span>,
                {"\n"}
                {"}"});{"\n"}
              </code>
            </pre>
          </li>
          <li>
            <p>
              The frontend and backend are separated, that means the user can
              change method of analysis in backend to any methods while using
              the beautiful frontend as it is.
            </p>
          </li>
          <li>
            <p>
              For optimal printing, it may be necessary to adjust the dimensions
              of the PDF. While testing on desktops using Edge and Chrome, the
              print was satisfactory.
            </p>
          </li>
        </ul>
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
          <Modal.Title>Beam Calculator App</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <About />
        </Modal.Body>
      </Modal>
    </>
  );
};
