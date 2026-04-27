# 📡 Content Broadcasting System (Backend)

A backend system that allows teachers to upload subject-based content, principals to approve/reject it, and students to access live rotating content via public APIs.

---

## 🚀 Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MySQL
* **ORM:** Sequelize
* **Authentication:** JWT (JSON Web Token)
* **File Upload:** Multer
* **Security:** bcrypt (password hashing)

---

## ⚙️ Setup Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Rajnish2000/content-broadcast-system
cd content-broadcast-system
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000

DB_NAME=content_db
DB_USER=root
DB_PASS=yourpassword
DB_HOST=localhost

JWT_SECRET=secret123

CLOUDINARY_CLOUD_NAME=cloudinary_cloud_name
CLOUDINARY_API_KEY=Cloudinary_api_key
CLOUDINARY_API_SECRET=Cloudinary_secret
```

---

### 4. Setup Database (MySQL)

Login to MySQL and create database:

```sql
CREATE DATABASE content_db;
```

---

### 5. Run the Server

```bash
npx nodemon src/app.js
```

Server will start at:

```
http://localhost:5000
```

---

## 🔐 API Usage

---

### 🔑 Authentication APIs

#### Register User

```
POST /auth/register
```

**Body (JSON):**

```json
{
  "name": "Teacher One",
  "email": "teacher@test.com",
  "password": "123456",
  "role": "teacher"
}
```

---

#### Login

```
POST /auth/login
```

**Response:**

```json
{
  "token": "JWT_TOKEN"
}
```

---

### 📤 Content APIs (Teacher)

#### Upload Content

```
POST /content/upload
```

**Headers:**

```
Authorization: Bearer <token>
```

**Body:** `form-data`

| Key            | Type | Value                |
| -------------- | ---- | -------------------- |
| file           | File | (image file)         |
| title          | Text | Algebra Basics       |
| subject        | Text | maths                |
| description    | Text | Sample description   |
| start_time     | Text | 2026-04-26T10:00:00Z |
| end_time       | Text | 2026-04-26T18:00:00Z |
| slot_id        | Text | 1                    |
| rotation_order | Text | 1                    |
| duration       | Text | 5                    |

---

#### Get My Content

```
GET /content/all
```

---

### 🏫 Approval APIs (Principal)

#### Get Pending Content

```
GET /content/pending
```

---

#### Approve Content

```
POST /content/:id/approve
```

---

#### Reject Content

```
POST /content/:id/reject
```

**Body:**

```json
{
  "reason": "Invalid content"
}
```

---

### 🌐 Public API

#### Get Live Content (by Teacher)

```
GET /content/live/:teacherId
```

---

#### With Subject Filter

```
GET /content/live/:teacherId?subject=maths
```

---

## 🔁 Scheduling Logic

* Content is grouped by **slot_id (subject-based rotation)**
* Each content has:

  * `rotation_order`
  * `duration` (in minutes)
* System calculates:

  * Current time
  * Determines active content using rotation loop
* Only content within `start_time` and `end_time` is shown

---

## ⚠️ Edge Cases Handled

* No approved content → `"No content available"`
* Content outside time window → excluded
* Invalid subject → returns empty response
* No schedule defined → excluded

---

## 🔒 Security

* JWT-based authentication
* Role-based access control (RBAC)
* Password hashing using bcrypt
* Protected routes for teacher/principal actions
* No sensitive data exposure

---

## 📂 Project Structure

```
src/
 ├── controllers/
 ├── routes/
 ├── services/
 ├── middlewares/
 ├── models/
 ├── utils/
 ├── config/
 └── app.js
```

---

## 📌 Notes

* File uploads stored locally in `/uploads`
* Only JPG, PNG, GIF allowed (max 10MB)
* Scheduling is strictly time-based

---

## 🚀 Future Improvements

* Cloudinary file storage
* Subject-wise analytics

---

### 🤞 swagger url

```bash
   https://content-broadcast-system-tr9n.onrender.com/api-docs/
```

----

### 🤞 deployment url

```bash
   https://content-broadcast-system-tr9n.onrender.com
```

## 👨‍💻 Author

Rajnish Singh
