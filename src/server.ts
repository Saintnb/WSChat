import {http} from "./http";
import './websocket/client';
import './websocket/admin';
// app.listen(3333, () => console.log("Server Runing port 3333"));
http.listen(3333, () => console.log("Server Runing port 3333"));