# Sajhi Shiksha — Free Study Materials for KVS Students

> Sharing Knowledge — From You, For You

A modern, fast, and accessible educational resource platform built for KVS (Kendriya Vidyalaya) students and teachers. Provides free study materials, question papers, formats, and learning resources for classes 1-12.

## 🌐 Live Demo

[Visit Sajhi Shiksha](https://www.sajhishiksha.in)

## ✨ Features

- **📚 Comprehensive Resources** — Study materials for Classes 1-12 across all subjects
- **🔍 Advanced Search & Filters** — Filter by class, subject, and resource type
- **🌗 Dark/Light Mode** — Theme toggle with persistent preferences
- **📱 Fully Responsive** — Works on mobile, tablet, and desktop
- **♿ Accessible** — WCAG 2.1 compliant with keyboard navigation
- **⚡ Fast Performance** — Optimized bundle with code splitting and lazy loading
- **🎨 Neo-Brutalist Design** — Bold, playful UI that students love

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19 + TypeScript |
| Routing | TanStack Router |
| UI Components | MUI Material v9 |
| Styling | TailwindCSS v4 + Emotion |
| Animations | Framer Motion |
| Build Tool | Vite 8 |
| Deployment | Vercel |

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Icons/           # Shared icon registry
│   │   ├── Skeletons/       # Page-specific skeleton loaders
│   │   ├── Header/          # Site header with navigation
│   │   ├── Footer/          # Site footer
│   │   ├── BottomTabBar/    # Mobile navigation
│   │   └── ...              # Other components
│   ├── features/            # Feature-specific modules
│   │   ├── home/            # Homepage components
│   │   ├── resources/       # Resource listing pages
│   │   ├── search/          # Search functionality
│   │   ├── viewer/          # Document viewer
│   │   ├── about/           # About page
│   │   └── contribute/      # Contribute page
│   ├── routes/              # TanStack Router route definitions
│   ├── data/                # Static JSON data files
│   ├── hooks/               # Custom React hooks
│   ├── context/             # React context providers
│   ├── lib/                 # Utilities and constants
│   └── types/               # TypeScript type definitions
├── public/                  # Static assets
├── vercel.json              # Vercel deployment configuration
├── vite.config.ts           # Vite build configuration
└── package.json             # Project dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+ or pnpm 8+

### Installation

```bash
# Clone the repository
git clone https://github.com/aditya452007/sajhi-shiksha.git
cd sajhi-shiksha/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## 📊 Performance

| Metric | Target | Status |
|--------|--------|--------|
| Total JS (gzipped) | < 250 kB | ✅ ~229 kB |
| Initial Load | < 2s | ✅ Optimized |
| CLS | < 0.1 | ✅ Fixed |
| Bundle Splitting | Yes | ✅ 3 chunks |

### Optimizations Applied

- **Code Splitting** — Routes loaded on demand via `React.lazy`
- **Bundle Separation** — MUI, icons, and framer-motion in separate chunks
- **Icon Registry** — Only 45 icons loaded (vs 1,500+ full library)
- **Skeleton Loaders** — Page-specific skeletons instead of spinners
- **Font Optimization** — `display=swap` for non-blocking font loading
- **Tree Shaking** — Unused MUI components excluded from bundle

## 🌍 Deployment

The project is configured for Vercel deployment with SPA routing support.

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

### Vercel Configuration

The `vercel.json` file ensures all routes are redirected to `index.html` for client-side routing:

```json
{
    "rewrites": [
        { "source": "/(.*)", "destination": "/index.html" }
    ]
}
```

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

We welcome contributions from teachers and students!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact

For questions or suggestions, reach out through the [Contribute page](https://www.sajhishiksha.in/contribute) on the website.

---

Built with ❤️ by students, for students
"# Sajhi-Shiksha" 
