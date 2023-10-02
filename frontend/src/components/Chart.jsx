// Makes Charts with chart.js

import React, { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import 'chart.js/auto';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';

export const MyCharts = ({beamID,plot,actualBeamLength,unit,loadUnit}) => {
    const [deformation, setDeformation] = useState(true)
    const [sfd, setSFD] = useState(false)
    const [bmd, setBMD] = useState(false)
    const [activeTab, setActiveTab] = useState('link-0');
    const [changedLengthUnit, setchangeLengthUnitTo] = useState("mm");
    const [lengthFactor, setLengthFactor] = useState(0.001);
    const [loadFactor, setLoadFactor] = useState(1);
    const [changedLoadUnit, setchangeLoadUnitTo] = useState(loadUnit);

    const changeUnit=(label)=>{
      const loadeq=loadUnitConversion(loadUnit)
      const lengtheq=lengthUnitConversion(unit)
      console.log("Diagram",label)
      console.log("loadeq",loadeq)
      console.log("loadFactor",loadFactor)
      console.log("lengtheq",lengtheq)
      console.log("lengthFactor",lengthFactor)
      let finalConversionFactor=label==="Elastic"?lengtheq/lengthFactor:label==="Bending"?(lengtheq/lengthFactor)*(loadeq/loadFactor):loadeq/ loadFactor
      console.log("finalConversionFactor",finalConversionFactor)
      return finalConversionFactor
    }

    if (plot === null) {
      return (<div className='my-3 text-danger'> Error! Plot  could not be created</div>)
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
  <div className='card my-4' >
    <Navbar className="bg-body-tertiary tohide"  >
      <Nav variant="underline" activeKey={activeTab} onSelect={handleNavSelect} className='ms-4 my-1'style={{width:actualBeamLength<300?"300px":null, fontSize:"12px"}}>
        <Nav.Item>
          <Nav.Link eventKey="link-0">Elastic Curve</Nav.Link>
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
<div className='d-flex flex-column '>
<div className='d-flex justify-content-between'>
  <div className='fs-3 ms-2 printable'>
  <strong>Charts</strong>
  </div>
  <div className='d-flex align-items-end justify-content-center'>

    <Form.Label htmlFor={`change-unit-of-length-${beamID}`} style={{width:"60px"}}>Units:</Form.Label>
    <Form.Select style={{ maxWidth: "70px"}} aria-label="Change unit of length" id={`change-unit-of-length-${beamID}`}
    onChange={(e) => {
      setchangeLengthUnitTo(e.target.value)
      setLengthFactor(lengthUnitConversion(e.target.value))
    } }>
      <option style={{backgroundColor:"DimGray", color:"white"}}>{changedLengthUnit}</option>
      <option value="mm">mm</option>
      <option value="cm">cm</option>
      <option value="m">m</option>
      <option value="ft">ft</option>
      <option value="in">in</option>
    </Form.Select>
  
    <Form.Select style={{ maxWidth: "70px"}} aria-label="Change unit of load" id={`change-unit-of-load-${beamID}`}
    onChange={(e) => {
      setchangeLoadUnitTo(e.target.value)
      setLoadFactor(loadUnitConversion(e.target.value))
    } }>
      <option style={{backgroundColor:"DimGray", color:"white"}}>{changedLoadUnit}</option>
      <option value="kN">kN</option>
      <option value="N">N</option>
      <option value="lbf">lbf</option>
    </Form.Select>
  </div>
</div>
<div className='d-flex flex-column align-items-center' id={`curves-${beamID}`}>

            {deformation && <MyChart beamlengthUnit={unit} lengthUnit={changedLengthUnit} loadUnit={changedLoadUnit} x0={x_original} y0={y_original} y={y_deformationplot} plot={plot} actualBeamLength={actualBeamLength} label="Elastic Curve" factor={changeUnit("Elastic")}/>}
            {sfd && <MyChart beamlengthUnit={unit} lengthUnit={changedLengthUnit} loadUnit={changedLoadUnit} x0={x_original} y0={y_original} y={y_shearForce} plot={plot} actualBeamLength={actualBeamLength} label="Shear Force Diagram" factor={changeUnit("Shear")}/>}
            {bmd && <MyChart beamlengthUnit={unit} lengthUnit={changedLengthUnit} loadUnit={changedLoadUnit} x0={x_original} y0={y_original} y={y_bendingMoment} plot={plot} actualBeamLength={actualBeamLength} label="Bending Moment Diagram" factor={changeUnit("Bending")}/>}
</div>
</div>
        </div>
    );
};
export const MyChart = ({ plot, x0,y0,y,label,actualBeamLength,beamlengthUnit,lengthUnit,loadUnit,factor}) => {
  
  console.log("PLOTS",{"x-axis":x0,"y-axis":y})
  const changeUnit=(arr)=>{
    return arr.map((num) => num * factor);
  }
  
  
  const multiplyByNegativeOne = (arr) => {
    return arr.map((num) => num * -1);
  };
  
  const x_data = x0
  const y_original = y0
  const y_data =  changeUnit(y)   
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
                    data: label==="Elastic Curve"?(y_data):multiplyByNegativeOne(y_data),
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
          text: 'Length of Beam → '+beamlengthUnit, // Your y-axis title
          fontSize: 16, // Adjust font size as needed
        },
      },
      y: {
        ticks: {
          beginAtZero: true,
          callback: function(value) {
            return label==="Bending Moment Diagram"||label==="Elastic Curve"?-value:value; // Invert the sign of the y-axis values for BMD
          }
        },
        title: {
          display: true,
          text: (label==="Elastic Curve"?"Deformation":title)+' in '+(label==="Bending Moment Diagram"?loadUnit+"."+lengthUnit:label==="Shear Force Diagram"?loadUnit:lengthUnit)+' →', // Your y-axis title
          fontSize: 16, // Adjust font size as needed
        },
      }
    },
    plugins: {
      title: {
        display: true,
        text: label
      }
    }
    };
    
       
    const [chartData, setChartData] = useState(createChart());

    useEffect(() => {
        updateChart()
    }, [plot,factor]);

    const updateChart = () => {
        setChartData(createChart())
    };

    return (
          <div className='mt-1 card' style={{ width:actualBeamLength+'px', minHeight:actualBeamLength<400?"250px":"400px"}}>
            
        <Scatter  data={chartData} options={options} />
          </div> 
    );
};

const lengthUnitConversion=(value)=>{
  let factor=1
  switch (value) {
    case "mm":
      factor=0.001
      break;
    case "cm":
      factor=0.01
      break;
    case "ft":
      factor=0.3048
      break;
    case "in":
      factor=0.0254
      break;
    default:
      factor=1
      break;
  }
  return factor
}
const loadUnitConversion=(value)=>{
  let factor=1
      switch (value) {
        case "N":
          factor=0.001
          break;
        case "lbf":
          factor=0.004448
          break;
        default:
          factor=1
          break;
      }
  return factor
}