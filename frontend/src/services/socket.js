import { io } from "socket.io-client";

const socket = io(
 
  "http://localhost:3000",
  {
    withCredentials: true,
    transports: ["polling", "websocket"],

    
    autoConnect: false, 
    
    
    
    reconnection: true,
    reconnectionAttempts: 5,
    timeout: 20000,
  }
);

export default socket;