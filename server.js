const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'dist')));

let cardsData = JSON.parse(fs.readFileSync('cards.json', 'utf8'));

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('rfidData', (data) => {
        console.log('RFID data received via WebSocket:', data);
        const [readerID, uid] = data.split(':').map(item => item.trim());
        const card = cardsData.cards.find(card => card.uid === uid);
        if (card) {
            io.emit('rfidData', { readerID, card });
            console.log('Emitted card data:', { readerID, card });
        } else {
            io.emit('rfidData', { readerID, card: { name: 'Carte inconnue', image: '', description_vie: '', description_jeu: '' } });
            console.log('Emitted unknown card data for UID:', uid);
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.post('/send_rfid_data', (req, res) => {
    const rfidData = req.body.rfid_data;
    console.log('Data received from Python:', rfidData);

    // Extraction du readerID et de l'UID avec un nettoyage pour éviter les erreurs
    const parts = rfidData.split(':');
    const readerID = parts[0].trim();

    // Expression régulière pour capturer l'UID complet
    const uidMatch = rfidData.match(/([0-9A-F]{2} ){6}[0-9A-F]{2}/);
    const uid = uidMatch ? uidMatch[0].trim() : null;

    if (uid) {
        // Recherchez la carte en fonction de l'UID dans la liste des UID
        const card = cardsData.cards.find(card => card.uid.includes(uid));
        if (card) {
            io.emit('rfidData', { readerID, card });
            console.log('Emitted card data:', { readerID, card });
        } else {
            io.emit('rfidData', { readerID, card: { name: 'Carte inconnue', image: '', description_vie: '', description_jeu: '' } });
            console.log('Emitted unknown card data for UID:', uid);
        }
    } else {
        console.log('No valid UID found in the data received.');
    }

    res.send('RFID data processed');
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
