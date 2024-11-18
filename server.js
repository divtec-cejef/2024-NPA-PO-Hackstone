const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

/**
 * Serveur 1: Le défenseur
 */
const app1 = express();

// Pour app1
app1.use(cors({
    origin: 'http://localhost:3001' // Autorise l'origine sur le port 3001
}));

const server1 = http.createServer(app1);

const io1 = socketIo(server1, {
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"]
    }
});

app1.use(bodyParser.urlencoded({ extended: true }));
app1.use(bodyParser.json());

// Servir les fichiers statiques
app1.use(express.static(path.join(__dirname, 'dist/plateauDefense')));

// Servir plateauDefense.html pour le port 3001 (server 1)
app1.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/plateauDefense', 'plateauDefense.html'));
});

let cardsData = JSON.parse(fs.readFileSync('cards.json', 'utf8'));

io1.on('connection', (socket) => {
    console.log('User connected on server 1');
    socket.on('rfidData', (data) => {
        console.log('RFID data received via WebSocket:', data);
        const [readerID, uid] = data.split(':').map(item => item.trim());
        const card = cardsData.cards.find(card => card.uid === uid);
        if (card) {
            io1.emit('rfidData', { readerID, card });
            console.log('Emitted card data:', { readerID, card, uid });
        } else {
            io1.emit('rfidData', { readerID, card: { name: 'Carte inconnue', image: '', description_vie: '', description_jeu: '' } });
            console.log('Emitted unknown card data for UID:', uid);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected from server 1');
    });
});

app1.post('/send_rfid_data', (req, res) => {
    const rfidData = req.body.rfid_data;
    console.log('Data received from Python:', rfidData);
    const parts = rfidData.split(':');
    const readerID = parts[0].trim();
    const uidMatch = rfidData.match(/([0-9A-F]{2} ){6}[0-9A-F]{2}/);
    const uid = uidMatch ? uidMatch[0].trim() : null;

    if (uid) {
        const card = cardsData.cards.find(card => card.uid.includes(uid));
        if (card) {
            io1.emit('rfidData', { readerID, card, uid });
            console.log('Emitted card data:', { readerID, card, uid });
        } else {
            io1.emit('rfidData', { readerID, card: { name: 'Carte inconnue', image: '', description_vie: '', description_jeu: '' } });
            console.log('Emitted unknown card data for UID:', uid);
        }
    } else {
        console.log('No valid UID found in the data received.');
    }

    res.send('RFID data processed');
});

// Écoute sur le port 3001 pour le plateauDefense
server1.listen(3001, () => {
    console.log('Server 1 listening on *:3001 (plateauDefense)');
});

/**
 * Serveur 2: L'attaquant
 */

const app2 = express();

// Pour app2
app2.use(cors({
    origin: 'http://localhost:3000' // Autorise l'origine sur le port 3000
}));

const server2 = http.createServer(app2);

const io2 = socketIo(server2, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app2.use(bodyParser.urlencoded({ extended: true }));

app2.use(bodyParser.json());

app2.use(express.static(path.join(__dirname, 'dist/plateauAttaque')));

// Servir plateauAttaque.html pour le port 3000 (server 2)
app2.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/plateauAttaque', 'plateauAttaque.html'));
});

io2.on('connection', (socket) => {
    console.log('User connected on server 2');
    socket.on('rfidData', (data) => {
        const [readerID, uid] = data.split(':').map(item => item.trim());
        const card = cardsData.cards.find(card => card.uid === uid);
        if (card) {
            io2.emit('rfidData', { readerID, card });
            console.log('Emitted card data:', { readerID, card });
        } else {
            io2.emit('rfidData', { readerID, card: { name: 'Carte inconnue', image: '', description_vie: '', description_jeu: '' } });
            console.log('Emitted unknown card data for UID:', uid);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected from server 2');
    });
});

app2.post('/send_rfid_data', (req, res) => {
    const rfidData = req.body.rfid_data;
    console.log('Data received from Python:', rfidData);
    const parts = rfidData.split(':');
    const readerID = parts[0].trim();
    const uidMatch = rfidData.match(/([0-9A-F]{2} ){6}[0-9A-F]{2}/);
    const uid = uidMatch ? uidMatch[0].trim() : null;

    if (uid) {
        const card = cardsData.cards.find(card => card.uid.includes(uid));
        if (card) {
            io2.emit('rfidData', { readerID, card, uid });
            console.log('Emitted card data:', { readerID, card });
        } else {
            io2.emit('rfidData', { readerID, card: { name: 'Carte inconnue', image: '', description_vie: '', description_jeu: '' } });
            console.log('Emitted unknown card data for UID:', uid);
        }
    } else {
        console.log('No valid UID found in the data received.');
    }

    res.send('RFID data processed');
});


// Écoute sur le port 3000 pour le plateauAttaque
server2.listen(3000, () => {
    console.log('Server 2 listening on *:3000 (plateauAttaque)');
});

/**
 * Serveur 3: l'information des cartes
 */

const app3 = express();

// Pour app2
app3.use(cors({
    origin: 'http://localhost:3003' // Autorise l'origine sur le port 3000
}));

const server3 = http.createServer(app3);

const io3 = socketIo(server3, {
    cors: {
        origin: "http://localhost:3003",
        methods: ["GET", "POST"]
    }
});

app3.use(bodyParser.urlencoded({ extended: true }));

app3.use(bodyParser.json());

app3.use(express.static(path.join(__dirname, 'dist/informationCarte')));

// Servir plateauAttaque.html pour le port 3000 (server 2)
app3.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/informationCarte', 'infoCarte.html'));
});

io3.on('connection', (socket) => {
    console.log('User connected on server 3');
    socket.on('rfidData', (data) => {
        const [readerID, uid] = data.split(':').map(item => item.trim());
        const card = cardsData.cards.find(card => card.uid === uid);
        if (card) {
            io3.emit('rfidData', { readerID, card });
            console.log('Emitted card data:', { readerID, card });
        } else {
            io3.emit('rfidData', { readerID, card: { name: 'Carte inconnue', image: '', description_vie: '', description_jeu: '' } });
            console.log('Emitted unknown card data for UID:', uid);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected from server 3');
    });
});

app3.post('/send_rfid_data', (req, res) => {
    const rfidData = req.body.rfid_data;
    console.log('Data received from Python:', rfidData);
    const parts = rfidData.split(':');
    const readerID = parts[0].trim();
    const uidMatch = rfidData.match(/([0-9A-F]{2} ){6}[0-9A-F]{2}/);
    const uid = uidMatch ? uidMatch[0].trim() : null;

    if (uid) {
        const card = cardsData.cards.find(card => card.uid.includes(uid));
        if (card) {
            io3.emit('rfidData', { readerID, card });
            console.log('Emitted card data:', { readerID, card });
        } else {
            io3.emit('rfidData', { readerID, card: { name: 'Carte inconnue', image: '', description_vie: '', description_jeu: '' } });
            console.log('Emitted unknown card data for UID:', uid);
        }
    } else {
        console.log('No valid UID found in the data received.');
    }

    res.send('RFID data processed');
});


// Écoute sur le port 3003 pour les infos de la carte
server3.listen(3003, () => {
    console.log('Server 3 listening on *:3003 (infoCarte)');
});