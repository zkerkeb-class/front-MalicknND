# 🎨 Imagink - Plateforme de Génération d'Images IA & Print-on-Demand

## 📋 Vue d'ensemble du Projet

**Imagink** est une plateforme complète de génération d'images par IA et de création de produits personnalisés (print-on-demand). Le projet suit une architecture microservices moderne avec un frontend Next.js et plusieurs services backend spécialisés.

### 🎯 Fonctionnalités Principales
- **Génération d'images IA** avec Stability AI (Stable Diffusion 3.5)
- **Stockage sécurisé** des images via Supabase
- **Création de produits** personnalisés via Printify (T-shirts, mugs, etc.)
- **Système de crédits** avec paiements Stripe
- **Notifications automatiques** par email
- **Interface moderne** et responsive

## 🏗️ Architecture Microservices

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Service IA     │    │ Service Images  │
│   (Next.js)     │◄──►│  (Port 9000)    │◄──►│  (Port 5002)    │
│   (Port 3000)   │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Service Payment │    │ Service BDD     │    │ Service Printify│
│ (Port 9001)     │    │ (Port 9002)     │    │ (Port 3004)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│Service Notif.   │    │   Supabase      │    │   Printify      │
│(Port 3005)      │    │  (Storage/DB)   │    │   (External)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔗 Repositories des Services

