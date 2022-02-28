const messagesContainer = document.querySelector(".chat-messages");
const messageForm = document.getElementById("chat-form");
const message = document.getElementById("msg");
const roomNameContainer = document.getElementById("room-name");
const usersList = document.getElementById("users");
const leave = document.getElementById("leave-btn");

const qs = Qs;

const socket = io();

const { username, room } = qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

roomNameContainer.textContent = room;

console.log(username, room);

socket.emit("joinRoom", { username, room });

const showMessage = (message) => {
  if (!message.room || message.room === room) {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.message}
    </p>`;
    messagesContainer.appendChild(div);
    div.scrollIntoView({
      behavior: "smooth",
    });
  }
};

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();

  socket.emit("newMessage", message.value);

  message.value = "";
  message.focus();
});

socket.on("message", (message) => {
  console.log(message);
  showMessage(message);
});

socket.on("updateRoomUsers", (userList) => {
  usersList.innerHTML = "";
  userList.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = user.username;
    usersList.appendChild(li);
  });
});

leave.addEventListener("click", (e) => {
  e.preventDefault();
  location = "http://localhost:4000";
});
