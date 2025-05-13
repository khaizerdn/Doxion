#include <ESP8266WiFi.h>
#include <WiFiManager.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include <EEPROM.h>
#include <WiFiClient.h>

// Lock pin definitions
const int LOCK_PIN_A = 14;  // D5 - LockA
const int LOCK_PIN_B = 12;  // D6 - LockB
const int LOCK_PIN_C = 13;  // D7 - LockC
const int LOCK_PIN_D = 15;  // D8 - LockD

// LED pin definitions
const int LED_PIN_A = 4;   // D2  - LedA
const int LED_PIN_B = 5;   // D1  - LedB
const int LED_PIN_C = 0;   // D3  - LedC
const int LED_PIN_D = 2;   // D4  - LedD

// State tracking
volatile int lockStateA = LOW;
volatile int lockStateB = LOW;
volatile int lockStateC = LOW;
volatile int lockStateD = LOW;
volatile int ledStateA = LOW;
volatile int ledStateB = LOW;
volatile int ledStateC = LOW;
volatile int ledStateD = LOW;

// Web server instance
ESP8266WebServer server(80);

// Backend URL storage
char backendUrl[100];
const char* DEFAULT_BACKEND_URL = "http://192.168.1.100:5000";  // Adjust to your backend IP
WiFiManagerParameter customBackendUrl("backend", "Backend URL", backendUrl, 100);

// EEPROM address for storing backend URL
const int EEPROM_SIZE = 512;
const int EEPROM_URL_ADDR = 0;

// Generate unique AP name based on chip ID
String getUniqueAPName() {
    uint32_t chipId = ESP.getChipId();
    return String("ESP8266_" + String(chipId, HEX));
}

// Save backend URL to EEPROM
void saveBackendUrl() {
    EEPROM.begin(EEPROM_SIZE);
    for (int i = 0; i < strlen(backendUrl); i++) {
        EEPROM.write(EEPROM_URL_ADDR + i, backendUrl[i]);
    }
    EEPROM.write(EEPROM_URL_ADDR + strlen(backendUrl), '\0');
    EEPROM.commit();
    EEPROM.end();
    Serial.println("Saved backend URL to EEPROM: " + String(backendUrl));
}

// Load backend URL from EEPROM
void loadBackendUrl() {
    EEPROM.begin(EEPROM_SIZE);
    char tempUrl[100];
    int i = 0;
    char c = EEPROM.read(EEPROM_URL_ADDR + i);
    bool hasValidData = false;
    while (c != '\0' && i < 99) {
        tempUrl[i] = c;
        if (c != 0xFF) hasValidData = true;
        i++;
        c = EEPROM.read(EEPROM_URL_ADDR + i);
    }
    tempUrl[i] = '\0';

    if (hasValidData && i > 0) {
        strncpy(backendUrl, tempUrl, sizeof(backendUrl));
    } else {
        strncpy(backendUrl, DEFAULT_BACKEND_URL, sizeof(backendUrl));
        saveBackendUrl();
    }
    backendUrl[sizeof(backendUrl) - 1] = '\0';
    EEPROM.end();
    Serial.println("Loaded backend URL: " + String(backendUrl));
}

// Send device info to backend (4 rows with prefixed device names)
void sendDeviceInfoToBackend() {
    if (WiFi.status() != WL_CONNECTED) return;

    WiFiClient client;
    HTTPClient http;
    String url = String(backendUrl) + "/api/espdetected";
    String baseDeviceName = getUniqueAPName(); // e.g., "ESP8266_82768d"
    String ipAddress = WiFi.localIP().toString();
    const char* prefixes[] = {"A_", "B_", "C_", "D_"};
    const char* locks[] = {"LockA", "LockB", "LockC", "LockD"};
    const char* leds[] = {"LedA", "LedB", "LedC", "LedD"};

    for (int i = 0; i < 4; i++) {
        String deviceName = String(prefixes[i]) + baseDeviceName; // e.g., "A_ESP8266_82768d"

        Serial.print("Sending to backend - Device: ");
        Serial.print(deviceName);
        Serial.print(", IP: ");
        Serial.print(ipAddress);
        Serial.print(", Lock: ");
        Serial.print(locks[i]);
        Serial.print(", LED: ");
        Serial.println(leds[i]);

        http.begin(client, url);
        http.addHeader("Content-Type", "application/json");

        String jsonPayload = "{\"deviceName\":\"" + deviceName + "\",\"ipAddress\":\"" + ipAddress + "\",\"locks\":\"" + locks[i] + "\",\"leds\":\"" + leds[i] + "\"}";
        int httpCode = http.POST(jsonPayload);

        if (httpCode > 0) {
            Serial.println("Device info sent to backend. Response code: " + String(httpCode));
        } else {
            Serial.println("Failed to send device info: " + String(http.errorToString(httpCode)));
        }
        http.end();
        delay(100);  // Small delay between requests
    }
}

