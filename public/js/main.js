const chatForm = document.querySelector('.chat-form')
//const Input = document.querySelector('.chat-input')
const chatWindow = document.querySelector('.chat-window')
const Input = document.getElementById("msg");

const socket = io();


socket.on('message', message=>{
    console.log(message);
});

//Mesage submit
chatForm.addEventListener('submit', event =>{
    event.preventDefault();
//Get message text
let msg = event.target.elements.msg.value;

msg = msg.trim();

if (!msg) {
  return false;
}

// Emit message to server
socket.emit("chatWindow", msg);

socket.emit("user-message", message);

// Clear input
e.target.elements.msg.value = "";
e.target.elements.msg.focus();

});

// Welcome Message from server
socket.on("message", (message) => {
    //console.log(message);
  outputMessage(message);

    // Scroll down
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement("div");
    div.classList.add("message");
    const p = document.createElement("p");
    p.classList.add("meta");
    p.innerText = message;
    div.appendChild(p);
    chatWindow.appendChild(div);
    //chatWindow.innerText = message;
    Input.value = " ";
  }

  // OptionMessage from server
socket.on("options", ({ msg }) => {
    optionMessage(msg);
  });

  function optionMessage(msg) {
    const div = document.createElement("div");
    div.classList.add("message");
    const p = document.createElement("p");
    p.classList.add("meta");
    p.innerText = msg.options;
    div.appendChild(p);
  
    chatWindow.appendChild(div);
    //chatMessages.innerText = message;
    Input.value = " ";
  }

// chat Message from server
socket.on("cmessage", (message) => {
    console.log(message);
    outputChatMessage(message);
  
    // Scroll down
    chatWindow.scrollTop = chatWindow.scrollHeight;
  });

// Output message to DOM
function outputChatMessage(message) {
    const div = document.createElement("div");
    div.classList.add("umessage");
    const p = document.createElement("p");
    p.classList.add("meta");
    p.innerText = message;
    div.appendChild(p);
  
    //chatMessages.classList.add("chat-house-move");
    chatWindow.appendChild(div);
  
    //chatMessages.innerText = message;
  }

  // Handle receiving bot messages from the server
socket.on("bot-message", (message) => {
    outputMessage(message);
  
    // Scroll down
    chatWindow.scrollTop = chatWindow.scrollHeight;
  });