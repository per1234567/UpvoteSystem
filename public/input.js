var socket = io();

const mokytojas = document.getElementById('mokytojas');
const perliukas = document.getElementById('perliukas');
const input = document.getElementById('input');

input.addEventListener('click', () => {
    socket.emit('add', {mokytojas : mokytojas.value, perliukas : perliukas.value});
});