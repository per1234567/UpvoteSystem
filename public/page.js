var socket = io();

const perlai = document.getElementById('123');
for(let perlas of perlai.children){
    if(perlas.getAttribute('id') === 'br') break;
    perlas.children[2].addEventListener('click', () => {
        socket.emit('downvote', {id : perlas.getAttribute('id')});
    })

    perlas.children[4].addEventListener('click', () => {
        socket.emit('upvote', {id : perlas.getAttribute('id')});
    })
}

socket.on('downvote', data => {
    const block = document.getElementById(data.id);
    block.children[1].innerText++;
});

socket.on('upvote', data => {
    const block = document.getElementById(data.id);
    block.children[3].innerText++;
});

const licas = document.getElementById('licas');
licas.addEventListener('click', () => {
    window.location.href = 'https://www.paskutinisskambutis.com/';
});