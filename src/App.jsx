import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import Beam from './components copy/Beam';
import './components copy/consoleOverride.js';

function App() {
  return (
    <div>
      <div className='mt-2 d-flex justify-content-center'>
        <Beam />
      </div>
    </div>
  )
}

export default App
