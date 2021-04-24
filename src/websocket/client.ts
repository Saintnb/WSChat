import {io} from "../http";
import {ConnectionsServices} from '../services/ConnectionsServices'
import { UserServices } from "../services/UserServices";
import { MessagesServices } from "../services/MessagesServices";


interface IParams{
    text: string;
    email:string;
}

io.on("connect", (socket)=>{
    const connectionsServices = new ConnectionsServices();
    const userServices = new UserServices();
    const messageServices = new MessagesServices();

    socket.on("client_first_access", async (params)=>{
        const socket_id = socket.id;
        const {text, email} = params as IParams;
        let user_id = null;
        const userExists= await userServices.findByEmail(email);
        console.log(params);
        if(!userExists){
            const user = await userServices.create(email);
        
        await connectionsServices.create({
            socket_id,
            user_id: user.id
        })
        user_id = user.id;
    }
    else{
        const connection = await connectionsServices.findByUserId(userExists.id);

        if(!connection){
            await connectionsServices.create({
                socket_id,
                user_id: userExists.id
            })
        }
        else{
            connection.socket_id = socket_id;

            await connectionsServices.create(connection);
        }        
        user_id = userExists.id;
    }

    await messageServices.create({
        text,
        user_id
    })

    const allMessages = await messageServices.listByUser(user_id);
    socket.emit("client_list_all_messages", allMessages);

    const allUsers= await  connectionsServices.findAllWithoutAdmin();
    io.emit("admin_list_all_users", allUsers);
    
    });

    socket.on("client_send_to_admin", async params => {
        const { text, socket_admin_id } = params;
        const socket_id = socket.id;
        const { user_id } = await connectionsServices.findBySocketId(socket.id);
        const message = await messageServices.create({
            text,
            user_id,
        })
        console.log("socket_admin_id", socket_admin_id);
        console.log("message", message);

        io.to(socket_admin_id).emit("admin_receive_message", {     
            message,
            socket_id,
        })
    });
});