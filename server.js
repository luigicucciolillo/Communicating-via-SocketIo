/*** IMPORTs and Global variables ****************************************************/
import EventEmitter from 'events';
import { spawn } from 'child_process';
import express from 'express';
import http from 'http';
import { Server as socketIo } from 'socket.io';
import fs from 'fs';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let childSockets = [];
let exitCount = 0;
const    resetColor = '\x1b[0m';
const    redColor = '\x1b[31m';
const    greenColor = '\x1b[32m';
const    yellowColor = '\x1b[33m';
const    blueColor = '\x1b[34m';
const    magentaColor = '\x1b[35m';// Magenta text
const    cyanColor = '\x1b[36m';   // Cyan text
const brightGreenColor = '\x1b[38;5;46m';  // Bright green text
const brightYellowColor = '\x1b[38;5;226m';  // Bright yellow text
// Create an express app and HTTP server *************************************************
const app = express();
const server = http.createServer(app);
const io = new socketIo(server);
console.clear()
// Stream for log file *******************************************************************
const logStream = fs.createWriteStream('server_logs.txt', { flags: 'a' });
// function to log messages to both console and file *************************************
function logMessage(message) {
    console.log(message);
    logStream.write(`${new Date().toISOString()} - ${message}\n`);
}
function padStringToMaxLengthWithColor(inputString, maxLength, colorCode) {
    // Check if the input string is already the desired length or longer
    if (inputString.length >= maxLength) {
        return colorCode + inputString + "\x1b[0m"; // Apply color and reset color at the end
    }

    // Fill the remaining length with '-' characters and apply color
    let paddedString = inputString.padEnd(maxLength, '-');
    return colorCode + paddedString + "\x1b[0m"; // Apply color and reset color at the end
}
let socketIds = [];
let pIds = [];
let socketsOrdered = [];
// a connection is made to the Socket.IO server *************************************
io.on('connection', (socket) => {
    //logMessage(padStringToMaxLengthWithColor("> Server connect", 20, greenColor)+` > ${socket.id} - A child process has connected to the server with ID -` + resetColor);
    let STR_out = padStringToMaxLengthWithColor("> Server connect", 100, greenColor);
        logMessage(STR_out +`\n\t\t\t> ${socket.id} - A child process has connected to the server with ID`);
            let socketId = socket.id;
            // Store the socket ID in an array
            socketIds.push(socketId);
            console.log('\t\t\t All connected socket IDs:', socketIds);
        // Store the child process socket
    childSockets.push(socket);
    // Listen for messages from the child processes
    socket.on('messageFromChild', (data) => {
        let STR_out = [];
        let socketVar = [];
        let childpidVar = [];
        switch (data.type) {
            case 'exit':    STR_out = padStringToMaxLengthWithColor("> Exit", 100, blueColor) + blueColor + '\n\t\t\tMessageFromChild Socket:' + resetColor; break;
            case 'hello':   STR_out = padStringToMaxLengthWithColor("> Hello", 100, yellowColor); break;
            case 'request': STR_out = padStringToMaxLengthWithColor("> Request", 100, magentaColor); break;
        }
        childpidVar = pIds[socketsOrdered.indexOf(socket.id)];
        if(socket.id === socketIds[0]){
            socketVar = brightGreenColor + `${socket.id}` + resetColor;
            childpidVar =  brightGreenColor + childpidVar + resetColor;
        }else{
            socketVar = brightYellowColor + `${socket.id}` + resetColor;
            childpidVar =  brightYellowColor + childpidVar + resetColor;
        }
        logMessage(STR_out +`\n\t\t\t> ${socketVar} - ${childpidVar} Message from ${data.from}: \n\t\t\t\t >>>> ${data.message}`);
        if(data.from ==='Child 1'){socketsOrdered[0]=socket.id; pIds[0]=child1.pid; }//console.log(pIds); console.log(socketsOrdered)}
        if(data.from ==='Child 2'){socketsOrdered[1]=socket.id; pIds[1]=child2.pid; }//console.log(pIds); console.log(socketsOrdered)}
        const otherChildSocket = childSockets.find(s => s !== socket);
        if (otherChildSocket) {
            otherChildSocket.emit('messageFromParent', data);
        }
    });
    socket.on('exit', () => {
        let  STR_out = padStringToMaxLengthWithColor("> Exit", 100, blueColor);
        let socketVar = [];
        let childpidVar = pIds[socketsOrdered.indexOf(socket.id)];
            if(socket.id === socketIds[0]){
                socketVar = brightGreenColor + `${socket.id}` + resetColor;
                childpidVar =  brightGreenColor + childpidVar + resetColor;
            }else{
                socketVar = brightYellowColor + `${socket.id}` + resetColor;
                childpidVar =  brightYellowColor + childpidVar + resetColor;
            }
        logMessage(STR_out + blueColor     + '\n\t\t\tExit Socket:\n\t\t\t' + resetColor+`> ${socketVar} - ${childpidVar} : Sent and` + blueColor + ` exit ` + resetColor+`event`);
        socket.emit('exit');
    });
    // Handle disconnection **************************************************************
    socket.on('disconnect', () => {
        let  STR_out = padStringToMaxLengthWithColor("> Disconnect", 100, cyanColor);
        let socketVar = [];
        let childpidVar = pIds[socketsOrdered.indexOf(socket.id)];
        if(socket.id === socketIds[0]){
            socketVar = brightGreenColor + `${socket.id}` + resetColor;
            childpidVar =  brightGreenColor + childpidVar + resetColor;
        }else{
            socketVar = brightYellowColor + `${socket.id}` + resetColor;
            childpidVar =  brightYellowColor + childpidVar + resetColor;
        }
        logMessage(STR_out+`\n\t\t\t> ${socketVar} - ${childpidVar} - Child process has disconnected.`);
        childSockets = childSockets.filter(s => s !== socket); // Remove the disconnected socket
    });
});
// Start the server on port 3000 *********************************************************
const port = 3000;
server.listen(port, () => {
    logMessage(`Server is running on http://localhost:${port}`);
});
// Spawn two child processes that will use Socket.IO client ******************************
const child1 = spawn('node', ['./child1.js']); 
const child2 = spawn('node', ['./child2.js']); 
// Listen for messages from the child processes ******************************************
child1.stdout.on('data', (data) => {
    logMessage(`Child 1 stdout: ${data}`);
});
child2.stdout.on('data', (data) => {
    logMessage(`Child 2 stdout: ${data}`);
});
child1.stderr.on('data', (data) => {
    console.error(`Child 1 stderr: ${data}`);
});
child2.stderr.on('data', (data) => {
    console.error(`Child 2 stderr: ${data}`);
});
child1.on('close', (code) => {
    let  STR_out = padStringToMaxLengthWithColor("> child1.on(close", 100, redColor);
    logMessage(STR_out +`\n\t\t\t> ${child1.pid} Child 1 process exited with code ${code}`);
    exitCount++;
    myEmitter.emit('variableChanged', exitCount); 
});
child2.on('close', (code) => {
    let  STR_out = padStringToMaxLengthWithColor("> child2.on(close", 100, redColor);
    logMessage(STR_out +`\n\t\t\t> ${child2.pid} Child 2 process exited with code ${code}`);
    exitCount++;
    myEmitter.emit('variableChanged', exitCount); 
});
myEmitter.on('variableChanged', (newValue) => {
    let  STR_out = padStringToMaxLengthWithColor("\t\t > Event handler", 86, redColor);
    logMessage(STR_out+`\n\t\t\t > number of child exited: ${newValue}`);
    if (exitCount === 2) {
        logMessage('\t\t\t >> Both children have exited. Emitting shutdown event...');
        server.close(() => {
            logMessage('\t\t\t >>> Server has been shut down.');
            setTimeout(() => {
                process.exit(0)
            }, 1000); 
        });
    }
});