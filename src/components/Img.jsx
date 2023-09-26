import React from 'react'
import { hexToRGBA } from './utility';

export const ImgDistributedLoad = ({ newSpanValue = 50, scale = 1, spacing, loadStart = 5, loadEnd = 5, color = "rgba(242, 135, 42, 0.405)" }) => {
    let newcolor = hexToRGBA(color, 0.7);
    let width = (newSpanValue) / scale + 16
    let w = width - 16
    const a = { "x": 0, "y": Math.abs(loadStart) }
    const b = { "x": w, "y": Math.abs(loadEnd) }
    let fx = (x) => ((b.y - a.y) / (b.x - a.x)) * x + a.y
    let fxNoAbs = (x) => ((loadEnd - loadStart) / (b.x - a.x)) * x + loadStart
    const height = 40
    const h = Math.max(a.y, b.y)
    const arrowSpacing = spacing
    const times = w % arrowSpacing === 0 ? w / arrowSpacing : Math.floor(w / arrowSpacing)
    const space = w / times
    const arrows = []
    for (let i = 0; i <= w; i += space) {
        arrows.push(<Arrow key={i} x={i} opacity={0.5} height={(100 - (fx(i) * 100 / h))} negative={fxNoAbs(i)<0?true:false}/>);
    }

    return (
        <svg transform="translate(-8,-45)" height={height + "px"} width={width} style={{ position: 'absolute' }}>;
            <polygon points={`8,${(height - (fx(0) * height / h))}  ${w + 8},${(height - (fx(w) * height / h))} ${w + 8},400 8,500`} fill={newcolor} />
            {/* <rect x="8" y="0" width={width - 16} height="100%" fill="rgba(242, 135, 42, 0.405)" />; */}
            <line x1="8" y1={a.y > b.y ? 0 : (100 - ((a.y / b.y)) * 100) + "%"} x2={width - 8} y2={a.y < b.y ? 0 : (100 - ((b.y / a.y)) * 100) + "%"} stroke="black" strokeWidth="1" />
            {/* <Arrow x={8} /> */}
            <g transform="translate(8)">
                {arrows}
            </g>
        </svg>

    )
}
export const ImgRollerSupport = () => {
    return (
        <svg transform="scale(1.8)" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2z"></path></svg>
    )
}
export const ImgHingedSupport = () => {
    return (
        <svg transform="scale(1.8)" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767L7.022 1.566z"></path></svg>)
}
export const ImgPointLoad = () => {
    return (
        <svg transform="scale(1) translate(0,-65)" height="60px" style={{ zIndex: "1" }} xmlns="http://www.w3.org/2000/svg" width="16">
            <Arrow x={8} />
        </svg>
    )
}

function Arrow({ x, opacity = 1, height = 0,negative=false}) {
    return (
        <>
            <line x1={x} y1={height+"%"} x2={x} y2="100%" stroke="black" strokeWidth="1" opacity={opacity} />
            {negative?<>
            <line x1={x} y1={height+"%"} x2={x - 2} y2={(height+15)+"%"} stroke="black" strokeWidth="1" opacity={opacity} />
            <line x1={x} y1={height+"%"} x2={x + 2} y2={(height+15)+"%"} stroke="black" strokeWidth="1" opacity={opacity} />
            </>
            :
            <>
            <line x1={x} y1="100%" x2={x - 2} y2="85%" stroke="black" strokeWidth="1" opacity={opacity} />
            <line x1={x} y1="100%" x2={x + 2} y2="85%" stroke="black" strokeWidth="1" opacity={opacity} />
            </>
        }



        </>
    )
}

export const ImgFixedSupportOnBeam=({className})=>{
    return(
<svg  className={className} xmlns="http://www.w3.org/2000/svg" width="14" height="83" viewBox="0 0 14 83" fill="none">
<line x1="13" x2="13" y2="83" stroke="black" strokeWidth="2"/>
<line y1="-1" x2="15.402" y2="-1" transform="matrix(-0.779118 0.626877 -0.600947 -0.799289 12 21)" stroke="black" strokeWidth="2"/>
<line y1="-1" x2="15.402" y2="-1" transform="matrix(-0.779118 0.626877 -0.600947 -0.799289 12 5)" stroke="black" strokeWidth="2"/>
<line y1="-1" x2="15.402" y2="-1" transform="matrix(-0.779118 0.626877 -0.600947 -0.799289 12 29)" stroke="black" strokeWidth="2"/>
<line y1="-1" x2="15.402" y2="-1" transform="matrix(-0.779118 0.626877 -0.600947 -0.799289 12 13)" stroke="black" strokeWidth="2"/>
<line y1="-1" x2="15.402" y2="-1" transform="matrix(-0.779118 0.626877 -0.600947 -0.799289 12 63)" stroke="black" strokeWidth="2"/>
<line y1="-1" x2="15.402" y2="-1" transform="matrix(-0.779118 0.626877 -0.600947 -0.799289 12 46)" stroke="black" strokeWidth="2"/>
<line y1="-1" x2="15.402" y2="-1" transform="matrix(-0.779118 0.626877 -0.600947 -0.799289 12 37)" stroke="black" strokeWidth="2"/>
<line y1="-1" x2="15.402" y2="-1" transform="matrix(-0.779118 0.626877 -0.600947 -0.799289 12 54)" stroke="black" strokeWidth="2"/>
<line y1="-1" x2="14.9793" y2="-1" transform="matrix(-0.801104 0.598526 -0.572443 -0.819945 12 71.3448)" stroke="black" strokeWidth="2"/>
</svg>
    )
}
export const ImgFixedSupport=({className})=>{
    return(
<svg className={className} xmlns="http://www.w3.org/2000/svg" height="61" viewBox="0 0 35 61" fill="none">
<line x1="12.5" x2="12.5" y2="60" stroke="black"/>
<line y1="-0.5" x2="15.402" y2="-0.5" transform="matrix(-0.779118 0.626877 -0.600947 -0.799289 12 4.82758)" stroke="black"/>
<line y1="-0.5" x2="15.402" y2="-0.5" transform="matrix(-0.779118 0.626877 -0.600947 -0.799289 12 40.6897)" stroke="black"/>
<line y1="-0.5" x2="15.402" y2="-0.5" transform="matrix(-0.779118 0.626877 -0.600947 -0.799289 12 22.069)" stroke="black"/>
<line y1="-0.5" x2="15.402" y2="-0.5" transform="matrix(-0.779118 0.626877 -0.600947 -0.799289 12 13.1035)" stroke="black"/>
<line y1="-0.5" x2="15.402" y2="-0.5" transform="matrix(-0.779118 0.626877 -0.600947 -0.799289 12 31.7241)" stroke="black"/>
<line y1="-0.5" x2="14.9793" y2="-0.5" transform="matrix(-0.801104 0.598526 -0.572443 -0.819945 12 50.3448)" stroke="black"/>
<line x1="12" y1="21.5" x2="29" y2="21.5" stroke="black"/>
<line x1="13" y1="41.5" x2="29" y2="41.5" stroke="black"/>
<line x1="29.5" y1="14" x2="29.5" y2="28" stroke="black"/>
<line x1="29.2572" y1="27.4287" x2="24.2572" y2="30.4287" stroke="black"/>
<line x1="24.0498" y1="30.5025" x2="34.0498" y2="31.5025" stroke="black"/>
<line x1="34.2572" y1="31.4287" x2="29.2572" y2="34.4287" stroke="black"/>
<line x1="29.5" y1="34" x2="29.5" y2="49" stroke="black"/>
</svg>
    )
}