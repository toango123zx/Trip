# TripFrontend

TripFrontend is the frontend application for the travel e-commerce platform.\
This project is built with **ReactJS (TypeScript)** and uses **Vite** for fast development.

This application connects to the **NestJS** backend and uses **PostgreSQL** as the database.

---

## 🚀 Installation

Follow these steps to set up and run the project locally:

### 1. Clone Repository

```bash
git clone https://github.com/toango123zx/Trip.git
cd Trip/tripFrontend
```

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Using yarn:

```bash
yarn install
```

Using pnpm:

```bash
pnpm install
```

### 3. Create .env File

Create a `.env` file at the root directory by copying from `.env.example`:

```bash
cp .env.example .env
```

Then update the environment variables if necessary.

Refer to the `.env.example` file for all required environment variables.

### 4. Run the Development Server

Using npm:

```bash
npm run dev
```

Using yarn:

```bash
yarn dev
```

Using pnpm:

```bash
pnpm dev
```

By default, the application will run at: [http://localhost:5173](http://localhost:5173)

---

## 📜 Scripts

| Command         | Description                        |
| --------------- | ---------------------------------- |
| npm run dev     | Start the development server       |
| npm run build   | Build the project for production   |
| npm run preview | Preview the production build       |
| npm run lint    | Check and fix linting issues       |

---

## 📂 Folder Structure

```plaintext
src/
 ├── assets/        # Static files (images, fonts, etc.)
 ├── components/    # Reusable UI components
 ├── features/      # Redux slices and business logic
 ├── pages/         # Pages corresponding to routes
 ├── routes/        # Route definitions
 ├── services/      # API interaction services
 ├── styles/        # TailwindCSS setup and global styles
 └── utils/         # Utility functions
```

---

## ✨ Code Quality

This project uses:

- ESLint for linting
- Prettier for code formatting
- TypeScript for static type checking

Run the following command to automatically fix linting issues:

```bash
npm run lint
```

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

When contributing, please:

- Follow the project's coding standards.
- Write clear and readable code.
- Update or add tests if necessary.

---

## 📄 License

MIT License

---

## ✍️ Author

Developed by **Ngô Văn Toàn**.

