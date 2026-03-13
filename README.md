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

---

## 🖥️ Uruchomienie lokalne

### Wymagania wstępne
- [Node.js](https://nodejs.org/) (v18+)
- npm (instalowany razem z Node.js)
- [Docker](https://www.docker.com/) (zalecany do uruchomienia bazy danych) **lub** lokalnie zainstalowany [PostgreSQL](https://www.postgresql.org/) (v14+)

### 1. Sklonuj repozytorium

```bash
git clone https://github.com/Wojtek1601/roadmapa.git
cd roadmapa
```

### 2. Uruchom bazę danych PostgreSQL

#### Opcja A — Docker (zalecana)

Upewnij się, że [Docker](https://www.docker.com/) jest zainstalowany i uruchomiony, a następnie:

```bash
docker compose up -d
```

Polecenie uruchomi kontener PostgreSQL w tle na porcie `5432`.
Dane logowania (zgodne z plikiem `.env.example`):
- użytkownik: `user`
- hasło: `password`
- baza danych: `roadmapa`

> Aby zatrzymać bazę: `docker compose down`
> Aby zatrzymać i usunąć dane: `docker compose down -v`

#### Opcja B — lokalny PostgreSQL

Jeśli masz PostgreSQL zainstalowany lokalnie, upewnij się że serwer działa i utwórz bazę danych:

```bash
createdb roadmapa
```

> Jeśli baza już istnieje, polecenie zwróci błąd — możesz go zignorować.

### 3. Zainstaluj zależności

```bash
cd server
npm install
```

### 4. Skonfiguruj zmienne środowiskowe

Skopiuj plik `.env.example` i dostosuj do swoich ustawień:

```bash
cp .env.example .env
```

Jeśli korzystasz z Dockera (Opcja A), plik `.env` nie wymaga zmian — domyślne wartości są zgodne z `docker-compose.yml`.

Jeśli korzystasz z lokalnego PostgreSQL (Opcja B), edytuj `DATABASE_URL` w pliku `.env`, podmieniając `user` i `password` na dane logowania do swojej bazy:

```env
DATABASE_URL="postgresql://TWOJ_USER:TWOJE_HASLO@localhost:5432/roadmapa?schema=public"
```

> Dla środowiska produkcyjnego wygeneruj silny `JWT_SECRET`, np.:
> ```bash
> openssl rand -base64 32
> ```

### 5. Skonfiguruj bazę danych

Wygeneruj klienta Prisma i uruchom migracje:

```bash
npm run prisma:generate
npm run prisma:migrate
```

> **Uwaga:** Jeśli ten krok kończy się błędem `P1001: Can't reach database server at localhost:5432`, upewnij się, że baza PostgreSQL jest uruchomiona (patrz krok 2).

### 6. Uruchom serwer deweloperski

```bash
npm run dev
```

Serwer wystartuje domyślnie pod adresem `http://localhost:3000`.

Możesz sprawdzić czy działa, odwiedzając endpoint health check:

```bash
curl http://localhost:3000/api/health
# Oczekiwana odpowiedź: {"status":"ok"}
```

### 7. Uruchom testy

```bash
npm test
```

### 8. Build produkcyjny (opcjonalnie)

```bash
npm run build
npm start
```

---

## 📡 Endpointy API

| Metoda | Endpoint | Autoryzacja | Opis |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Nie | Rejestracja nowego użytkownika |
| POST | `/api/auth/login` | Nie | Logowanie |
| GET | `/api/auth/me` | Tak (JWT) | Pobranie danych zalogowanego użytkownika |
| POST | `/api/auth/projects/:projectId/roles` | Tak (ADMIN) | Przypisanie roli użytkownikowi w projekcie |
| GET | `/api/health` | Nie | Sprawdzenie statusu serwera |
