# 🚀 RoadmapPro – System Zarządzania Projektami

Nowoczesna aplikacja webowa do zarządzania projektami, roadmapą oraz zadaniami w stylu systemów takich jak Jira. Umożliwia planowanie sprintów, organizację backlogu oraz śledzenie postępów zespołu w przejrzystym interfejsie Kanban.

---

## 📌 Opis projektu

**RoadmapPro** to aplikacja przeznaczona dla zespołów developerskich, startupów oraz project managerów, którzy chcą efektywnie planować i realizować projekty.

System umożliwia:
- Zarządzanie wieloma projektami
- Planowanie sprintów
- Tworzenie i organizowanie backlogu
- Pracę na tablicy Kanban
- Wizualizację roadmapy produktu w czasie (timeline)
- Kontrolę dostępu poprzez role użytkowników

Aplikacja wspiera metodyki Agile / Scrum oraz klasyczne podejście do zarządzania projektami.

---

## 🛠️ Stack technologiczny

### 🎨 Frontend
- React
- TypeScript
- REST API
- Context API / Redux (opcjonalnie)
- CSS Modules / Tailwind (opcjonalnie)

### ⚙️ Backend
- Node.js
- Express.js
- JWT (autoryzacja)
- REST API

### 🗄️ Baza danych
- PostgreSQL

---

## ✨ Główne funkcjonalności

### 📂 Projekty
- Tworzenie i edycja projektów
- Podgląd postępu projektu
- Zarządzanie backlogiem

### 🗓️ Sprinty
- Tworzenie sprintów
- Definiowanie dat rozpoczęcia i zakończenia
- Przypisywanie zadań do sprintu

### 🧩 Zadania (Task / Bug / Feature)
- Tworzenie i edycja zadań
- Priorytety (Low / Medium / High / Critical)
- Przypisywanie użytkowników
- Historia zmian
- Komentarze

### 📊 Tablica Kanban
- Statusy:
  - To Do
  - In Progress
  - Review
  - Done
- Drag & Drop
- Filtrowanie zadań

### 🗺️ Roadmap (Timeline)
- Widok osi czasu
- Planowanie milestone’ów
- Wizualizacja postępu funkcjonalności

### 🔐 Role i autoryzacja
- Rejestracja i logowanie (JWT)
- Role:
  - Admin
  - Project Manager
  - Developer
  - Viewer
- Ochrona endpointów backendowych