### 🎨 Frontend (Ce repository)
- **Repository** : [front-MalicknND](https://github.com/zkerkeb-class/front-MalicknND)
- **Technologies** : Next.js 15, React 19, Tailwind CSS, Clerk
- **Port** : 3000
- **Description** : Interface utilisateur moderne pour la génération d'images et la gestion des produits

### 🤖 Service IA - Génération d'Images
- **Repository** : [service-ia-MalicknND](https://github.com/zkerkeb-class/service-ia-MalicknND)
- **Technologies** : Node.js, Express, Stability AI API
- **Port** : 9000
- **Description** : Service de génération d'images avec Stable Diffusion 3.5 Large

### 🖼️ Service Images - Stockage
- **Repository** : [image-service-MalicknND](https://github.com/MalicknND/image-service-MalicknND)
- **Technologies** : Node.js, Express, Supabase Storage
- **Port** : 5002
- **Description** : Gestion et stockage des images générées par IA

### 🗄️ Service BDD - Base de Données
- **Repository** : [bdd-services-MalicknND](https://github.com/zkerkeb-class/bdd-services-MalicknND)
- **Technologies** : Node.js, Express, PostgreSQL, Prisma ORM
- **Port** : 9002
- **Description** : Service de base de données centralisée pour les métadonnées

### 🎨 Service Printify - Print-on-Demand
- **Repository** : [printify-service-MalicknND](https://github.com/zkerkeb-class/printify-service-MalicknND)
- **Technologies** : Node.js, Express, Printify API
- **Port** : 3004
- **Description** : Création de produits personnalisés via Printify

### 💳 Service Payment - Paiements
- **Repository** : [payment-services-MalicknND](https://github.com/zkerkeb-class/payment-services-MalicknND)
- **Technologies** : Node.js, Express, Stripe
- **Port** : 9001
- **Description** : Gestion des paiements et système de crédits

### 📧 Service Notifications
- **Repository** : [notification-mail-sms-service-MalicknND](https://github.com/zkerkeb-class/notification-mail-sms-service-MalicknND)
- **Technologies** : Node.js, Express, Nodemailer, Clerk Webhooks
- **Port** : 3005
- **Description** : Notifications par email automatiques

### 📊 Service Métriques (Optionnel)
- **Repository** : [metrics-service-MalicknND](https://github.com/zkerkeb-class/metrics-service-MalicknND)
- **Technologies** : Prometheus, Grafana
- **Description** : Monitoring et métriques des services

## 🔄 Workflow Complet

### 1. **Génération d'Image**
```
Frontend → Service IA → Service Images → Supabase + Service BDD
    ↓           ↓           ↓              ↓
Saisie    Génération   Stockage      Persistance
Prompt    IA          Image         Métadonnées
```

### 2. **Création de Produit**
```
Frontend → Service Printify → Service BDD
    ↓           ↓              ↓
Sélection   Création      Enregistrement
Image      Produit       Base données
```

### 3. **Achat de Crédits**
```
Frontend → Service Payment → Stripe → Webhook → Crédits
    ↓           ↓           ↓         ↓         ↓
Achat      Session      Paiement   Confirmation Ajout
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+
- npm ou yarn
- Compte Clerk configuré
- Clés API (Stability AI, Supabase, Printify, Stripe)

### Démarrage Rapide
```bash
# 1. Cloner tous les repositories
git clone https://github.com/zkerkeb-class/front-MalicknND.git
git clone https://github.com/zkerkeb-class/service-ia-MalicknND.git
git clone https://github.com/MalicknND/image-service-MalicknND.git
git clone https://github.com/zkerkeb-class/bdd-services-MalicknND.git
git clone https://github.com/zkerkeb-class/printify-service-MalicknND.git
git clone https://github.com/zkerkeb-class/payment-services-MalicknND.git
git clone https://github.com/zkerkeb-class/notification-mail-sms-service-MalicknND.git

# 2. Démarrer tous les services
./start-all.sh

# 3. Ou arrêter tous les services
./stop-all.sh
```

### Configuration Frontend
```bash
cd front-MalicknND

# Installer les dépendances
npm install

# Configuration
cp .env.example .env
```

### Variables d'environnement Frontend
```env
# Clerk (Authentification)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Services Backend
NEXT_PUBLIC_IA_SERVICE_URL=http://localhost:9000
NEXT_PUBLIC_IMAGE_SERVICE_URL=http://localhost:5002
NEXT_PUBLIC_BDD_SERVICE_URL=http://localhost:9002
NEXT_PUBLIC_PRINTIFY_SERVICE_URL=http://localhost:3004
NEXT_PUBLIC_PAYMENT_SERVICE_URL=http://localhost:9001

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🎨 Fonctionnalités Frontend

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

### 🛍️ Création de Produits
- Sélection d'image générée
- Choix du type de produit (T-shirt, mug, etc.)
- Prévisualisation du produit
- Création via Printify

### 💰 Système de Crédits
- Affichage des crédits disponibles
- Achat de crédits via Stripe
- Historique des transactions

### 📧 Notifications
- Notifications automatiques par email
- Confirmation de génération d'image
- Confirmation de création de produit


## 🔧 Communication avec les Services

### Service IA
```typescript
// Génération d'image
const response = await fetch(`${process.env.NEXT_PUBLIC_IA_SERVICE_URL}/api/images/generate`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${await getToken()}`
  },
  body: JSON.stringify({ prompt, options })
});
```

### Service Images
```typescript
// Récupération des images
const response = await fetch(
  `${process.env.NEXT_PUBLIC_IMAGE_SERVICE_URL}/api/images?page=${page}&limit=${limit}`,
  {
    headers: {
      'Authorization': `Bearer ${await getToken()}`
    }
  }
);
```

### Service BDD
```typescript
// Récupération des produits
const response = await fetch(
  `${process.env.NEXT_PUBLIC_BDD_SERVICE_URL}/api/products?userId=${userId}`
);
```

### Service Printify
```typescript
// Création de produit
const response = await fetch('/api/printify/product/create', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${clerkToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(productData)
});
```

### Service Payment
```typescript
// Achat de crédits
const response = await fetch('/api/payment/create-session', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ packageId, userId })
});
```

## 🎨 Interface Utilisateur

### Design System
- **Couleurs** : Palette cohérente
- **Typographie** : Inter pour une meilleure lisibilité
- **Espacement** : Système de spacing Tailwind
- **Composants** : Design system unifié

### Responsive Design
- **Mobile First** : Optimisé pour mobile
- **Tablette** : Adaptation pour écrans moyens
- **Desktop** : Interface complète pour grands écrans


## 📊 Gestion d'État

### React Hooks
```typescript
// Hook personnalisé pour les images
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
// Context pour les crédits utilisateur
export const UserCreditsContext = createContext<UserCreditsContextType | undefined>(undefined)

export function UserCreditsProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  
  return (
    <UserCreditsContext.Provider value={{ credits, setCredits, loading, setLoading }}>
      {children}
    </UserCreditsContext.Provider>
  )
}
```