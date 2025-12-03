# 📊 AI-Powered NLQ Reporting

> **Natural Language Querying for Any Database**  
> _Powered by Next.js 16, Google Gemini AI, and TailwindCSS._

![Banner](/banner.png)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![React](https://img.shields.io/badge/React-19.0-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8)

## 🚀 Overview

**NLQ Reporting** is a versatile, general-purpose tool that allows users to query **any relational database** using natural language. Whether you are managing e-commerce data, HR records, financial logs, or inventory systems, this tool bridges the gap between raw data and actionable insights.

Simply upload your database schema, and the system uses **Google's Generative AI** to intelligently understand your data structure. You can then ask questions in plain English—like _"Show me the top performing employees"_ or _"Calculate total sales for Q4"_—and the system will generate the precise SQL, execute it, and present the results instantly.

## ✨ Key Features

- **🌍 Universal Database Support**: Works with any database schema. Just upload your `CREATE TABLE` statements, and the AI adapts instantly.
- **🗣️ Natural Language Querying**: Ask questions in plain English and get data-driven answers without writing a single line of SQL.
- **🤖 AI-Powered SQL Generation**: Leverages Google Gemini AI to construct accurate SQL queries tailored to your specific schema.
- **📊 Instant Visualization**: Results are presented in clean, formatted tables with automatic handling of dates, currency, and booleans.
- **💡 Smart Context Awareness**: The AI understands relationships between your tables (foreign keys, joins) to answer complex multi-table questions.
- **🔍 Transparent Debugging**: View the generated SQL and raw AI responses to verify accuracy and understand the logic.

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
    git clone https://github.com/yourusername/nlq-reporting.git
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
    DB_NAME=your_database_name
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

5.  **Open the app:**
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

1.  **Upload Schema**: Navigate to the **Upload Schema** section. Paste your database's `CREATE TABLE` statements. This is the critical step that teaches the AI about your specific data structure.
2.  **Ask a Question**: Type your question in the search bar.
    - _Example (E-commerce):_ "What is the total revenue from paid orders?"
    - _Example (HR):_ "List all employees hired after 2023."
    - _Example (Inventory):_ "Which items are low on stock?"
3.  **View Results**: The system will display the generated SQL, a brief explanation, and the data results in a table.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
