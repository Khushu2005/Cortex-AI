require('dotenv').config();
const server = require('./src/app')
const ConnectToDb = require('./src/db/db')
const initSocketServer = require('./src/sockets/socket.server');
const httpServer= require('http').createServer(server);

ConnectToDb();

initSocketServer(httpServer);



httpServer.listen('3000',(req,res)=>{
    console.log('Server is running on http://localhost:3000');
    
})