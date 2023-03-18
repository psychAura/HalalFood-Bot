const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const msg = require("./utils/messages");


const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, '/public')));


const fastFoods = {
    2: "Jollof Rice",
    3: "Fried Rice",
    4: "Pizza",
    5: "Chicken Burger",
  };


// Run when client connects
io.on("connection", (socket) => {
    console.log('New Connection...')

    const orderHistory = [];
    const state = {
      currentOrder: [],
    };

    const botMessage = async (message) => {
      console.log("Bot message received:", message);
      socket.emit("bot-message", message);
    };

    const userMessage = async (message) => {
      try {
        switch (message) {
          case "1":
            // Displays the list of items in order
            const itemOptions = Object.keys(fastFoods)
              .map((key) => `${key}. ${fastFoods[key]}`)
              .join("\n");
            await botMessage(
              `Here is a list of items you can order:\n ${itemOptions} \nPlease select one by typing its number.`
            );
            break;
          case "2":
          case "3":
          case "4":
          case "5":
            // Parse the number from the user input and add the corresponding item to the current order
            const selectedIndex = parseInt(message);
            if (fastFoods.hasOwnProperty(selectedIndex)) {
              const selectedItem = fastFoods[selectedIndex];
              state.currentOrder.push(selectedItem);
              console.log(`current orde: ${state.currentOrder}`);
              orderHistory.push(state.currentOrder);
              await botMessage(
                `${selectedItem} has been added to your order. Do you want to add more items to your order? Type numbers. If not, type 99 to checkout.`
              );
            } else {
              await botMessage("Invalid selection.");
            }
            break;
          case "99":
            if (state.currentOrder.length === 0) {
              await botMessage(
                "No order to place. Place an order\n1. See menu"
              );
            } else {
              orderHistory.push(state.currentOrder);
              await botMessage("Order placed");
              state.currentOrder = [];
            }
            break;
          case "98":
            if (orderHistory.length === 0) {
              await botMessage("No previous orders");
            } else {
              const orderHistoryString = orderHistory
                .map(
                  (order, index) => `Order ${index + 1}. ${order.join(", ")}`
                )
                .join("\n");
              await botMessage(
                `Here are your previous orders:\n${orderHistoryString}`
              );
            }
            break;
          case "97":
            if (state.currentOrder.length === 0) {
              await botMessage("No current order");
            } else {
              const currentOrderString = state.currentOrder.join(", ");
              await botMessage(
                `Here is your current order:\n${currentOrderString}`
              );
            }
            break;
          case "0":
            if (state.currentOrder.length === 0) {
              await botMessage("No order to cancel");
            } else {
              state.currentOrder = [];
              await botMessage("Order canceled");
            }
            break;
          default:
            await botMessage("Invalid input");
        }
      } catch (err) {
        console.log(err);
        await botMessage("An error occurred while processing your request.");
      }
    };

    socket.on("chatWindow", userMessage);

//Broadcast when user Lands
socket.emit('message', 'Welcome to HalalFood Bot. Lets start your order');
// Broadcast to show select options
socket.emit("options", { msg });



 // Display chat message
 socket.on("chatWindow", (msg) => {
    socket.emit("cmessage", msg);
});
});

const PORT = 5000 || process.env.PORT;

server.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));