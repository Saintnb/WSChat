let socket_admin_id = null;
let emailUser = null;
let socket = null;
document.querySelector("#start_chat").addEventListener("click", (event) => {
     socket= io();

    const chat_help = document.getElementById("chat_help");
    chat_help.style.display="none";

    const chat_in_support = document.getElementById("chat_in_support");
    chat_in_support.style.display= "block";

    const email = document.getElementById("email").value;
    emailUser = email;
    const text =document.getElementById("txt_help").value;
    const params ={
        email,
        text,
    };
    socket.on("connect", () =>{
        socket.emit("client_first_access", params, (call, err)=>{
            if(err){
                console.log('pp error ',err);
            }
            else{
                console.log('coco call ',call);
            }
        })
    });

    socket.on("client_list_all_messages", (messages)=>{
       var template_client = document.getElementById("message-user-template").innerHTML;
       var template_admin = document.getElementById("admin-template").innerHTML;

       messages.forEach(message =>{
           if(message.admin_id === null){
               const render = Mustache.render(template_client, {
                   message: message.text,
                   email
               })

               document.getElementById("messages").innerHTML += render;
           }
           else{
               const render = Mustache.render(template_admin,{
                   message_admin: message.text
               })
               document.getElementById("messages").innerHTML += render;
           }
       })
    })
    socket.on("admin_send_to_client", message =>{
        socket_admin_id = message.socket_id;
        console.log("socket_admin_id", socket_admin_id);
        var template_admin = document.getElementById("admin-template").innerHTML;

        const render = Mustache.render(template_admin,{
            message_admin: message.text
        })
        document.getElementById("messages").innerHTML += render;

    })

});

document.querySelector("#send_message_button").addEventListener("click", (event)=>{
    const text = document.getElementById("message_user");

    const params={
        text: text.value,
        socket_admin_id
    }
    console.log("parameters 72",params);
    socket.emit("client_send_to_admin", params);

    var template_client = document.getElementById("message-user-template").innerHTML;
    const render = Mustache.render(template_client, {
        message: text.value,
        email: emailUser
    });

    document.getElementById("messages").innerHTML += render;

    text.value="";
})

