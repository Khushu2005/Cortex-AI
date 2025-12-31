import { io } from "socket.io-client";

const socket = io(
  import.meta.env.VITE_API_URL || 
  "http://localhost:3000",
  {
    withCredentials: true,
    transports: ["polling", "websocket"],

    // 🔥 FIX: Auto connect OFF kar diya (hum manually connect karenge)
    autoConnect: false, 
    
    // Auth object yahan se hata diya hai, ChatInterface me add karenge
    
    reconnection: true,
    reconnectionAttempts: 5,
    timeout: 20000,
  }
);

export default socket;