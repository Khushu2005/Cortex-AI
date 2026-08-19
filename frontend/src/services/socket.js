import { io } from "socket.io-client";

const API_URL = import.meta.env.DEV
  ? 'http://localhost:3000/api'
  : import.meta.env.VITE_API_URL;


const socket = io(

  API_URL,
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