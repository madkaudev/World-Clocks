const CTX = document.getElementById("main_canvas").getContext("2d");

const CANVAS_WIDTH = 720;
const CANVAS_HEIGHT = 720;
const ANCHOR_X = CANVAS_WIDTH / 2;
const ANCHOR_Y = CANVAS_HEIGHT / 2;
const FONT_SIZE = 36;
const CLOCK_RADIUS = CANVAS_HEIGHT * 0.4;
const INNER_CLOCK_RADIUS = CLOCK_RADIUS - FONT_SIZE;
const MARKER_LENGTH = 12;
const MARKER_RADIUS = INNER_CLOCK_RADIUS - 2 * MARKER_LENGTH;
const TEXT_RADIUS = MARKER_RADIUS - FONT_SIZE / 2;
const TEXT_OFFSET_X = FONT_SIZE / 2;
const TEXT_OFFSET_Y = FONT_SIZE / 3;

function drawGuidelines() {
    // Draw vertical and horizontal guide lines through clock
    CTX.beginPath();
    CTX.moveTo(ANCHOR_X, ANCHOR_Y - CLOCK_RADIUS);
    CTX.lineTo(ANCHOR_X, ANCHOR_Y + CLOCK_RADIUS);
    CTX.stroke();
    CTX.beginPath();
    CTX.moveTo(ANCHOR_X - CLOCK_RADIUS, ANCHOR_Y);
    CTX.lineTo(ANCHOR_X + CLOCK_RADIUS, ANCHOR_Y);
    CTX.stroke();
    // Text radius guideline
    CTX.beginPath();
    CTX.arc(ANCHOR_X, ANCHOR_Y, TEXT_RADIUS, 0, 2 * Math.PI);
    CTX.stroke();
}

function drawBody() {
    // Outer body
    CTX.fillStyle = "black";
    CTX.lineWidth = 1;
    CTX.beginPath();
    CTX.arc(ANCHOR_X, ANCHOR_Y, CLOCK_RADIUS, 0, Math.PI * 2);
    CTX.fill();
    // Inner body
    CTX.fillStyle = "white";
    CTX.beginPath();
    CTX.arc(ANCHOR_X, ANCHOR_Y, INNER_CLOCK_RADIUS, 0, 2 * Math.PI);
    CTX.fill();
}

function drawFace() {
    // Draw numbers on face
    CTX.fillStyle = "black";
    CTX.font = FONT_SIZE.toString() + "px sans serif";
    let angle = Math.PI / 3;
    for (let i = 1; i <= 12; i++) {
        let TEXT_X = Math.cos(angle) * TEXT_RADIUS + ANCHOR_X;
        // If the number is double digit, move the text a bit more to the left
        TEXT_X = (i >= 10) ? TEXT_X - TEXT_OFFSET_X : TEXT_X - TEXT_OFFSET_X / 2;
        // Due to how the y coordinate get bigger as you go down on HTML canvas, the radius needs to be subtracted from height
        const TEXT_Y = ANCHOR_Y - Math.sin(angle) * TEXT_RADIUS + TEXT_OFFSET_Y;
        CTX.fillText(i.toString(), TEXT_X, TEXT_Y);
        angle -= Math.PI / 6;
    }
    // Draw the time markers
    CTX.strokeStyle = "black";
    for (let i = 0; i < 60; i ++) {
        if (i % 5 == 0) {
            CTX.lineWidth = 6;
        }
        else {
            CTX.lineWidth = 3;
        }
        const ANGLE = 2 * Math.PI / 60 * i;
        const MARKER_X_START = Math.cos(ANGLE) * MARKER_RADIUS + ANCHOR_X;
        const MARKER_Y_START = ANCHOR_Y - Math.sin(ANGLE) * MARKER_RADIUS;
        const MARKER_X_END = Math.cos(ANGLE) * (MARKER_RADIUS + MARKER_LENGTH) + ANCHOR_X;
        const MARKER_Y_END = ANCHOR_Y - Math.sin(ANGLE) * (MARKER_RADIUS + MARKER_LENGTH);
        CTX.beginPath();
        CTX.moveTo(MARKER_X_START, MARKER_Y_START);
        CTX.lineTo(MARKER_X_END, MARKER_Y_END);
        CTX.stroke();
    }
}

function drawHands() {
    // Get the current time
    const CURRENT_TIME = Temporal.Now.plainTimeISO();
    console.log(CURRENT_TIME);
    // Draw the hour hand
    CTX.lineWidth = 3;
    CTX.strokeStyle = "black";
    CTX.beginPath();
    CTX.moveTo(ANCHOR_X, ANCHOR_Y);
    const HOUR_RATIO = -(CURRENT_TIME.hour + CURRENT_TIME.minute / 60) / 12 * 2 * Math.PI;
    const HOUR_ANGLE = HOUR_RATIO + Math.PI / 2;
    const HOUR_X = Math.cos(HOUR_ANGLE) * INNER_CLOCK_RADIUS * 0.55 + ANCHOR_X;
    const HOUR_Y = ANCHOR_Y - Math.sin(HOUR_ANGLE) * INNER_CLOCK_RADIUS * 0.55;
    CTX.lineTo(HOUR_X, HOUR_Y);
    CTX.stroke();
    // Draw the minute hand
    CTX.strokeStyle = "black";
    CTX.beginPath();
    CTX.moveTo(ANCHOR_X, ANCHOR_Y);
    const MINUTE_RATIO = -(CURRENT_TIME.minute + CURRENT_TIME.second / 60) / 60 * 2 * Math.PI;
    const MINUTE_ANGLE = MINUTE_RATIO + Math.PI / 2;
    const MINUTE_X = Math.cos(MINUTE_ANGLE) * INNER_CLOCK_RADIUS * 0.85 + ANCHOR_X;
    const MINUTE_Y = ANCHOR_Y - Math.sin(MINUTE_ANGLE) * INNER_CLOCK_RADIUS * 0.85;
    CTX.lineTo(MINUTE_X, MINUTE_Y);
    CTX.stroke();
    // Draw the second hand
    CTX.strokeStyle = "red";
    CTX.beginPath();
    CTX.moveTo(ANCHOR_X, ANCHOR_Y);
    const SECOND_RATIO = -(CURRENT_TIME.second + CURRENT_TIME.millisecond / 1000) / 60 * 2 * Math.PI;
    const SECOND_ANGLE = SECOND_RATIO + Math.PI / 2;
    const SECOND_X = Math.cos(SECOND_ANGLE) * INNER_CLOCK_RADIUS * 0.95 + ANCHOR_X;
    const SECOND_Y = ANCHOR_Y - Math.sin(SECOND_ANGLE) * INNER_CLOCK_RADIUS * 0.95;
    CTX.lineTo(SECOND_X, SECOND_Y);
    CTX.stroke();
}

function drawClock() {
    drawBody();
    // drawGuidelines();
    drawFace();
    drawHands();
}

function draw() {
    CTX.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawClock();
    window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);
