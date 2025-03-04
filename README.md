# Backend Habit Tracker App
University of London - Agile Course - Backend of the Habit Tracker App

---

## Table of Contents

1. [Prerequisites](#prerequisites)  
2. [Installation](#installation)  
3. [Environment Variables](#environment-variables)  
4. [Running the Project](#running-the-project)  
5. [API Endpoints (Optional)](#api-endpoints-optional)  
6. [Contributing](#contributing)  
7. [License](#license)  

---

## Prerequisites

- **Node.js 18** (or higher)
- **npm** (bundled with Node 18)
- **MongoDB** (local or remote)
- A `.env` file for sensitive credentials (detailed below)

---

## Installation

1. **Clone** this repository:
   ```bash
   git clone https://github.com/YourUsername/YourRepo.git
   cd YourRepo

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. Ensure you have **MongoDB** running locally or have credentials for a remote MongoDB instance.

---

## Environment Variables

Create a file named **`.env`** in the project root. It **must** include the following variables:

```bash
DB_USERNAME=yourMongoDBUsername
DB_PASSWORD=yourMongoDBPassword
```

> You can also add any other variables your application needs (e.g., `PORT=3000`, `JWT_SECRET=someSecret`), but be sure **not** to commit your `.env` file to version control.

---

## Running the Project

### Development Mode

```bash
npm run dev
```

- Starts the server in development mode (using nodemon or a similar tool).  
- By default, it may run on **`http://localhost:3000`** (or the port you configure).

### Production Build

```bash
npm run build
npm start
```

- **`npm run build`**: Builds or compiles (if applicable) your Node.js app.  
- **`npm start`**: Runs the compiled code in production mode.

---

## API Endpoints (Optional)

> If your backend has REST endpoints or GraphQL queries, document them here.

**Example**:

| Method | Endpoint         | Description               |
|--------|------------------|---------------------------|
| GET    | `/api/users`     | Retrieve all users       |
| POST   | `/api/users`     | Create a new user        |
| GET    | `/api/users/:id` | Retrieve a user by ID    |
| PUT    | `/api/users/:id` | Update a user            |
| DELETE | `/api/users/:id` | Delete a user            |

---

## Contributing

1. **Fork** the repository  
2. Create a **feature branch** (`git checkout -b feature/my-feature`)  
3. **Commit** your changes (`git commit -m 'Add some feature'`)  
4. **Push** to the branch (`git push origin feature/my-feature`)  
5. Create a **Pull Request** on GitHub

---

## License

Specify the license under which your project is distributed (e.g., **MIT**, **Apache 2.0**, etc.). For example:

```
MIT License
```

---

### Final Notes

- Always keep **`.env`** in your **`.gitignore`** to avoid committing secrets.