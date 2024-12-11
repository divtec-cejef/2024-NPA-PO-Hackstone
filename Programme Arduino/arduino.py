import serial
import requests

# Configuration du port série et du débit en bauds
serial_port = 'COM4'  # Modifiez ceci avec votre port série réel
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

            # Envoyer les données au serveur 1
            response_1 = requests.post(server_url_1, data=data)
            if response_1.status_code == 200:
                print(f"Data sent successfully to server 1. Response: {response_1.text}")
            else:
                print(f"Failed to send data to server 1. Status: {response_1.status_code}")

            # Envoyer les données au serveur 2
            response_2 = requests.post(server_url_2, data=data)
            if response_2.status_code == 200:
                print(f"Data sent successfully to server 2. Response: {response_2.text}")
            else:
                print(f"Failed to send data to server 2. Status: {response_2.status_code}")

            # Envoyer les données au serveur 3
            response_3 = requests.post(server_url_3, data=data)
            if response_3.status_code == 200:
                print(f"Data sent successfully to server 3. Response: {response_3.text}")
            else:
                print(f"Failed to send data to server 3. Status: {response_3.status_code}")

except KeyboardInterrupt:
    print("Programme interrompu manuellement.")
finally:
    ser.close()
    print("Connexion série fermée.")