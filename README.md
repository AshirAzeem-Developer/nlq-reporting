# 📊 E-commerce NLQ Reporting

> **Natural Language Querying for E-commerce Data**  
> _Powered by Next.js 16, Google Gemini AI, and TailwindCSS._

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![React](https://img.shields.io/badge/React-19.0-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8)

## 🚀 Overview

**E-commerce NLQ Reporting** is a powerful tool that allows users to query their e-commerce database using natural language. Instead of writing complex SQL queries, simply ask questions like _"What is the total revenue from paid orders?"_ or _"Show me the top 5 best-selling products"_, and the system will generate the SQL, execute it, and present the results instantly.

Built with modern web technologies, this project leverages **Google's Generative AI** to translate natural language into precise SQL queries, making data analysis accessible to everyone.

## ✨ Key Features

- **🗣️ Natural Language Querying**: Ask questions in plain English and get data-driven answers.
- **🤖 AI-Powered SQL Generation**: Uses Google Gemini AI to intelligently construct SQL queries based on your database schema.
- **📁 Schema Awareness**: Upload your database schema to give the AI context about your specific data structure.
- **📊 Instant Visualization**: View results in clean, formatted tables with automatic data formatting (dates, currency, booleans).
- **💡 Smart Suggestions**: Includes built-in example queries to help you get started.
- **🔍 Transparent Debugging**: View the generated SQL and raw AI responses to understand how your data is being retrieved.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/)
- **AI Model**: [Google Generative AI (Gemini)](https://ai.google.dev/)
- **Database Support**: MySQL / PostgreSQL (via `mysql2` and `pg`)
- **Language**: TypeScript

## 📦 Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/AshirAzeem-Developer/nlq-reporting.git
    cd nlq-reporting
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory and add your API keys and database credentials:

    ```env
    GOOGLE_API_KEY=your_google_gemini_api_key
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=password
    DB_NAME=dashboarddb
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

5.  **Open the app:**
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

1.  **Upload Schema**: Navigate to the **Upload Schema** section to provide your database structure (CREATE TABLE statements). This helps the AI understand your data.
2.  **Ask a Question**: Type your question in the search bar (e.g., _"How many orders were placed last week?"_).
3.  **View Results**: The system will display the generated SQL, a brief explanation, and the data results in a table.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
