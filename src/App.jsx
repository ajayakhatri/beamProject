import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import Beam from './components/Beam';
import './components/consoleOverride.js.js';
import { MyChart } from './components/chart';

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
