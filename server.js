const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Servir les fichiers statiques générés par Vue.js
app.use(express.static(path.join(__dirname, 'dist')));

// Lire les données JSON
let cardsData = JSON.parse(fs.readFileSync('cards.json', 'utf8'));

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('rfidData', (data) => {
        console.log('RFID data received:', data);
        const [readerID, uid] = data.split(':').map(item => item.trim());
        const card = cardsData.cards.find(card => card.uid === uid);
        if (card) {
            io.emit('rfidData', { readerID, card });  // Envoyer toute l'information de la carte
        } else {
            io.emit('rfidData', { readerID, card: { name: 'Carte inconnue', image: '', description_vie: '', description_jeu: '' } });
        }
    });


    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
