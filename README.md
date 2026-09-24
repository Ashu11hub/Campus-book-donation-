<div align="center">

# 📚 Campus Book Donation

### Give your old books a new home. Help juniors, reduce waste, build community.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-campus--book--donation.vercel.app-2D6A4F?style=for-the-badge)](https://campus-book-donation.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Ashu11Hub/Campus-book-donation-)

![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

</div>

---

## 🎯 The Problem

Every semester, thousands of students across India finish their courses and are left with **stacks of textbooks they'll never open again**. These books:

- Sit in hostel rooms collecting dust
- Get sold to scrap dealers for ₹10-20/kg
- End up in landfills

Meanwhile, **juniors desperately need those exact books** but can't afford to buy new ones every semester.

## 💡 The Solution

**Campus Book Donation** is a free platform that connects students who want to donate their old study material with juniors who need them — no money involved, just kindness.

Instead of throwing books away, students list them on the platform. Juniors browse, request, and pick them up on campus. **Zero cost, zero waste, maximum impact.**

---

## ✨ Features

### 🔐 Authentication
- Email & Password login with bcrypt hashing
- Google OAuth 2.0 single sign-on
- Persistent JWT sessions with NextAuth

### 📖 Book Management
- Upload up to 5 images per book (Cloudinary integration)
- Rich metadata: title, author, subject, branch, semester, condition
- Three donation types: **Free**, **Exchange**, or **Low Price**
- Real-time availability status

### 🔍 Discovery
- Advanced filtering: branch, semester, city, donation type
- Full-text search across title, author, and subject
- Beautiful grid layout with hover effects

### 🤝 Request System
- Send request with custom message to donor
- Donor dashboard to accept/decline requests
- Auto-rejection of competing requests when one is accepted
- Mark as "Handed Over" for completed donations

### 👤 User Dashboard
- **My Listings** — manage donated books
- **Requests Received** — accept/reject incoming requests
- **My Requests** — track outgoing requests
- Editable profile with college, city, branch details

### 🎨 UI/UX
- Custom design system (warm cream + emerald green)
- Smooth page transitions and micro-animations (Framer Motion)
- Fully responsive (mobile, tablet, desktop)
- Loading skeletons, empty states, toast notifications

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Database** | MongoDB Atlas |
| **ODM** | Mongoose |
| **Authentication** | NextAuth.js (Google OAuth + Credentials) |
| **Image Storage** | Cloudinary |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Validation** | Zod |
| **Forms** | React Hook Form |
| **Deployment** | Vercel |
| **Version Control** | Git + GitHub |

---

## 📸 Screenshots

### 🏠 Landing Page
![Landing Page](https://i.imgur.com/placeholder1.png)

### 📚 Browse Books
![Browse Books](https://i.imgur.com/placeholder2.png)

### 📖 Book Details
![Book Details](https://i.imgur.com/placeholder3.png)

### 📊 Dashboard
![Dashboard](https://i.imgur.com/placeholder4.png)

> *Add screenshots by uploading to Imgur and replacing the URLs above.*

---


```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
campus-books/
├── src/
│   ├── app/
│   │   ├── api/                    # Backend API routes
│   │   │   ├── auth/               # NextAuth endpoints
│   │   │   ├── books/              # Book CRUD
│   │   │   ├── requests/           # Request handling
│   │   │   ├── upload/             # Cloudinary upload
│   │   │   ├── profile/            # User profile
│   │   │   └── register/           # User registration
│   │   ├── book/[id]/              # Book detail page
│   │   ├── browse/                 # Browse books
│   │   ├── dashboard/              # User dashboard
│   │   ├── list-book/              # Donate a book
│   │   ├── login/                  # Login page
│   │   ├── register/               # Signup page
│   │   ├── profile/                # User profile
│   │   └── my-requests/            # Sent requests
│   ├── components/
│   │   ├── ui/                     # shadcn components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── AuthProvider.tsx
│   ├── lib/
│   │   ├── mongodb.ts              # DB connection
│   │   ├── auth.ts                 # NextAuth config
│   │   └── cloudinary.ts           # Cloudinary config
│   ├── models/
│   │   ├── User.ts
│   │   ├── Book.ts
│   │   └── Request.ts
│   └── types/
│       └── next-auth.d.ts
├── public/
│   └── hero-illustration.png
└── ...
```

---

## 🎨 Design System

| Element | Value |
|---------|-------|
| **Primary** | `#2D6A4F` (Emerald Green) |
| **Background** | `#F7F5F2` (Warm Cream) |
| **Accent** | `#D97706` (Amber) |
| **Font** | Plus Jakarta Sans |
| **Radius** | 0.875rem – 1.25rem |
| **Shadows** | Soft layered shadows |

---

## 🔒 Security

- Passwords hashed with **bcrypt** (10 rounds)
- JWT-based sessions with signed cookies
- Protected API routes via **getServerSession**
- Owner-only operations (delete/edit books, accept requests)
- Environment variables never committed (`.gitignore`)
- MongoDB Atlas IP whitelist + dedicated DB user

---

## 🌟 What Makes This Project Special

1. **Real-world problem** — solves an actual pain point for Indian students
2. **Full-stack** — auth, database, file uploads, REST APIs, UI/UX
3. **Production-ready** — deployed on Vercel with MongoDB Atlas
4. **Modern stack** — Next.js 14 App Router, TypeScript, Tailwind
5. **Polished UI** — custom design system, smooth animations, responsive
6. **Clean code** — modular structure, reusable components, typed everything

---

## 🚧 Future Enhancements

- [ ] Real-time chat between donor and requester (Socket.io)
- [ ] Email notifications for new requests
- [ ] Ratings & reviews for donors
- [ ] Book wishlist feature
- [ ] Admin panel for moderation
- [ ] Progressive Web App (PWA) support

---

## 👨‍💻 Author

**Ashutosh Sharma**

- GitHub: [@Ashu11Hub](https://github.com/Ashu11Hub)
- Live Project: [campus-book-donation.vercel.app](https://campus-book-donation.vercel.app)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

### ⭐ If you found this project helpful, please give it a star!

**Built with ❤️ for students, by a student.**

</div>