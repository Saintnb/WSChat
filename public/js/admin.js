const socket = io();
let connectionsUsers = [];
socket.on("admin_list_all_users", connections =>{
    connectionsUsers = connections;
    document.getElementById("list_users").innerHTML = "";

    let template= document.getElementById("template").innerHTML;

    connections.forEach(connection =>{
        const render = Mustache.render(template,{
            email: connection.user.email,
            id: connection.socket_id
        })

        document.getElementById("list_users").innerHTML += render;

        
    })
});
function closeChat(id, socket_id) {
    console.log("close", id)
    console.log("close socket", socket_id)
      const chatInSupport = document.getElementById(`admin${id}`);
      chatInSupport.style.display = "none";

      const params ={
        user_id: id
    }
    socket.emit("admin_user_out_support", params);
    }
function call(id){
    console.log(id)
    const connection = connectionsUsers.find(connection => connection.socket_id === id);
    const template = document.getElementById("admin_template").innerHTML;

    const render = Mustache.render(template, {
        email: connection.user.email,
        id: connection.user_id,
        socket_id: id
    })

    document.getElementById("supports").innerHTML += render;

    const params ={
        user_id: connection.user_id
    }
    socket.emit("admin_user_in_support", params);

    socket.emit("admin_list_messages_by_user", params, (messages) => {
      const divMessages = document.getElementById(
        `allMessages${connection.user_id}`
      );

        messages.forEach(message =>{
            const createDiv = document.createElement("div");
            if(message.admin_id === null){
                createDiv.className= "admin_message_client";

                createDiv.innerHTML = `<span>${connection.user.email}</span>`;
                createDiv.innerHTML += `<span>${message.text}</span>`;
                createDiv.innerHTML += `<span class="admin_date"> ${dayjs(
                    message.create_at)
                    .format("DD/MM/YYYY HH:mm:ss")}`;
            }else{
                createDiv.className= "admin_message_admin";

                createDiv.innerHTML = `Supported by: <span>${message.text}</span>`;
                createDiv.innerHTML += `<span class="admin_date> ${dayjs(
                    message.create_at
                    ).format("DD/MM/YYYY HH:mm:ss")}</span>`;
            }
            divMessages.appendChild(createDiv); 
        });

    })
}

function sendMessage(id){
    const text = document.getElementById(`send_message_${id}`);

    const params={
        text: text.value,
        user_id:id
    }

    socket.emit("admin_send_message", params);

    const divMessages = document.getElementById(
        `allMessages${id}`
      );
      const createDiv = document.createElement("div");
      createDiv.className= "admin_message_admin";

      createDiv.innerHTML = `Supported by: <span>${params.text}</span>`;
      createDiv.innerHTML += `<span class="admin_date> ${dayjs(
         ).format("DD/MM/YYYY HH:mm:ss")}</span>`;
        
    divMessages.appendChild(createDiv); 

    text.value="";  
}

socket.on("admin_receive_message", (data) => {

    console.log(data);
    const connection = connectionsUsers.find(
      (connection) => connection.socket_id === data.socket_id
    ); 
  
    const divMessages = document.getElementById(
      `allMessages${connection.user_id}`
    );
  
    const createDiv = document.createElement("div");
  
    createDiv.className = "admin_message_client";
    createDiv.innerHTML = `<span>${connection.user.email} </span>`;
    createDiv.innerHTML += `<span>${data.message.text}</span>`;
    createDiv.innerHTML += `<span class="admin_date">${dayjs(
      data.message.created_at
    ).format("DD/MM/YYYY HH:mm:ss")}</span>`;
  
    divMessages.appendChild(createDiv);
  });