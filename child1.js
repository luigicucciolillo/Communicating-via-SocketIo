// Change from CommonJS require to ES module import *****************************************
import io from 'socket.io-client';
const    resetColor = '\x1b[0m';
const    redColor = '\x1b[31m';
const    greenColor = '\x1b[32m';
const    yellowColor = '\x1b[33m';
const    blueColor = '\x1b[34m';
// Connect to the parent server *************************************************************
const socket = io('http://localhost:3000');
// Listen for messages from the parent ******************************************************
socket.on('messageFromParent', (message) => {
    if (message.message === 'Hello from Child 2!') {
        socket.emit('messageFromChild', {
            from: 'Child 1',
            message: 'Exit request to Child 2',
            type: 'request'
        });
    }
    if (message.message === 'Exit request to Child 1') {
        socket.emit('exit');
            setTimeout(() => {
                socket.disconnect();
                process.exit(0)
            }, 1000);
    }
});
// Send an initial message to the parent after a delay ***********************************
setTimeout(() => {
    socket.emit('messageFromChild', {
        type: 'hello',
        from: 'Child 1',
        message: 'Hello from Child 1!',
    });
}, 1000);
socket.on('exit', () => {
    socket.emit('messageFromChild', {
        type: 'exit',
        from: 'Child 1',
        message: 'Exit event received from child 1'
    });
});