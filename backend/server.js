require('dotenv').config();
const server = require('./src/app')
const ConnectToDb = require('./src/db/db')
const initSocketServer = require('./src/sockets/socket.server');
const httpServer= require('http').createServer(server);
const cors = require('cors');

ConnectToDb();


initSocketServer(httpServer);
server.use(cors({
  origin: [
    "http://localhost:5173",
    "https://cortex-ai-frontend.vercel.app" 
  ],
  credentials: true
}));


httpServer.listen('3000',(req,res)=>{
    console.log('Server is running on http://localhost:3000');
    
})