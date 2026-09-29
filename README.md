# MYWA — Munsyari Youth Welfare Association

**A community platform empowering the youth of Munsyari through education, libraries, mentorship, and opportunity.**

🔗 **Live:** [wywa.vercel.app](https://wywa.vercel.app)

![Lighthouse Score](https://img.shields.io/badge/Lighthouse-98%2F96%2F96%2F100-brightgreen)
![Made with React](https://img.shields.io/badge/Frontend-React-blue)
![Made with Node](https://img.shields.io/badge/Backend-Node.js-green)

---

## About

MYWA (Munsyari Youth Welfare Association) is a live, full-stack community platform built to connect the youth of Munsyari — a remote Himalayan region in Uttarakhand — with education, library resources, career guidance, and a supportive community network, "so that no young dream is left behind."

The platform serves three types of users:
- **Students** — access libraries, track attendance, view achievements, and raise help-desk issues
- **Admins** — manage students, library inventory, notice boards, attendance, and community achievements
- **Think-Tank members** — mentors/coordinators with their own dashboard and profile space

---

## Key Features

- 🔐 **Role-based authentication** (student, admin, think-tank) with JWT access + refresh tokens
- ⚡ **Real-time notifications** via Socket.IO for admin/student updates
- 📚 **Library management** — inventory tracking and book issue/return system
- 📊 **Attendance tracking** with visual charts
- 🏆 **Achievements showcase** — a "Wall of Fame" with scroll-triggered animations and mouse-tracking glow effects
- 📩 **Password reset flow** powered by Brevo's HTTP email API
- 🎨 **Polished, animated UI** — Framer Motion transitions throughout, plus a custom GSAP-powered intro loader with letter-by-letter 3D flip animations and an animated mountain skyline
- 🕉️ **Hindi-language storytelling** on the About page, with scroll-triggered timeline animations
- 📱 **Fully responsive**, mobile-first design
- 🚀 **Lighthouse-optimized** — 95+ scores across Performance, Accessibility, Best Practices, and SEO on both desktop and mobile

---

## Tech Stack

**Frontend**
- React (Vite)
- Redux Toolkit
- Tailwind CSS
- Framer Motion
- GSAP

**Backend**
- Node.js + Express
- MongoDB
- Socket.IO
- JWT (access + refresh token auth)

**Infrastructure & Services**
- Deployment: Vercel (frontend) + Render (backend)
- Email: Brevo HTTP API
- Image hosting/optimization: ImageKit

---

## Screenshots


<img width="1600" height="900" alt="Screenshot (325)" src="https://github.com/user-attachments/assets/6da7a1bd-2afe-41ed-bc50-3793fd573fbb" />      <img width="1600" height="900" alt="Screenshot (326)" src="https://github.com/user-attachments/assets/dd0d64ef-0330-4133-b489-2a378478e2f5" />
<img width="1600" height="900" alt="Screenshot (327)" src="https://github.com/user-attachments/assets/d51d0922-1493-4183-ac3d-6daa800c7549" />
<img width="1600" height="900" alt="Screenshot (323)" src="https://github.com/user-attachments/assets/3b29c2aa-5e2d-4e9b-8483-6d7ba912760f" />
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/munnarawat/MYWA.git
cd MYWA

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Variables

Create a `.env` file in the backend directory with the following:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
BREVO_API_KEY=your_brevo_api_key
SENDER_EMAIL=your_verified_sender_email
FRONTEND_URL=http://localhost:5173
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

Create a `.env` file in the frontend directory with:

```env
VITE_API_URL=http://localhost:3000/api
```

### Running Locally

```bash
# Start backend (from /backend)
npm run dev

# Start frontend (from /frontend)
npm run dev
```

---

## Challenges & Solutions

Building and shipping MYWA to production surfaced several real-world engineering problems:

**1. Refresh-token race condition causing premature logouts**
Concurrent requests were triggering simultaneous token-refresh attempts, invalidating sessions unexpectedly. Resolved by ensuring refresh calls are properly sequenced/deduplicated.

**2. Socket.IO room mismatch breaking real-time notifications**
Admin notifications weren't reaching clients due to a mismatch between the room names clients joined and the rooms the server emitted to. Fixed by aligning room-naming logic on both ends.

**3. Email delivery breaking in production**
The password-reset email flow worked locally but failed silently on Render's free tier. Investigation traced it to Render blocking outbound SMTP connections over IPv6 (`ENETUNREACH` errors even after forcing IPv4). Rather than continuing to fight the SMTP layer, the flow was migrated to **Brevo's HTTP API**, which sends over HTTPS and sidesteps the SMTP restriction entirely — with no custom domain required.

**4. Performance optimization**
Initial Lighthouse performance scores were held back by render-blocking Google Fonts and unoptimized images. Fixed by:
- Switching font loading to a non-blocking `preload` + `onload` pattern
- Removing a duplicate/broken font `@import` in the global stylesheet
- Serving compressed, correctly-sized WebP images via ImageKit
- Preloading the hero image for a faster LCP

Result: Lighthouse scores went from the 60s to consistently 95+ across all four categories, on both desktop and mobile.

---

## Contact

- **GitHub:** [github.com/munnarawat](https://github.com/munnarawat)
- **Live Project:** [wywa.vercel.app](https://wywa.vercel.app)

---

## License

This project is licensed under the MIT License.
