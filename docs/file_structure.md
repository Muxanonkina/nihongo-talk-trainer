# Nihongo Talk Trainer - File Structure

## Root Structure

```
nihongo-talk-trainer/
├── frontend/              # Next.js frontend application
├── backend/               # Express.js backend API
├── docs/                  # Project documentation
├── .gitignore
└── README.md
```

---

## Frontend Structure (Actual)

```
frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── login/
│   │   │   └── page.tsx              # Login page
│   │   │
│   │   ├── register/
│   │   │   └── page.tsx              # Registration page
│   │   │
│   │   ├── dialogs/
│   │   │   └── page.tsx              # Dialog scenarios list
│   │   │
│   │   ├── training/
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Training session (dynamic route)
│   │   │
│   │   ├── history/
│   │   │   └── page.tsx              # User progress history
│   │   │
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Home/landing page
│   │
│   ├── components/
│   │   ├── ui/                       # Shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   └── select.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   └── auth/
│   │       ├── LoginForm.tsx
│   │       ├── RegisterForm.tsx
│   │       │
│   │       └── dialog/               # Dialog-related components
│   │           ├── ChatBubble.tsx
│   │           ├── DialogCard.tsx
│   │           └── VoiceRecorder.tsx
│   │
│   └── lib/
│       ├── axios.ts                  # API client configuration
│       └── utils.ts                  # Utility functions
│
├── public/                           # Static assets
├── certificates/                     # SSL certificates (for HTTPS)
├── components.json                   # Shadcn/ui configuration
├── next.config.ts
├── tsconfig.json
├── package.json
└── .env                              # Environment variables (gitignored)
```

---

## Backend Structure (Actual)

```
backend/
├── src/
│   ├── app.ts                        # Express app setup
│   ├── server.ts                     # Server entry point
│   │
│   ├── config/
│   │   └── db.ts                     # Prisma client instance
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.routes.ts
│   │   │
│   │   ├── dialog/
│   │   │   ├── dialog.controller.ts
│   │   │   └── dialog.routes.ts
│   │   │
│   │   └── userprogress/
│   │       ├── userprogress.controller.ts
│   │       ├── userprogress.service.ts
│   │       └── userprogress.routes.ts
│   │
│   ├── middlewares/
│   │   └── auth.middleware.ts        # JWT authentication
│   │
│   ├── utils/
│   │   └── jwt.ts                    # JWT utilities
│   │
│   └── scripts/                      # Utility scripts
│
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── migrations/                   # Database migrations
│
├── dist/                             # Compiled TypeScript output
├── package.json
├── tsconfig.json
└── .env                              # Environment variables (gitignored)
```

---

## Key Differences from Recommended Structure

### Frontend
- ❌ No route groups `(auth)` and `(app)` - using flat structure
- ❌ No `dashboard` page yet
- ❌ No `admin` panel yet
- ✅ Dialog components located in `components/auth/dialog/` instead of `components/dialog/`

### Backend
- ❌ No `users` module (user logic in `auth` module)
- ❌ No `ai` module yet
- ❌ No `error.middleware.ts` yet
- ❌ No `hash.ts` utility (using bcryptjs directly)
- ❌ No centralized `routes.ts` file
- ✅ Module named `userprogress` instead of `progress`
- ✅ Some modules missing `.service.ts` files (logic in controllers)

---

## Environment Variables

### Frontend (.env)
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api  # Backend API URL
```

### Backend (.env)
```bash
DATABASE_URL=postgresql://...                   # PostgreSQL connection string
JWT_SECRET=your-secret-key                      # JWT signing key
PORT=5000                                       # Server port
```
