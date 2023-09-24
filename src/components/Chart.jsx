import React, { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import 'chart.js/auto';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export const MyCharts = ({ plot,actualBeamLength}) => {
    const [deformation, setDeformation] = useState(false)
    const [sfd, setSFD] = useState(false)
    const [bmd, setBMD] = useState(false)

    const [activeTab, setActiveTab] = useState('hide');

    if (plot === null) {
        return (<div> ss</div>)
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
                      case 'hide':
                        setDeformation(false);
                        setSFD(false);
                        setBMD(false);
                        break;
                        default:
                          break;
            }
            setActiveTab(selectedKey);
          };
    
    return (
        <div className='card my-4' id="curves">
    <Navbar className="bg-body-tertiary" >
      <Nav variant="underline" activeKey={activeTab} onSelect={handleNavSelect} className='ms-4 my-1'>
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
        <Nav.Item>
          <Nav.Link eventKey="hide">Hide Figures</Nav.Link>
        </Nav.Item>
      </Nav>
      </Navbar>

            {deformation && <MyChart x0={x_original} y0={y_original} y={y_deformationplot} plot={plot} actualBeamLength={actualBeamLength} label="Deformation Curve"/>}
            {sfd && <MyChart x0={x_original} y0={y_original} y={y_shearForce} plot={plot} actualBeamLength={actualBeamLength} label="Shear Force Diagram"/>}
            {bmd && <MyChart x0={x_original} y0={y_original} y={y_bendingMoment} plot={plot} actualBeamLength={actualBeamLength} label="Bending Moment Diagram"/>}
    
        </div>
    );
};
export const MyChart = ({ plot, x0,y0,y,label,actualBeamLength}) => {

    if (plot === null) {
        return (<div> ss</div>)
    }

    const createChart = () => {
        const x_bendingMoment = x0
        const y_original = y0
        const y_bendingMoment = y
        var title=label.split(" ")
        title.pop()
        title=title.join(" ")
        const chartData = {
            labels: x_bendingMoment,
            datasets: [
                {
                    label: 'Original',
                    data: y_original,
                    fill: false,
                    borderColor: 'rgba(75,192,192,1)',
                    showLine: true
                },
                {
                    label: title,
                    data: y_bendingMoment,
                    fill: true,
                    borderColor: 'rgba(192,75,192,1)',
                    showLine: true
                },
            ],
        };
        return chartData
    };
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      width: actualBeamLength,
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
          <div  style={{ minWidth: actualBeamLength+'px', minHeight:"200px"}}>
        <Scatter  data={chartData} options={options} />
          </div>
        <div className='text-center m-4'><strong>fig: </strong>{label}</div>            
        </div>
    );
};

