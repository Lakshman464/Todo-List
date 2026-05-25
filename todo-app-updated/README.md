# ProjectFlow – Spring Boot + React Todo App

A full-stack project task manager with a Spring Boot REST API backend and React frontend.

## Architecture

```
todo-app/
├── backend/          ← Spring Boot (Java 17)
│   └── src/main/java/com/todo/
│       ├── model/        Project.java, Todo.java
│       ├── repository/   ProjectRepository, TodoRepository (JPA)
│       ├── service/      ProjectService, TodoService
│       └── controller/   ProjectController, TodoController (REST)
└── frontend/         ← React + Vite
    └── src/
        ├── App.jsx       All UI components
        └── main.jsx      Entry point
```

## Tech Stack

| Layer    | Tech                           |
|----------|-------------------------------|
| Backend  | Spring Boot 3.2, Spring Data JPA, Lombok |
| Database | H2 in-memory (auto-configured) |
| API      | RESTful JSON endpoints         |
| Frontend | React 18, Vite                 |
| Styling  | Inline CSS (zero dependencies) |

---

## Running the App

### 1. Start the Backend

**Requirements:** Java 17+, Maven

```bash
cd backend
./mvnw spring-boot:run
# or: mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

H2 console (dev): `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:tododb`
- User: `sa`, Password: _(empty)_

### 2. Start the Frontend

**Requirements:** Node.js 18+

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## REST API Reference

### Projects

| Method | Endpoint            | Description        |
|--------|--------------------|--------------------|
| GET    | /api/projects       | List all projects  |
| GET    | /api/projects/{id}  | Get one project    |
| POST   | /api/projects       | Create project     |
| PUT    | /api/projects/{id}  | Update project     |
| DELETE | /api/projects/{id}  | Delete project     |

### Todos

| Method | Endpoint                         | Description      |
|--------|----------------------------------|------------------|
| GET    | /api/projects/{id}/todos         | List todos       |
| POST   | /api/projects/{id}/todos         | Create todo      |
| GET    | /api/todos/{id}                  | Get one todo     |
| PUT    | /api/todos/{id}                  | Update todo      |
| PATCH  | /api/todos/{id}/toggle           | Toggle complete  |
| DELETE | /api/todos/{id}                  | Delete todo      |

### Example: Create a Project

```bash
curl -X POST http://localhost:8080/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"My Project","description":"Testing","color":"#7C6FFF"}'
```

### Example: Add a Todo

```bash
curl -X POST http://localhost:8080/api/projects/1/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Fix bug","priority":"HIGH","completed":false}'
```

---

## Features

- ✅ Create / edit / delete **projects** with custom colors
- ✅ Add / edit / delete / complete **tasks** per project
- ✅ Task **priority** levels (High / Medium / Low)
- ✅ Optional **due dates** with overdue highlighting
- ✅ Filter tasks: All / Active / Done
- ✅ Live **progress bar** per project
- ✅ Dark-themed UI

## Switching to PostgreSQL

Replace H2 in `pom.xml`:
```xml
<dependency>
  <groupId>org.postgresql</groupId>
  <artifactId>postgresql</artifactId>
  <scope>runtime</scope>
</dependency>
```

Update `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/tododb
spring.datasource.username=postgres
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
```
