import serial
import requests

# Configuration du port série et du débit en bauds
serial_port = 'COM3'  # Modifiez ceci avec votre port série réel
baud_rate = 9600  # Débit en bauds commun pour l'Arduino

try:
    ser = serial.Serial(serial_port, baud_rate)

    while True:
        # Lire une ligne depuis l'Arduino
        rfid_data = ser.readline().decode('utf-8').strip()
        print(f"RFID Data Read: {rfid_data}")

        if "Lecteur RFID" not in rfid_data:
            # Extraire les données RFID
            readerID = rfid_data.split(":")[0].split()[-1].strip()  # Par exemple, "1" ou "2"
            uid = rfid_data.split(":")[-1].strip()

            # Préparer les données pour la requête POST
            data = {'rfid_data': f"{readerID}:{uid}"}

            # URL des deux serveurs
            server_url_1 = 'http://localhost:3000/send_rfid_data'  # Plateau Attaque
            server_url_2 = 'http://localhost:3001/send_rfid_data'  # Plateau Défense
            server_url_3 = 'http://localhost:3003/send_rfid_data'  # Information d'une carte

            server_urls = [server_url_1, server_url_2, server_url_3]
            for i, server_url in enumerate(server_urls, start=1):
                response = requests.post(server_url, data=data)
                status = "réussi" if response.status_code == 200 else "raté"
                print(f"Données envoyé : {status} : au serveur {i}. Status : {response.status_code}, Réponse : {response.text}")

except KeyboardInterrupt:
    print("Programme interrompu manuellement.")
finally:
    ser.close()
    print("Connexion série fermée.")