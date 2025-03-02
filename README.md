# 🧾 Invoice Management Backend - Express + TypeScript + TypeORM

This project is a REST API for managing clients, products, and invoices, developed using Express, TypeORM, and PostgreSQL. It includes ESLint, Prettier, Husky, and Jest for code quality and GitHub Actions for automatic deployment to AWS Lambda.

---

# 📂 Project Structure

```bash
backend-invoices
┣ src/
┃ ┣ config/                   # Configuration files
┃ ┃ ┣ database.ts             # TypeORM and PostgreSQL configuration
┃ ┃ ┗ env.ts                  # Environment variable loading
┃ ┣ clients/                  # Clients module
┃ ┃ ┣ clients.controller.ts    # Clients HTTP routes controller
┃ ┃ ┣ clients.service.ts       # Business logic
┃ ┃ ┣ client.entity.ts         # Clients data model
┃ ┃ ┗ validations/             # ✅ Validations specific to clients
┃ ┃   ┗ client.ts
┃ ┣ products/                  # Products module
┃ ┃ ┣ products.controller.ts   # Products HTTP routes controller
┃ ┃ ┣ products.service.ts      # Business logic
┃ ┃ ┣ product.entity.ts        # Products data model
┃ ┃ ┗ validations/             # ✅ Validations specific to products
┃ ┃   ┗ product.ts
┃ ┣ invoices/                  # Invoices module
┃ ┃ ┣ invoices.controller.ts   # Invoices HTTP routes controller
┃ ┃ ┣ invoices.service.ts      # Business logic
┃ ┃ ┣ invoice.entity.ts        # Invoice model
┃ ┃ ┣ invoice-item.entity.ts   # Invoice items model
┃ ┃ ┗ validations/             # ✅ Validations specific to invoices
┃ ┃   ┗ invoice.ts
┃ ┣ tests/                     # Unit and integration tests
┃ ┣ app.ts                     # Express server configuration
┃ ┣ routes.ts                  # Centralized routes
┃ ┣ shared/                     # Shared resources
┃ ┃ ┣ middlewares/             # Global middlewares
┃ ┃ ┃ ┣ error.ts     # Global error handler middleware
┃ ┃ ┃ ┗ validate.ts  # Middleware for request validation
┃ ┃ ┗ utils/                   # Shared utility functions
┣ .github/workflows/           # GitHub Actions workflows
┣ .dockerignore                # ignore docker build
┣ .env                         # Environment variables
┣ .gitignore                   # ignore some files unnecessary
┣ .jest.config.js              # Jest configuration
┣ tsconfig.json                # TypeScript configuration
┣ yarn.lock                    # Yarn dependency file
┣ package.json                 # Project configuration and scripts
┗ README.md                    # Project documentation

```

---

# 🚀 Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/backend-invoices.git
cd backend-invoices
```

## 2️⃣ Install Dependencies

```bash
yarn
```

or

```bash
npm install

```

## 3️⃣ Configure Environment Variables

    Create a .env file in the root directory and define the following variables:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=user
DB_PASSWORD=password
DB_NAME=payana

# Server Configuration
PORT=3000

```

---

# 🏗️ Running the Project

## 1️⃣ Start the Development Mode

```bash
yarn dev
```

or

```bash
npm run dev
```

## 2️⃣ Compile and Run in Production

```bash

yarn build
yarn start

```

or

```bash
npm run build
npm run start
```

---

# 🐳 Running with Docker

## 1️⃣ Build and Run the Application

```bash
docker compose up --build -d
```

📌 This will start PostgreSQL and the Node.js API inside Docker containers.

## 2️⃣ Stop the Containers

```bash
docker compose down
```

## 3️⃣ Check Running Containers

```bash
docker ps
```

---

# 📌 Running Tests

## 1️⃣ Install Jest and Supertest

```bash
yarn add -D jest supertest ts-jest @types/jest @types/supertest
```

or

```bash
npm install -D jest supertest ts-jest @types/jest @types/supertest
```

## 2️⃣ Run Tests

```bash
yarn test
```

or

```bash
npm run test
```

For test coverage:

```bash
yarn test  --coverage
```

or

```bash
npm run test  --coverage
```

---

👨‍💻 Developed by [Milton Hernandez](https://www.linkedin.com/in/andres-hc/) - 2025 🚀
