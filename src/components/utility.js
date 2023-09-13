export function getRandomColorHex() {
    const letters = "0123456789ABCDEF";
    let color = "#";

    // Generate random values for the red, green, and blue components
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
}

export function hexToRGBA(hex, opacity) {
    if (hex.startsWith("rgba")) {
        return hex;
    }
    hex = hex.replace(/^#/, '');

    if (hex.length === 3) {
        hex = hex
            .split('')
            .map(function (hex) {
                return hex + hex;
            })
            .join('');
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r},${g},${b},${opacity})`;
}