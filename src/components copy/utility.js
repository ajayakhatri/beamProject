export function validateInput(input) {
    if (input === "-" || input === "+") {
        console.log("+")
        return false;
    } else {
        return true;
    }
}