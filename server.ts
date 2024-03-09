import http from "http";
import { app } from "./app";


const port = process.env.port || 3000;//ถ้าไม่มี port ให้ใส่เลข 3000
const server = http.createServer(app);

//start Server
server.listen(port, () => {
    console.log("Server is started");
});