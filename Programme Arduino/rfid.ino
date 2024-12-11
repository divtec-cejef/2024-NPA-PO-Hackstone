#include <SPI.h>
#include <MFRC522.h>
#define RST_PIN 22

// Define the SS (Slave Select) pins for each RFID sensor
const int SS_PINS[] = {23, 24, 25, 26, 27, 28, 29};
const int NR_OF_READERS = sizeof(SS_PINS) / sizeof(SS_PINS[0]);

MFRC522 rfid[NR_OF_READERS];  // Array to hold the RFID sensor objects

void setup() {
  Serial.begin(9600);
  SPI.begin();

   // Initialize each RFID sensor
  for (int i = 0; i < NR_OF_READERS; i++) {
    rfid[i] = MFRC522(SS_PINS[i], RST_PIN);
    rfid[i].PCD_Init();
    
    // Debug message to confirm initialization
    Serial.print("Lecteur RFID ");
    Serial.print(i + 1);
    Serial.println(" initialisé.");
  }
  
  Serial.println("Tous les scanners RFID sont prêts.");
}

void loop() {
  for (int i = 0; i < NR_OF_READERS; i++) {
    // Enable the current reader
    digitalWrite(SS_PINS[i], LOW);
    
    // Debug message to check which reader is being accessed
    if (rfid[i].PICC_IsNewCardPresent() && rfid[i].PICC_ReadCardSerial()) {
      Serial.print("UID de la carte (RFID ");
      Serial.print(i + 1);
      Serial.print(") : ");
      delay(1);
      for (byte j = 0; j < rfid[i].uid.size; j++) {
        Serial.print(rfid[i].uid.uidByte[j] < 0x10 ? " 0" : " ");
        Serial.print(rfid[i].uid.uidByte[j], HEX);
        delay(1);
      }
      Serial.println();
      rfid[i].PICC_HaltA(); // Halt the current card
    } 
    // Disable the current reader
    digitalWrite(SS_PINS[i], HIGH);
  }
}