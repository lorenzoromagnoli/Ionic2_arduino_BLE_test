#include <CurieBLE.h>
#include <Adafruit_NeoPixel.h>


BLEPeripheral blePeripheral; // create peripheral instance
BLEService ledStripService("19B10010-E8F2-537E-4F6C-D104768A1214"); // create service

// create switch characteristic and allow remote device to read and write
BLECharacteristic color_Characteristic("19B10011-E8F2-537E-4F6C-D104768A1214", BLERead | BLEWrite, 3);
BLEDescriptor lampDescriptor("2902", "lamp");


#define PIN            6
#define NUMPIXELS      24


int green;
int red;
int blue;
Adafruit_NeoPixel ring = Adafruit_NeoPixel(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800 + NEO_KHZ800);


void setup() {
  Serial.begin(9600);

  // set the local name peripheral advertises
  blePeripheral.setLocalName("ledStrip");
  // set the UUID for the service this peripheral advertises:
  blePeripheral.setAdvertisedServiceUuid(ledStripService.uuid());

  // add service and characteristics
  blePeripheral.addAttribute(ledStripService);
  blePeripheral.addAttribute(color_Characteristic);
  blePeripheral.addAttribute(lampDescriptor);

  // advertise the service
  blePeripheral.begin();

  Serial.println("Bluetooth device active, waiting for connections...");

  // assign event handlers for connected, disconnected to peripheral
  blePeripheral.setEventHandler(BLEConnected, blePeripheralConnectHandler);
  blePeripheral.setEventHandler(BLEDisconnected, blePeripheralDisconnectHandler);
  color_Characteristic.setEventHandler(BLEWritten, color_CharacteristicWritten);

  ring.begin();
}

void loop() {

}

void color_CharacteristicWritten(BLECentral& central, BLECharacteristic& characteristc) {
  const unsigned char* colors = color_Characteristic.value();
  red = colors[0];
  green = colors[1];
  blue = colors[2];
  
  Serial.print(colors[0]);
  Serial.print("-");
  Serial.print(colors[1]);
  Serial.print("-");
  Serial.println(colors[2]);

  for (int i = 0; i < NUMPIXELS; i++) {
    ring.setPixelColor( i, ring.Color(red, green, blue));
  }
  ring.show();
}

void blePeripheralConnectHandler(BLECentral& central) {
  // central connected event handler
  Serial.print("Connected event, central: ");
  Serial.println(central.address());
}

void blePeripheralDisconnectHandler(BLECentral& central) {
  // central disconnected event handler
  Serial.print("Disconnected event, central: ");
  Serial.println(central.address());
}


