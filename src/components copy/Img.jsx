import React from 'react'

export const ImgDistributedLoad = ({ width, spacing }) => {
    let w = width - 16
    const arrowSpacing = spacing
    const times = w % arrowSpacing === 0 ? w / arrowSpacing : Math.floor(w / arrowSpacing)
    const space = w / times
    const arrows = []
    for (let i = 1; i < times; i += 1) {
        arrows.push(<Arrow key={i} x={i * space + 8} />);
    }
    return (
        <svg transform="translate(0,-32)" height="28px" width={width} style={{ position: 'absolute' }}>;
            <rect x="8" y="1" width={width - 16} height="100%" fill="rgba(242, 135, 42, 0.405)" />;
            <line x1="8" y1="0" x2={width - 8} y2="0" stroke="black" strokeWidth="2" />
            <ArrowEnd x={8} />
            {arrows}
            <ArrowEnd x={width - 8} />
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
        <svg transform="scale(0.8) translate(0,-58)" style={{ zIndex: "1" }} xmlns="http://www.w3.org/2000/svg" width="16" height="47" viewBox="0 0 16 47" fill="none">
            <path d="M7.29289 46.7071C7.68342 47.0976 8.31658 47.0976 8.70711 46.7071L15.0711 40.3431C15.4616 39.9526 15.4616 39.3195 15.0711 38.9289C14.6805 38.5384 14.0474 38.5384 13.6569 38.9289L8 44.5858L2.34315 38.9289C1.95262 38.5384 1.31946 38.5384 0.928932 38.9289C0.538408 39.3195 0.538408 39.9526 0.928932 40.3431L7.29289 46.7071ZM7 0L7 46H9L9 0L7 0Z" fill="black" />
        </svg>
    )
}

function Arrow({ x }) {
    return (
        <>
            <line x1={x} y1="0" x2={x} y2="100%" stroke="black" strokeWidth="1" opacity="0.5" />
            <line x1={x} y1="100%" x2={x - 6} y2="70%" stroke="black" strokeWidth="1" opacity="0.5" />
            <line x1={x} y1="100%" x2={x + 6} y2="70%" stroke="black" strokeWidth="1" opacity="0.5" />
        </>
    )
}
function ArrowEnd({ x }) {
    return (
        <>
            <line x1={x} y1="0" x2={x} y2="100%" stroke="black" strokeWidth="1" />
            <line x1={x} y1="100%" x2={x - 6} y2="70%" stroke="black" strokeWidth="1" />
            <line x1={x} y1="100%" x2={x + 6} y2="70%" stroke="black" strokeWidth="1" />
        </>
    )
}