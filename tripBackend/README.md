<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
  <a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
</p>

---

## 📖 Description

This repository provides a TypeScript-based application starter powered by the [NestJS](https://nestjs.com) framework. The project integrates PostgreSQL as the database and includes tools to simplify setup and deployment, such as Docker support.

---

## ⚙️ Features

- **NestJS**: Scalable and efficient server-side application framework.
- **Database**: PostgreSQL support for reliable data handling.
- **Configuration**: Environment variables managed via `.env`.
- **Docker**: Simplified containerization with `docker-compose`.

---

## 🛠️ Prerequisites

Ensure the following are installed on your system:

- [Node.js](https://nodejs.org/) (version 22.1.0)
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) (optional for containerized deployment)
- PostgreSQL (optional if using Docker)

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/toango123zx/Trip.git
cd Trip
```

### Step 2: Install Dependencies

```bash
pnpm install
```

### Step 3: Configure Environment Variables

- Create a `.env` file at the root of the project (or refer to an existing `.env.example`).
- Define necessary variables such as:
    ```env
    DATABASE_URL=postgresql://username:password@localhost:5432/your_database
    PORT=3000
    ```

---

## 💻 Running the Application

### Locally (Without Docker)

1. **Set up the database**:
    - Apply the database schema:
        ```bash
        pnpm db:push
        ```
2. **Start the development server**:
    ```bash
    pnpm start:dev
    ```

### With Docker

1. Ensure Docker is installed and running.
2. Run the services:
    ```bash
    docker-compose up
    ```
3. Access the application at `http://localhost:3000` (or the port specified in `.env`).

---

## 📂 Project Structure

- `src/` - Application source code.
- `test/` - Contains unit and e2e tests.
- `prisma/` - Database schema and migration files.
- `docker-compose.yml` - Docker configuration for containerized deployment.

---

## 🛠️ Available Commands

- **Run locally**:
    ```bash
    pnpm start:dev
    ```
- **Run tests**:
    ```bash
    pnpm test
    ```
- **Apply database schema**:
    ```bash
    pnpm db:push
    ```
- **Generate dto**:
    ```bash
    db:generate-dto
    ```
- **Build for production**:
    ```bash
    pnpm build
    ```

---

## 🧑‍💻 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 🌐 Contact

- **Author**: [Your Name](https://yourwebsite.com)
- **GitHub**: [Your GitHub Profile](https://github.com/your-username)
- **Twitter**: [@yourhandle](https://twitter.com/yourhandle)
