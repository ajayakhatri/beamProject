import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import Beam from './components/Beam';
function App() {
  return (
    <div>
  <div className="header">
  <h1 style={{ fontSize: "30px",lineHeight:"5px" }}>Beams </h1>
<span style={{fontSize:"12px"}}> beam.ajayakhatri.com.np</span>
  </div> 
      <div className='mt-2 d-flex justify-content-center'>
        <Beam />
      </div>
    
    </div>
  )
}

export default App
