const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

var audio = new Audio('./ting.mp3.mp3');

// Unlock audio after first click
document.body.addEventListener('click', () => {
    audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
    });
}, { once: true });

const append = (message, position) => {
    const messageElement = document.createElement('div');

    messageElement.innerText = message;

    messageElement.classList.add('message');
    messageElement.classList.add(position);

    messageContainer.append(messageElement);

    if(position == 'left'){
        audio.play();
    }
};

const name = prompt("Enter your name to join");

append(`You joined the chat`, 'right');

socket.emit('new-user-joined', name);

socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'left');
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const message = messageInput.value;

    append(`You: ${message}`, 'right');

    socket.emit('send', message);

    messageInput.value = '';
});

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', name => {
    append(`${name} left the chat`, 'left');
});