// Clear WiFi credentials and reset backend URL
void clearWiFiCredentials() {
    WiFiManager wifiManager;
    wifiManager.resetSettings();
    strncpy(backendUrl, DEFAULT_BACKEND_URL, sizeof(backendUrl));
    backendUrl[sizeof(backendUrl) - 1] = '\0';
    saveBackendUrl();
    delay(1000);
    ESP.restart();
}

// Handle root webpage
void handleRoot() {
    String page = "<html><body style='text-align:center;font-family:Arial;'>";
    page += "<h1>ESP8266 Control - " + getUniqueAPName() + "</h1>";
    
    page += "<p>Lock A (GPIO14): " + String(lockStateA ? "ON" : "OFF") + "</p>";
    page += "<p>Lock B (GPIO12): " + String(lockStateB ? "ON" : "OFF") + "</p>";
    page += "<p>Lock C (GPIO13): " + String(lockStateC ? "ON" : "OFF") + "</p>";
    page += "<p>Lock D (GPIO15): " + String(lockStateD ? "ON" : "OFF") + "</p>";
    page += "<p>Led A (GPIO4): " + String(ledStateA ? "ON" : "OFF") + "</p>";
    page += "<p>Led B (GPIO5): " + String(ledStateB ? "ON" : "OFF") + "</p>";
    page += "<p>Led C (GPIO0): " + String(ledStateC ? "ON" : "OFF") + "</p>";
    page += "<p>Led D (GPIO2): " + String(ledStateD ? "ON" : "OFF") + "</p>";
    page += "<p>Backend URL: " + String(backendUrl) + "</p>";
    
    page += "<p>";
    page += "<a href='/LockA'><button style='margin:5px;'>Lock A</button></a>";
    page += "<a href='/LockB'><button style='margin:5px;'>Lock B</button></a>";
    page += "<a href='/LockC'><button style='margin:5px;'>Lock C</button></a>";
    page += "<a href='/LockD'><button style='margin:5px;'>Lock D</button></a>";
    page += "</p>";
    page += "<p>";
    page += "<a href='/LedA'><button style='margin:5px;'>Toggle Led A</button></a>";
    page += "<a href='/LedA/on'><button style='margin:5px;background:green;color:white;'>Led A ON</button></a>";
    page += "<a href='/LedA/off'><button style='margin:5px;background:red;color:white;'>Led A OFF</button></a>";
    page += "</p>";
    page += "<p>";
    page += "<a href='/LedB'><button style='margin:5px;'>Toggle Led B</button></a>";
    page += "<a href='/LedB/on'><button style='margin:5px;background:green;color:white;'>Led B ON</button></a>";
    page += "<a href='/LedB/off'><button style='margin:5px;background:red;color:white;'>Led B OFF</button></a>";
    page += "</p>";
    page += "<p>";
    page += "<a href='/LedC'><button style='margin:5px;'>Toggle Led C</button></a>";
    page += "<a href='/LedC/on'><button style='margin:5px;background:green;color:white;'>Led C ON</button></a>";
    page += "<a href='/LedC/off'><button style='margin:5px;background:red;color:white;'>Led C OFF</button></a>";
    page += "</p>";
    page += "<p>";
    page += "<a href='/LedD'><button style='margin:5px;'>Toggle Led D</button></a>";
    page += "<a href='/LedD/on'><button style='margin:5px;background:green;color:white;'>Led D ON</button></a>";
    page += "<a href='/LedD/off'><button style='margin:5px;background:red;color:white;'>Led D OFF</button></a>";
    page += "</p>";
    
    page += "<hr>";
    page += "<p>";
    page += "<a href='/reset'><button style='background:red;color:white;margin:5px;'>Restart ESP</button></a>";
    page += "<a href='/reset-wifi'><button style='background:orange;color:white;margin:5px;'>Reset & Clear WiFi</button></a>";
    page += "</p>";
    
    page += "</body></html>";
    
    server.send(200, "text/html", page);
}

// Handle ESP reset
void handleReset() {
    server.send(200, "text/html", "Restarting ESP8266...");
    delay(1000);
    ESP.restart();
}

// Handle WiFi reset
void handleResetWiFi() {
    server.send(200, "text/html", "WiFi credentials cleared! Restarting...");
    clearWiFiCredentials();
}

