# Node.js Server with 2 Child Processes and Socket.IO

This Node.js application demonstrates how to manage a server that interacts with a 2 childs processes using `spawn()`, and communicates with a Socket.IO client. The application also logs events to both the console and a log file (`server_logs.log`) for debugging and monitoring purposes.

## Features
- **Child Process Management**: Spawns a the childs processes (`child1.js` and `child2.js`), captures its output, manage the communication and logs the data.
- **Socket.IO Server**: Listens for connections from Socket.IO clients and communicates with them.
- **Logging**: Logs important events to both the console and a log file (`server.log`).

## Sequence

    1. Start the server by running the following command: node server.js
    2. The server will listen on port 3000. You can access the server at:
    3. the two child, after spawned, connect to the server
    4. child 1 say hello
    5. child 2 say hello
    6. child 1 listen the hello and then request to child 2 to exit
    7. child 2 exit and send a request to child 1 to exit
    8. child 1 exit
    9. when both child exit, server close the server and exit as well

## Log File

All logs related to the server's activities, such as child process outputs and socket events, will be written to server.log. This log file is useful for debugging and tracking the server's activities over time.

### Content log file

```
2025-03-07T11:52:51.823Z - Server is running on http://localhost:3000
2025-03-07T11:52:52.070Z - [32m > WgjqSZ9gpLh3lFXZAAAC - A child process has connected to the server with ID -[0m
2025-03-07T11:52:52.076Z - [32m > wTi82M0fWcSG2HKpAAAD - A child process has connected to the server with ID -[0m
2025-03-07T11:52:53.055Z - [33m> WgjqSZ9gpLh3lFXZAAAC - Message from Child 1: Hello from Child 1![0m
2025-03-07T11:52:53.060Z - [33m> wTi82M0fWcSG2HKpAAAD - Message from Child 2: Hello from Child 2![0m
2025-03-07T11:52:53.062Z - [33m> WgjqSZ9gpLh3lFXZAAAC - Message from Child 1: Exit request to Child 2[0m
2025-03-07T11:52:53.064Z - [33m> wTi82M0fWcSG2HKpAAAD - Message from Child 2: Exit request to Child 1[0m
2025-03-07T11:52:53.066Z - wTi82M0fWcSG2HKpAAAD exit requested.
2025-03-07T11:52:53.066Z - WgjqSZ9gpLh3lFXZAAAC exit requested.
2025-03-07T11:52:54.076Z -    > WgjqSZ9gpLh3lFXZAAAC - Child process has disconnected.
2025-03-07T11:52:54.077Z -    > wTi82M0fWcSG2HKpAAAD - Child process has disconnected.
2025-03-07T11:52:54.089Z - [31m > child2.on(close : [0mChild 2 process exited with code 0
2025-03-07T11:52:54.089Z -  > Event handler - number of child exited: 1
2025-03-07T11:52:54.090Z - [31m > child1.on(close : [0mChild 1 process exited with code 0
2025-03-07T11:52:54.090Z -  > Event handler - number of child exited: 2
2025-03-07T11:52:54.090Z - Both children have exited. Emitting shutdown event...
2025-03-07T11:52:54.091Z - Server has been shut down.
```