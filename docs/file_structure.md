<!-- ROOT-File_Sturcuture -->
nihongo-talk-trainer/
├── frontend/
├── backend/
├── docs/
└── README.md

<!-- Frontend file structure (рекомендуемая) -->

nihongo-talk-trainer/
├── app/                          # App Router (Next.js 13+)
│   ├── (auth)/                   # Auth-related routes group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx            # Optional: auth layout without main navigation
│   │
│   ├── (app)/                    # Main authenticated app routes group
│   │   ├── dashboard/            # Home / Dashboard
│   │   │   └── page.tsx
│   │   │
│   │   ├── dialogs/              # List of dialog scenarios
│   │   │   └── page.tsx
│   │   │
│   │   ├── training/             # Training session
│   │   │   ├── [id]/             # Dynamic route for specific dialog
│   │   │   │   └── page.tsx      # Main training screen (chat, voice, evaluation)
│   │   │   └── page.tsx          # Optional: training intro or selection
│   │   │
│   │   ├── history/              # Learning history
│   │   │   └── page.tsx
│   │   │
│   │   ├── admin/                # Admin panel (protected)
│   │   │   ├── scenarios/
│   │   │   │   ├── page.tsx      # List of scenarios
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx  # Add new scenario
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx  # Edit scenario
│   │   │   └── page.tsx          # Admin dashboard
│   │   │
│   │   └── layout.tsx            # Main layout with navbar, footer, etc.
│   │
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout (html, body, providers)
│   ├── page.tsx                  # Landing / home page (redirect to login or dashboard)
│   └── not-found.tsx             # 404 page
│
├── components/                   # Reusable UI components
│   ├── ui/                       # Shadcn/ui or custom primitive components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   └── ...
│   │
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── LanguageSwitcher.tsx
│   │
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   │
│   ├── dialog/
│   │   ├── DialogCard.tsx        # Card in scenario list
│   │   ├── ChatBubble.tsx        # Message bubble in training chat
│   │   ├── VoiceRecorder.tsx     # Mic button + recording logic
│   │   ├── PronunciationScore.tsx # Score display + feedback
│   │   └── TextToSpeechButton.tsx
│   │
│   ├── history/
│   │   ├── HistoryTable.tsx
│   │   └── ProgressChart.tsx
│   │
│   └── admin/
│       ├── ScenarioForm.tsx      # Shared form for add/edit
│       └── ScenarioList.tsx


<!-- Backend file structure (рекомендуемая) -->

backend/
├── src/
│   ├── app.ts                # создание express app
│   ├── server.ts             # запуск сервера
│   │
│   ├── config/
│   │   ├── env.ts            # env variables
│   │   └── db.ts             # prisma client
│   │
│   ├── modules/              # domain-based структура
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.routes.ts
│   │   │
│   │   ├── users/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   └── user.routes.ts
│   │   │
│   │   ├── dialogs/
│   │   │   ├── dialog.controller.ts
│   │   │   ├── dialog.service.ts
│   │   │   └── dialog.routes.ts
│   │   │
│   │   ├── progress/
│   │   │   ├── progress.controller.ts
│   │   │   ├── progress.service.ts
│   │   │   └── progress.routes.ts
│   │   │
│   │   └── ai/
│   │       ├── ai.controller.ts
│   │       ├── ai.service.ts
│   │       └── ai.routes.ts
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts   # JWT check
│   │   └── error.middleware.ts  # error handling
│   │
│   ├── utils/
│   │   ├── jwt.ts
│   │   └── hash.ts              # password hashing
│   │
│   └── routes.ts                # объединение всех роутов
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
