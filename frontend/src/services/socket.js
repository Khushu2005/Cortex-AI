import { io } from "socket.io-client";

const socket = io(
  import.meta.env.VITE_API_URL || "http://localhost:3000",
  {
    withCredentials: true,

    // 🔥 MOST IMPORTANT
    transports: ["polling", "websocket"],
     auth: {
    token: localStorage.getItem("token") // 👈 IMPORTANT
  },


    // Render ke liye stable settings
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    timeout: 20000,
  }
);

export default socket;
