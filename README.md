# MiniTwitter

## Beschreibung

MiniTwitter ist eine einfache Social-Media-Webanwendung, bei der Benutzer:

* Beiträge erstellen
* Kommentare schreiben
* Beiträge liken oder disliken
* Inhalte bearbeiten und löschen können


---

## Technologien

* Node.js
* Express
* TypeScript
* MariaDB
* HTML, CSS, JavaScript
* Docker

---

## Installation (lokal)

1. Repository herunterladen
2. Abhängigkeiten installieren:

npm install

---

## Starten der Anwendung (lokal)

npm run dev

Danach im Browser öffnen:

http://localhost:4200

---

## Starten mit Docker

Die Anwendung kann komplett mit Docker gestartet werden:

docker compose up --build

Danach erreichbar unter:

* App: http://localhost:4200
* phpMyAdmin: http://localhost:9200

---

## Features

* Registrierung und Login
* Beiträge erstellen, bearbeiten und löschen
* Kommentare erstellen und löschen
* Like / Dislike System
* Anzeige von Benutzernamen
* Rollenbasierte Berechtigungen

---

## Datenbank

* MariaDB wird verwendet
* Tabellen werden automatisch beim Start erstellt
* Verbindung erfolgt über Umgebungsvariablen

---

## Hinweise

* Backend läuft auf Port 4200
* Frontend ist in reinem JavaScript umgesetzt
* Docker startet alle benötigten Services (App + Datenbank + phpMyAdmin)