void setup() {
    Serial.begin(115200);
    delay(10);

    // Initialize pins
    pinMode(LOCK_PIN_A, OUTPUT);
    pinMode(LOCK_PIN_B, OUTPUT);
    pinMode(LOCK_PIN_C, OUTPUT);
    pinMode(LOCK_PIN_D, OUTPUT);
    pinMode(LED_PIN_A, OUTPUT);
    pinMode(LED_PIN_B, OUTPUT);
    pinMode(LED_PIN_C, OUTPUT);
    pinMode(LED_PIN_D, OUTPUT);

    digitalWrite(LOCK_PIN_A, LOW);
    digitalWrite(LOCK_PIN_B, LOW);
    digitalWrite(LOCK_PIN_C, LOW);
    digitalWrite(LOCK_PIN_D, LOW);
    digitalWrite(LED_PIN_A, LOW);
    digitalWrite(LED_PIN_B, LOW);
    digitalWrite(LED_PIN_C, LOW);
    digitalWrite(LED_PIN_D, LOW);

    // Load saved backend URL from EEPROM
    loadBackendUrl();

    // Initialize WiFiManager with unique AP name
    WiFiManager wifiManager;
    String apName = getUniqueAPName();
    char apNameChar[32];
    apName.toCharArray(apNameChar, 32);

    customBackendUrl.setValue(backendUrl, 100);
    wifiManager.addParameter(&customBackendUrl);

    wifiManager.setSaveConfigCallback([]() {
        strncpy(backendUrl, customBackendUrl.getValue(), sizeof(backendUrl));
        backendUrl[sizeof(backendUrl) - 1] = '\0';
        saveBackendUrl();
        Serial.println("New backend URL saved: " + String(backendUrl));
    });

    if (!wifiManager.autoConnect(apNameChar)) {
        Serial.println("Failed to connect, restarting...");
        delay(3000);
        ESP.restart();
    }

    if (strcmp(backendUrl, customBackendUrl.getValue()) != 0) {
        strncpy(backendUrl, customBackendUrl.getValue(), sizeof(backendUrl));
        backendUrl[sizeof(backendUrl) - 1] = '\0';
        saveBackendUrl();
    }

    Serial.println("Connected to WiFi!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    Serial.print("Device ID: ");
    Serial.println(apName);
    Serial.print("Backend URL: ");
    Serial.println(backendUrl);

    // Send device info to backend after connection
    sendDeviceInfoToBackend();

    // Setup server routes
    server.on("/", handleRoot);
    server.on("/reset", handleReset);
    server.on("/reset-wifi", handleResetWiFi);

    // Lock routes
    server.on("/LockA", []() {
        digitalWrite(LOCK_PIN_A, HIGH);
        delay(1000);
        digitalWrite(LOCK_PIN_A, LOW);
        lockStateA = LOW;
        handleRoot();
    });

    server.on("/LockB", []() {
        digitalWrite(LOCK_PIN_B, HIGH);
        delay(1000);
        digitalWrite(LOCK_PIN_B, LOW);
        lockStateB = LOW;
        handleRoot();
    });

    server.on("/LockC", []() {
        digitalWrite(LOCK_PIN_C, HIGH);
        delay(1000);
        digitalWrite(LOCK_PIN_C, LOW);
        lockStateC = LOW;
        handleRoot();
    });

    server.on("/LockD", []() {
        digitalWrite(LOCK_PIN_D, HIGH);
        delay(1000);
        digitalWrite(LOCK_PIN_D, LOW);
        lockStateD = LOW;
        handleRoot();
    });

    // LED Toggle routes (kept for manual control)
    server.on("/LedA", []() {
        ledStateA = !ledStateA;
        digitalWrite(LED_PIN_A, ledStateA);
        handleRoot();
    });

    server.on("/LedB", []() {
        ledStateB = !ledStateB;
        digitalWrite(LED_PIN_B, ledStateB);
        handleRoot();
    });

    server.on("/LedC", []() {
        ledStateC = !ledStateC;
        digitalWrite(LED_PIN_C, ledStateC);
        handleRoot();
    });

    server.on("/LedD", []() {
        ledStateD = !ledStateD;
        digitalWrite(LED_PIN_D, ledStateD);
        handleRoot();
    });

    // LED ON routes
    server.on("/LedA/on", []() {
        ledStateA = HIGH;
        digitalWrite(LED_PIN_A, HIGH);
        handleRoot();
    });

    server.on("/LedB/on", []() {
        ledStateB = HIGH;
        digitalWrite(LED_PIN_B, HIGH);
        handleRoot();
    });

    server.on("/LedC/on", []() {
        ledStateC = HIGH;
        digitalWrite(LED_PIN_C, HIGH);
        handleRoot();
    });

    server.on("/LedD/on", []() {
        ledStateD = HIGH;
        digitalWrite(LED_PIN_D, HIGH);
        handleRoot();
    });

    // LED OFF routes
    server.on("/LedA/off", []() {
        ledStateA = LOW;
        digitalWrite(LED_PIN_A, LOW);
        handleRoot();
    });

    server.on("/LedB/off", []() {
        ledStateB = LOW;
        digitalWrite(LED_PIN_B, LOW);
        handleRoot();
    });

    server.on("/LedC/off", []() {
        ledStateC = LOW;
        digitalWrite(LED_PIN_C, LOW);
        handleRoot();
    });

    server.on("/LedD/off", []() {
        ledStateD = LOW;
        digitalWrite(LED_PIN_D, LOW);
        handleRoot();
    });

    server.begin();
    Serial.println("Web server started!");
}

void loop() {
    server.handleClient();
}