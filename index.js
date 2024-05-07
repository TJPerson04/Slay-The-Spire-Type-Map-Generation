// PARAMETERS //

const ROWS = 15;  // The number of vertical "layers" the rooms will be divided into
const COLS = 7;  // The number of horizontal "layers" the rooms will be divided into
const NUM_ROOMS = 63;  // The total number of rooms to generate

const IMG_HEIGHT = 800;  // The height of the outputted image (in pixels)
const IMG_WIDTH = 400;  // The width of the outputted image (in pixels)

const X_PADDING = 50;  // The amount of empty space on the right and left edges of the image
const Y_PADDING = 30;  // The amount of empty space on the top and bottom edges of the image

// END PARAMETERS //


// TODO: 
// Add a little bit of randomness to each possible room spot, just to make it look not as rigid
// Make sure each room has at least one room connected (and fix the tilt towards the first spot it checks)
// Make lines connect to each connected room


// Libraries
import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';

import Room from './Room.js';

const canvas = createCanvas(IMG_WIDTH, IMG_HEIGHT);
const ctx = canvas.getContext('2d');


// PLAN OUT MAP //
// Each index in the format [room_name, weight], where weight is the liklihood the room appears
const ROOM_TYPES = [
    ['Combat', 0.6],
    ['Elite Combat', 0.1],
    ['Boon', 0.1],
    ['Feat', 0.1],
    ['Shop', 0.1]
];

let spaceBetweenCols = (canvas.width - (2 * X_PADDING)) / (COLS - 1);
let spaceBetweenRows = (canvas.height - (2 * Y_PADDING)) / (ROWS - 1);

// Will hold the rooms once they have been created
let rooms = [];
let possibleSpotsX = []
let possibleSpotsY = []

for (let i = 0; i < COLS; i++) {
    possibleSpotsX.push(spaceBetweenCols * i + X_PADDING);
}

for (let i = 0; i < ROWS; i++) {
    possibleSpotsY.push(spaceBetweenRows * i + Y_PADDING);
}


// Generate the first row
for (let i = 0; i < possibleSpotsX.length; i++) {
    if (Math.random() < 0.5) {  // Currently a 50% chance that a spot on the first row will be a room
        let typeIndex = Math.floor(Math.random() * ROOM_TYPES.length);
        let type = ROOM_TYPES[typeIndex];

        let x = possibleSpotsX[i];
        let y = possibleSpotsY[0];

        let room = new Room(x, y, type, 0, i);
        rooms.push(room);
    }
}

let left = possibleSpotsX[0];
let right = possibleSpotsX[possibleSpotsX.length - 1];

for (let i = 0; i < rooms.length; i++) {
    if (rooms[i].getY() == possibleSpotsY[possibleSpotsY - 1]) {
        break;
    }
    let offsets = [];
    if (rooms[i].getX() == left) {
        offsets = [0, 1];
    } else if (rooms[i].getX() == right) {
        offsets = [-1, 0];
    } else {
        offsets = [-1, 0, 1];
    }

    let perc = 0.1  // Currently a 10% each spot will have a room
    let hasConnect = false
    offsets.forEach((offset) => {
        if (Math.random() < perc) {
            hasConnect = true
            perc -= 0.03;

            let typeIndex = Math.floor(Math.random() * ROOM_TYPES.length);
            let type = ROOM_TYPES[typeIndex];

            let col = rooms[i].getCol() + offset;
            let row = rooms[i].getRow() + 1;

            let x = possibleSpotsX[col];
            let y = possibleSpotsY[row];

            let room = new Room(x, y, type, row, col, rooms[i]);
            rooms.push(room);
        }
    })
    if (!hasConnect) {
        let offset = Math.round(Math.random() * 2) - 1
        if (rooms[i].getX() == left) {
            offset = Math.round(Math.random());
        } else if (rooms[i].getX() == right) {
            offset = Math.round(Math.random()) - 1;
        }
        let typeIndex = Math.floor(Math.random() * ROOM_TYPES.length);
        let type = ROOM_TYPES[typeIndex];

        let col = rooms[i].getCol() + offset;
        let row = rooms[i].getRow() + 1;

        let x = possibleSpotsX[col];
        let y = possibleSpotsY[row];

        let room = new Room(x, y, type, row, col, rooms[i]);
        rooms.push(room);
    }
}

// for (let i = 0; i < NUM_ROOMS; i++) {


//     let typeIndex = Math.floor(Math.random() * ROOM_TYPES.length);
//     let type = ROOM_TYPES[typeIndex];

//     let room = new Room(x, y, type)
//     rooms.push(room);
// }

// DRAW THE IMAGE //

// Background
ctx.fillStyle = 'rgb(255, 255, 255)';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = 'rgb(0, 0, 0)';

// Rooms
rooms.forEach(room => {
    ctx.beginPath();
    ctx.fillRect(room.getX() - 5, room.getY() - 5, 10, 10)  // - 5 is so that room.x and room.y are in the center of the rectangle, since they will be 10 pixels wide and tall
    ctx.stroke();

    if (room.getRow() == possibleSpotsY.length - 1) {  // If the room is in the last row
        let newRoom = room;
        while (true) {
            try {
                ctx.beginPath();
                ctx.lineTo(newRoom.getX(), newRoom.getY());
                newRoom = newRoom.getConnectedRooms()[0];
                ctx.lineTo(newRoom.getX(), newRoom.getY());
                ctx.stroke();  
            } catch {
                break;
            }
        }
    }
});



writeFileSync('./output-image.png', canvas.toBuffer());