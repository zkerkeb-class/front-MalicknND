# Frontend - Interface Utilisateur Next.js

## 📋 Description

Interface utilisateur moderne développée avec **Next.js 15**, **React 19** et **Tailwind CSS**. Cette application permet aux utilisateurs de générer des images par IA, consulter leur historique et gérer leurs créations.

## 🏗️ Architecture

- **Framework** : Next.js 15
- **UI** : React 19 + Tailwind CSS 4
- **Authentification** : Clerk
- **État** : React Hooks
- **Port** : 3000

## 🎨 Fonctionnalités

### 🔐 Authentification
- Connexion/déconnexion avec Clerk
- Protection des routes
- Gestion des sessions utilisateur

### 🎨 Génération d'Images
- Interface de saisie de prompts
- Options de génération (résolution, étapes, etc.)
- Prévisualisation en temps réel
- Historique des générations

### 📚 Gestion des Images
- Galerie des images générées
- Filtrage et recherche
- Actions (télécharger, supprimer, partager)
- Pagination

### 🎛️ Paramètres
- Configuration des préférences
- Gestion du compte utilisateur
- Thème (clair/sombre)

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+
- npm ou yarn
- Compte Clerk configuré
- Services backend démarrés

### Installation
```bash
# Cloner le projet
git clone <repository>
cd front-MalicknND

# Installer les dépendances
npm install

# Configuration
cp .env.example .env
```

### Configuration
```env
# Clerk (Authentification)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Services Backend
NEXT_PUBLIC_IA_SERVICE_URL=http://localhost:9000
NEXT_PUBLIC_IMAGE_SERVICE_URL=http://localhost:5002

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Démarrage
```bash
# Développement
npm run dev

# Production
npm run build
npm start

# Linting
npm run lint
```

## 📁 Structure du Projet

```
front-MalicknND/
├── app/                    # App Router Next.js 15
│   ├── (auth)/            # Routes protégées
│   │   ├── dashboard/     # Tableau de bord
│   │   ├── generate/      # Génération d'images
│   │   ├── gallery/       # Galerie d'images
│   │   └── settings/      # Paramètres
│   ├── api/               # API Routes
│   ├── globals.css        # Styles globaux
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Page d'accueil
├── components/            # Composants réutilisables
│   ├── ui/               # Composants UI de base
│   ├── forms/            # Formulaires
│   ├── layout/           # Composants de layout
│   └── features/         # Composants métier
├── lib/                  # Utilitaires et configurations
├── hooks/                # Custom React Hooks
├── types/                # Types TypeScript
└── public/               # Assets statiques
```

## 🎨 Composants Principaux

### ImageGenerator
```tsx
// Composant de génération d'images
<ImageGenerator
  onGenerate={(image) => console.log(image)}
  onError={(error) => console.error(error)}
/>
```

### ImageGallery
```tsx
// Galerie d'images avec pagination
<ImageGallery
  images={images}
  onDelete={(id) => handleDelete(id)}
  onDownload={(url) => handleDownload(url)}
/>
```

### PromptInput
```tsx
// Saisie de prompts avec suggestions
<PromptInput
  value={prompt}
  onChange={setPrompt}
  suggestions={suggestions}
  onGenerate={handleGenerate}
/>
```

## 🔐 Authentification avec Clerk

### Configuration
```tsx
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="fr">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

### Protection des routes
```tsx
// app/(auth)/dashboard/page.tsx
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }
  
  return <Dashboard userId={userId} />
}
```

### Middleware
```tsx
// middleware.ts
import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up"]
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
```

## 🔄 Communication avec les Services

### Service IA
```typescript
// lib/api/ia.ts
export async function generateImage(prompt: string, options: GenerationOptions) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_IA_SERVICE_URL}/api/images/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${await getToken()}`
    },
    body: JSON.stringify({ prompt, options })
  })
  
  return response.json()
}
```

### Service Images
```typescript
// lib/api/images.ts
export async function getUserImages(userId: string, page = 1, limit = 10) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_IMAGE_SERVICE_URL}/api/images?page=${page}&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${await getToken()}`
      }
    }
  )
  
  return response.json()
}
```

## 🎨 Interface Utilisateur

### Design System
- **Couleurs** : Palette cohérente avec thème clair/sombre
- **Typographie** : Inter pour une meilleure lisibilité
- **Espacement** : Système de spacing Tailwind
- **Composants** : Design system unifié

### Responsive Design
- **Mobile First** : Optimisé pour mobile
- **Tablette** : Adaptation pour écrans moyens
- **Desktop** : Interface complète pour grands écrans

### Animations
- **Transitions** : Animations fluides
- **Loading States** : États de chargement
- **Micro-interactions** : Feedback utilisateur

## 📊 Gestion d'État

### React Hooks
```typescript
// hooks/useImages.ts
export function useImages(userId: string) {
  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const fetchImages = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getUserImages(userId)
      setImages(data.images)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [userId])
  
  return { images, loading, error, fetchImages }
}
```

### Context API
```typescript
// context/AppContext.tsx
export const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [user, setUser] = useState<User | null>(null)
  
  return (
    <AppContext.Provider value={{ theme, setTheme, user, setUser }}>
      {children}
    </AppContext.Provider>
  )
}
```

## 🧪 Tests

### Tests unitaires
```bash
npm test
```

### Tests d'intégration
```bash
npm run test:integration
```

### Tests E2E
```bash
npm run test:e2e
```

## 📈 Performance

### Optimisations
- **SSR/SSG** : Rendu côté serveur
- **Image Optimization** : Optimisation automatique des images
- **Code Splitting** : Chargement à la demande
- **Caching** : Mise en cache intelligente

### Métriques
- **LCP** : < 2.5s
- **FID** : < 100ms
- **CLS** : < 0.1
- **Bundle Size** : < 500KB

## 🔧 Configuration Avancée

### Tailwind CSS
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          // ...
          900: '#1e3a8a',
        }
      }
    }
  }
}
```

### ESLint
```javascript
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "prefer-const": "error"
  }
}
```

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
# Installation de Vercel CLI
npm i -g vercel

# Déploiement
vercel

# Variables d'environnement
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
vercel env add CLERK_SECRET_KEY
```

### Autres plateformes
- **Netlify** : Compatible avec Next.js
- **AWS Amplify** : Déploiement automatique
- **Docker** : Containerisation

## 📝 Notes de développement

### Bonnes pratiques
- **TypeScript** : Utilisation stricte des types
- **ESLint** : Code quality automatisée
- **Prettier** : Formatage cohérent
- **Git Hooks** : Validation avant commit

### Structure des commits
```
feat: ajouter la génération d'images
fix: corriger l'authentification Clerk
docs: mettre à jour la documentation
style: améliorer l'interface utilisateur
```

### Évolutions futures
- **PWA** : Application web progressive
- **Offline** : Support hors ligne
- **Push Notifications** : Notifications push
- **Analytics** : Suivi des utilisateurs
