import React, { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import 'chart.js/auto';
import Nav from 'react-bootstrap/Nav';



export const MyCharts = ({ plot}) => {
    const [deformation, setDeformation] = useState(false)
    const [sfd, setSFD] = useState(false)
    const [bmd, setBMD] = useState(false)

    if (plot === null) {
        return (<div> ss</div>)
    }

  
        let bendingMoment = plot.bendingMoment
        let deformationplot = plot.deformation
        let original = plot.original
        let shearForce = plot.shearForce

        let x_original = Object.keys(original).map(parseFloat);
        let y_original = Object.values(original).map(parseFloat);
        
        let x_deformationplot = Object.keys(deformationplot).map(parseFloat);
        let y_deformationplot = Object.values(deformationplot).map(parseFloat);

        let x_shearForce = Object.keys(shearForce).map(parseFloat);
        let y_shearForce = Object.values(shearForce).map(parseFloat);

        let x_bendingMoment = Object.keys(bendingMoment).map(parseFloat);
        let y_bendingMoment = Object.values(bendingMoment).map(parseFloat);

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
          };

    return (
        <div className='mt-4'>
        
      <Nav variant="pills" defaultActiveKey="show" onSelect={handleNavSelect} >
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

            {deformation && <MyChart x0={x_original} y0={y_original} y={y_deformationplot} plot={plot} label="Deformation Curve"/>}
            {sfd && <MyChart x0={x_original} y0={y_original} y={y_shearForce} plot={plot} label="Shear Force Diagram"/>}
            {bmd && <MyChart x0={x_original} y0={y_original} y={y_bendingMoment} plot={plot} label="Bending Moment Diagram"/>}
          
        </div>
    );
};
export const MyChart = ({ plot, x0,y0,y,label}) => {

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
                    tension: 0.1,
                    showLine: true
                },
                {
                    label: title,
                    data: y_bendingMoment,
                    fill: true,
                    borderColor: 'rgba(192,75,192,1)',
                    tension: 0.1,
                    showLine: true
                },
            ],
        };
        return chartData
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
        <Scatter data={chartData}  />
        <div className='text-center mt-2'><strong>fig: </strong>{label}</div>            
        </div>
    );
};

