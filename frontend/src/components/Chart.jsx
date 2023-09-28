// Makes Charts with chart.js

import React, { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import 'chart.js/auto';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export const MyCharts = ({beamID,plot,actualBeamLength,unit,loadUnit}) => {
    const [deformation, setDeformation] = useState(true)
    const [sfd, setSFD] = useState(false)
    const [bmd, setBMD] = useState(false)

    const [activeTab, setActiveTab] = useState('link-0');

    if (plot === null) {
      return (<div> Error! Plot  couldnot be created</div>)
  }

        let bendingMoment = plot.bendingMoment
        let deformationplot = plot.deformation
        let original = plot.original
        let shearForce = plot.shearForce
        let x_original = original[0]
        let y_original = original[1]
        
        let x_deformationplot = deformationplot[0]
        let y_deformationplot = deformationplot[1]

        let x_shearForce = shearForce[0]
        let y_shearForce = shearForce[1]
    
        let x_bendingMoment = bendingMoment[0]
        let y_bendingMoment = bendingMoment[1]
  
     
     
        const handleNavSelect = (selectedKey) => {
          switch (selectedKey) {
            case 'link-0':
              setDeformation(true);
              setSFD(false);
              setBMD(false);
                break;
                case 'link-1':
                  setDeformation(false);
                  setSFD(true);
                  setBMD(false);
                  break;
                  case 'link-2':
                    setDeformation(false);
                    setSFD(false);
                    setBMD(true);
                    break;
                    case 'show':
                      setDeformation(true);
                      setSFD(true);
                      setBMD(true);
                      break;
                     
                        default:
                          break;
            }
            setActiveTab(selectedKey);
          };
    
    return (
        <div className='card my-4' id={`curves-${beamID}`}>
    <Navbar className="bg-body-tertiary"  >
      <Nav variant="underline" activeKey={activeTab} onSelect={handleNavSelect} className='ms-4 my-1'style={{width:actualBeamLength<300?"300px":null, fontSize:"12px"}}>
        <Nav.Item>
          <Nav.Link eventKey="link-0">Deformation Curve</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-1">Shear Force</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-2">Bending Moment</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="show">Show All</Nav.Link>
        </Nav.Item>
      </Nav>
      </Navbar>

            {deformation && <MyChart unit={unit} loadUnit={loadUnit} x0={x_original} y0={y_original} y={y_deformationplot} plot={plot} actualBeamLength={actualBeamLength} label="Deformation Curve"/>}
            {sfd && <MyChart unit={unit} loadUnit={loadUnit} x0={x_original} y0={y_original} y={y_shearForce} plot={plot} actualBeamLength={actualBeamLength} label="Shear Force Diagram"/>}
            {bmd && <MyChart unit={unit} loadUnit={loadUnit} x0={x_original} y0={y_original} y={y_bendingMoment} plot={plot} actualBeamLength={actualBeamLength} label="Bending Moment Diagram"/>}
    
        </div>
    );
};
export const MyChart = ({ plot, x0,y0,y,label,actualBeamLength,unit,loadUnit}) => {


    const multiplyByNegativeOne = (arr) => {
      return arr.map((num) => num * -1);
    };
    
    const x_data = x0
    const y_original = y0
    const y_data = y   
    var title=label.split(" ")
    title.pop()
    title=title.join(" ")
    const createChart = () => {
        const chartData = {
            labels: x_data,
            datasets: [
           
                {
                    label: 'Original',
                    data: y_original,
                    fill: false,
                    borderColor: 'rgba(75,192,192,1)',
                    showLine: true,
                    tension:0.1
                },
                {
                    label: title,
                    data: label==="Bending Moment Diagram"?multiplyByNegativeOne(y_data):y_data,
                    fill: true,
                    borderColor: 'rgba(192,75,192,1)',
                    showLine: true,
                    tension:0.1
                },
            ],
        };
        return chartData
    };
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      width: actualBeamLength,
     scales:{
      x: {
        title: {
          display: true,
          text: 'Length of Beam →', // Your y-axis title
          fontSize: 16, // Adjust font size as needed
        },
      },
      y: {
        ticks: {
          beginAtZero: true,
          callback: function(value) {
            return label==="Bending Moment Diagram"?-value:value; // Invert the sign of the y-axis values for BMD
          }
        },
        title: {
          display: true,
          text: title+' in '+(label==="Bending Moment Diagram"?loadUnit+"."+unit:label==="Shear Force Diagram"?loadUnit:unit)+' →', // Your y-axis title
          fontSize: 16, // Adjust font size as needed
        },
      }
    }
    };
    
   
 
    
    const [chartData, setChartData] = useState(createChart());

    useEffect(() => {
        updateChart()
    }, [plot]);

    const updateChart = () => {
        setChartData(createChart())
    };

    return (
        <div className='mt-3'>
          <div style={{ width:actualBeamLength+'px', minHeight:"250px"}}>
        <Scatter  data={chartData} options={options} />
          </div>
        <div className='text-center m-4'><strong>fig: </strong>{label}</div>            
        </div>
    );
};

