# Node.js Server with 2 Children Processes and Socket.IO

This Node.js application demonstrates how to manage a server that interacts with a 2 children processes using `spawn()`, and communicates with a Socket.IO client. The application also logs events to both the console and a log file (`server_logs.log`) for debugging and monitoring purposes.

## Features
- **Child Process Management**: Spawns the children processes (`child1.js` and `child2.js`), captures its output, manage the communication and logs the data.
- **Socket.IO Server**: Listens for connections from Socket.IO clients and communicates with them.
- **Logging**: Logs important events to both the console and a log file (`server.log`).

## Sequence

    01. Start the server by running the following command: node server.js
    02. The server will listen on port 3000.
    03. The two child, after spawned, connect to the server (Server Connect)
    04. Child 1 say hello (Hello)
    05. Child 2 say hello (Hello)
    06. Child 1 listen the hello and then request to child 2 to exit (Request)
    07. Child 2 listen the request and send a new request to child 1 to exit (Request)
    08. Child 2 send an exit event to notify that is exiting (Exit-Exit Socket)
    09. Child 1 send an exit event to notify that is exiting (Exit-Exit Socket)
    10. Parent send an exit event to both the children
    11. Children answer back to parent via socket
    12. Children disconnect from the server (Disconnect)
    13. Parent register the exit of the 2 children (child#.on(close) + event handler)
    14. Once both children are exited, Parent shutdown the server and exit itself.

## Log File

All logs related to the server's activities, such as child process outputs and socket events, will be written to server.log. This log file is useful for debugging and tracking the server's activities over time.

### Content log file

```
2025-03-07T16:51:43.705Z - Server is running on http://localhost:3000
2025-03-07T16:51:43.993Z - [32m> Server connect------------------------------------------------------------------------------------[0m
			> kvl0P765m028feI_AAAC - A child process has connected to the server with ID
2025-03-07T16:51:44.000Z - [32m> Server connect------------------------------------------------------------------------------------[0m
			> 1lNOwNo6uZtQa8VQAAAD - A child process has connected to the server with ID
2025-03-07T16:51:44.980Z - [33m> Hello---------------------------------------------------------------------------------------------[0m
			> [38;5;46mkvl0P765m028feI_AAAC[0m - [38;5;46mundefined[0m Message from Child 1: 
				 >>>> Hello from Child 1!
2025-03-07T16:51:44.982Z - [33m> Hello---------------------------------------------------------------------------------------------[0m
			> [38;5;226m1lNOwNo6uZtQa8VQAAAD[0m - [38;5;226mundefined[0m Message from Child 2: 
				 >>>> Hello from Child 2!
2025-03-07T16:51:44.984Z - [35m> Request-------------------------------------------------------------------------------------------[0m
			> [38;5;46mkvl0P765m028feI_AAAC[0m - [38;5;46m8232[0m Message from Child 1: 
				 >>>> Exit request to Child 2
2025-03-07T16:51:44.987Z - [35m> Request-------------------------------------------------------------------------------------------[0m
			> [38;5;226m1lNOwNo6uZtQa8VQAAAD[0m - [38;5;226m19820[0m Message from Child 2: 
				 >>>> Exit request to Child 1
2025-03-07T16:51:44.988Z - [34m> Exit----------------------------------------------------------------------------------------------[0m[34m
			Exit Socket:
			[0m> [38;5;226m1lNOwNo6uZtQa8VQAAAD[0m - [38;5;226m19820[0m : Sent and[34m exit [0mevent
2025-03-07T16:51:44.989Z - [34m> Exit----------------------------------------------------------------------------------------------[0m[34m
			Exit Socket:
			[0m> [38;5;46mkvl0P765m028feI_AAAC[0m - [38;5;46m8232[0m : Sent and[34m exit [0mevent
2025-03-07T16:51:44.989Z - [34m> Exit----------------------------------------------------------------------------------------------[0m[34m
			MessageFromChild Socket:[0m
			> [38;5;226m1lNOwNo6uZtQa8VQAAAD[0m - [38;5;226m19820[0m Message from Child 2: 
				 >>>> Exit event received from child 2
2025-03-07T16:51:44.990Z - [34m> Exit----------------------------------------------------------------------------------------------[0m[34m
			MessageFromChild Socket:[0m
			> [38;5;46mkvl0P765m028feI_AAAC[0m - [38;5;46m8232[0m Message from Child 1: 
				 >>>> Exit event received from child 1
2025-03-07T16:51:45.994Z - [36m> Disconnect----------------------------------------------------------------------------------------[0m
			> [38;5;226m1lNOwNo6uZtQa8VQAAAD[0m - [38;5;226m19820[0m - Child process has disconnected.
2025-03-07T16:51:45.995Z - [36m> Disconnect----------------------------------------------------------------------------------------[0m
			> [38;5;46mkvl0P765m028feI_AAAC[0m - [38;5;46m8232[0m - Child process has disconnected.
2025-03-07T16:51:46.004Z - [31m> child2.on(close-----------------------------------------------------------------------------------[0m
			> 19820 Child 2 process exited with code 0
2025-03-07T16:51:46.004Z - [31m		 > Event handler--------------------------------------------------------------------[0m
			 > number of child exited: 1
2025-03-07T16:51:46.005Z - [31m> child1.on close-----------------------------------------------------------------------------------[0m
			> 8232 Child 1 process exited with code 0
2025-03-07T16:51:46.005Z - [31m		 > Event handler--------------------------------------------------------------------[0m
			 > number of child exited: 2
2025-03-07T16:51:46.005Z - 			 >> Both children have exited. Emitting shutdown event...
2025-03-07T16:51:46.006Z - 			 >>> Server has been shut down.

```