# 🚀 Fuel Stock Management System (Frontend)

## Overview
This is the **React + Vite** frontend for the **Fuel Stock Management System**.
It provides a modern, light-blue themed dashboard, login interface, and CRUD modules for managing stock, sales, and deliveries.

---

## 🧩 Tech Stack
- ⚛️ **React 18 + Vite**
- 🎨 **Tailwind CSS v4**
- 🌀 **Framer Motion** (animations)
- 🧭 **Lucide React** (icons)
- 🔗 **Axios** (API calls)
- ☁️ **Vercel** (recommended for deployment)

---

## 🧱 Project Setup

### 1️⃣ Clone the Repository
```bash
git clone <repo-url>
cd fuel-stock-ui
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Run Locally
```bash
npm run dev
```
> Open your browser at **http://localhost:5173**

---

## 🎨 Styling

Tailwind v4 is used with modern import syntax:
```css
@import "tailwindcss";
```

### Color Palette (`src/theme.css`)
```css
:root {
  --midnight: #03045E;
  --ocean: #0077B6;
  --aqua: #00B4D8;
  --breeze: #90E0EF;
  --ice: #CAF0F8;
}
```

---

## 🔐 Authentication
- Simple login page (JWT-based)
- Calls Flask backend endpoint `/auth/login`
- Token saved in `localStorage`
- Protected routes planned for next phase

---

## 📊 Pages
### 1. **Login**
- Blue gradient background
- Responsive centered card
- Clean modern form with animations

### 2. **Dashboard**
- Light blue themed layout
- Sidebar navigation
- KPI cards (Sales, Stock, Variance)
- Tanks stock table
- Recent activity feed

---

## 📁 Folder Structure
```
src/
 ┣ components/
 ┣ pages/
 ┣ router/
 ┣ services/
 ┣ styles/
 ┣ main.jsx
 ┗ App.jsx
```

---

## 🚀 Deployment (Vercel)
1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com).
3. Import your repo.
4. Set root to `/`.
5. Deploy 🚀

---

## 🧠 Notes
- Built for **Tailwind v4.1.16**
- Compatible with Flask backend API.
- Change the API base URL in:
  ```js
  src/services/api.js
  ```
- Example:
  ```js
  export default axios.create({
    baseURL: "http://localhost:5000/api",
  });
  ```

---

© 2025 Fuel Stock Management System | UI Design by Geethika Sewwandi
