# Real Estate Contract App

A web application for creating, managing, and signing real estate contracts.

## Features

- **Dashboard**: View all contracts and their status.
- **Create Contract**: Fill out forms based on templates.
- **Templates**: Manage contract templates (JSON structure).
- **Printing**: Print blank forms or completed contracts.
- **Digital Signing**: Send a link to tenants to sign digitally.
- **Export**: Export contract data to CSV.

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Database Setup**:
    The project uses SQLite.
    ```bash
    npx prisma migrate dev
    npx prisma db seed
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

-   Next.js 15 (App Router)
-   Tailwind CSS v4
-   Prisma (SQLite)
-   TypeScript
