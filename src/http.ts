import express, { response } from 'express';
import {createServer} from 'http';
import {Server, Socket} from 'socket.io';

import path from 'path';

import './database';

import {routes} from './routes'

const app = express();

//conf public view
app.use(express.static(path.join(__dirname, "..", "public")));
app.set("views", path.join(__dirname, "..", "public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.get("/pages/client", (require, response)=>{
    return response.render("html/client.html");
});
app.get("/pages/admin", (require, response)=>{
    return response.render("html/admin.html");
});
const http = createServer(app); //create protocol http
const io = new Server (http); // create protocol ws

io.on("connection", (socket: Socket)=> {
    console.log("Sussesfull Connetion", socket);
});

app.use(express.json()); 
app.use(routes);

export {http, io};