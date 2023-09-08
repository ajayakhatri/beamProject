import React from 'react'

export const ImgDistributedLoad = ({ width, spacing, loadStart = 5, loadEnd = 5 }) => {
    let w = width - 16
    const a = { "x": 0, "y": loadStart }
    const b = { "x": w, "y": loadEnd }
    let fx = (x) => ((b.y - a.y) / (b.x - a.x)) * x + a.y
    const height = 30
    const h = Math.max(a.y, b.y)
    const arrowSpacing = spacing
    const times = w % arrowSpacing === 0 ? w / arrowSpacing : Math.floor(w / arrowSpacing)
    const space = w / times
    const arrows = []
    for (let i = 0; i <= w; i += space) {
        arrows.push(<Arrow key={i} x={i} opacity={0.5} height={(100 - (fx(i) * 100 / h)) + "%"} />);
    }

    return (
        <svg transform="translate(-8,-34)" height={height + "px"} width={width} style={{ position: 'absolute' }}>;
            <polygon points={`8,${(height - (fx(0) * height / h))}  ${w + 8},${(height - (fx(w) * height / h))} ${w + 8},40 8,50`} fill="rgba(242, 135, 42, 0.405)" />
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
        <svg transform="scale(0.8) translate(0,-73)" height="60px" style={{ zIndex: "1" }} xmlns="http://www.w3.org/2000/svg" width="16">
            <Arrow x={8} />
        </svg>
    )
}

function Arrow({ x, opacity = 1, height = "0%" }) {
    return (
        <>
            <line x1={x} y1={height} x2={x} y2="100%" stroke="black" strokeWidth="1" opacity={opacity} />
            <line x1={x} y1="100%" x2={x - 2} y2="85%" stroke="black" strokeWidth="1" opacity={opacity} />
            <line x1={x} y1="100%" x2={x + 2} y2="85%" stroke="black" strokeWidth="1" opacity={opacity} />

        </>
    )
}
