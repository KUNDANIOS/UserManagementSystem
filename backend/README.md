# Authra 🔐

A secure **Node.js + Express + MongoDB** backend application implementing **JWT Authentication** and **Role-Based Access Control (RBAC)**. This project is designed as a scalable authentication system suitable for real-world applications.

---

## 🚀 Features

* User Registration & Login
* Password Hashing using **bcryptjs**
* JWT-based Authentication
* Role-Based Authorization (**Admin / User**)
* Protected Routes with Middleware
* MongoDB with Mongoose ODM
* Environment Variable Configuration
* Developer-friendly Folder Structure

---

## 🛠️ Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB Atlas**
* **Mongoose**
* **JWT (jsonwebtoken)**
* **bcryptjs**
* **dotenv**
* **nodemon**

---

## 📁 Project Structure

```
backend/
│── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   └── app.js
│── .env
│── .gitignore
│── package.json
│── server.js
```

---

## 🔑 User Model (Highlights)

* Name (required, max 50 chars)
* Email (unique, validated)
* Password (hashed)
* Role (admin / user)

---

## 🔐 Authentication Flow

1. User registers with email & password
2. Password is hashed using bcrypt
3. JWT token is generated on login
4. Token is verified via middleware
5. Role middleware restricts admin routes

---

## ▶️ How to Run Locally

### 1️⃣ Clone Repository

```bash
git clone https://github.com/KUNDANIOS/authra.git
cd authra/backend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup Environment Variables

Create a `.env` file in `backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4️⃣ Start Development Server

```bash
npm run dev
```

Server will run on:

```
http://localhost:5000
```

---

## 🔒 Protected Routes Example

* `/api/auth/register` – Public
* `/api/auth/login` – Public
* `/api/admin/users` – Admin only

---

## 📌 Future Enhancements

* Refresh Tokens
* Email Verification
* Password Reset
* Rate Limiting
* Audit Logs

---

## 👨‍💻 Author

**Kundan Kumar Yadav**
GitHub: [https://github.com/KUNDANIOS](https://github.com/KUNDANIOS)
LinkedIn: [https://linkedin.com/in/kundan-kumar-y](https://linkedin.com/in/kundan-kumar-y)

---

## ⭐ If you like this project

Give it a ⭐ on GitHub — it motivates further development!




