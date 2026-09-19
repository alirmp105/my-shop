# My Shop

  

A modern, Persian/RTL-first e-commerce application built with **Next.js App Router**, **React**, **MongoDB**, **Mongoose**, and **NextAuth**.

[Live Demo](https://my-shop-ten-rouge.vercel.app)
  

My Shop is a personal full-stack project focused on building a realistic online store architecture: an RTL-first storefront, authenticated users, database-backed shopping cart, product management, inventory control, and an admin panel.

  

## 🚧 Project Status: Early MVP / Active Development

  

The storefront core, authentication, product management, shopping cart, and admin infrastructure are implemented. More advanced commerce features such as Checkout, Orders, Payments, Reviews, and advanced catalog browsing are planned for future iterations.

  

---

  

## ✨ Features

  

### 🛒 Storefront

  

- Persian, right-to-left (RTL-first) user interface

- Responsive layout for desktop and mobile

- Hero carousel

- Popular products section

- Category showcase

- Brand showcase

- Product detail pages

- Product image gallery

- Product specifications

- Stock-aware purchase controls

- Shopping cart

- Empty and loading states

- Toast notifications

- Product metadata generation for SEO

  

### 👤 Authentication & User Accounts

  

- User registration

- Email/password authentication

- NextAuth Credentials Provider

- JWT-based sessions

- Password hashing with bcrypt

- Active/inactive account handling

- Role-based access control (RBAC)

- Protected user routes

- Protected admin routes

  

Authentication and authorization are handled through NextAuth, JWT sessions, `middleware.js`, server-side session checks, and API-level authorization.

  

### 🛠️ Admin Panel

  

The project includes a dedicated admin panel for managing core data.

  

**Products**

  

- Product listing

- Create, edit, and delete products

- Multiple images per product

- Primary image selection

- Image replacement/removal

- Product specifications

- Category and brand assignment

- Price management

- Inventory management

- Server-side validation

  

**Categories**

  

- Create, edit, and delete categories

- Persian and English names

- Automatic slug generation

- Category image upload

- Active/inactive status

- Deletion protection when referenced by products

  

**Brands**

  

- Create, edit, and delete brands

- Persian and English names

- Slug support

- Brand image management

  

**Inventory**

  

- Inventory overview

- Filter by stock status

- Manual stock quantity adjustment

- Stock-aware cart behavior

  

**Users**

  

- User listing

- Filter by role

- Filter by active/inactive status

- View user details

  

**Coupons**

  

- Coupon management infrastructure

- Fixed and percentage discount types

- Minimum purchase amount

- Maximum discount cap

- Expiration dates

- Active/inactive status

  

### 🛍️ Shopping Cart

  

The cart is database-backed and available to authenticated users.

  

Capabilities:

  

- Add products

- Increase quantity

- Decrease quantity

- Remove items

- Stock validation

- Maximum quantity limits based on stock

- Cart total calculation

- Product price synchronization on cart mutations

- Loading states

- Mutation error handling

- Persistent cart data for authenticated users

  

**Cart architecture**

  

```

ProductCard
     │
     ▼
CartItemControl
     │
     ▼
useCart()
     │
     ▼
CartProvider
     │
     ▼
services/cart.js
     │
     ▼
/api/cart
     │
     ▼
Mongoose
     │
     ▼
MongoDB

```

  

Cart state is managed globally with a React Context Provider, while database operations go through Route Handlers and server-side data-access functions.

  

---

  

## 🔐 Security & Authorization

  

Security is handled in multiple layers.

  

**Route protection:** `middleware.js` protects authenticated routes:

  

- `/admin`

- `/cart`

- `/profile`

- `/orders`

  

**Admin authorization:** Admin pages perform role checks server-side. Admin APIs also perform their own authorization and do not rely on middleware alone.

  

```text

Request
   │
   ▼
NextAuth Session
   │
   ├── No session ──────► 401 Unauthorized
   │
   ▼
Check user role
   │
   ├── Not admin ───────► 403 Forbidden
   │
   ▼
Admin operation
```

  

This ensures that calling an admin API directly cannot bypass the application's authorization layer.

  

---

  

## 🖼️ Image Upload (Cloudinary)

  

Images are uploaded to [Cloudinary](https://cloudinary.com) as the cloud image storage service. There is no local filesystem upload path; all media handling is cloud-based.

  

**Supported formats:**

  

- JPEG

- PNG

- WebP

  

**Current upload capabilities:**

  

- File type validation

- File size validation

- Sensible public IDs / naming for each image

- Product primary image management

- Image replacement

- Image removal (both in Cloudinary and the database)

- Cleanup when uploads fail in supported flows

  

**Cloudinary environment variables** (names/configuration should match the project implementation — set the actual values from your Cloudinary dashboard):

  

```bash

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret

```
``` Validation> Never commit `.env.local` or real secret values to the repository```.

  

---

  

## 🧩 Validation

  

The project uses **Zod** for request and form validation.

  

Validation schemas cover:

  

- Authentication

- Products

- Categories

- Brands

- Coupons

- Reviews

  

Server-side validation is used alongside client-side validation where appropriate.

  

---

  

## 🏗️ Architecture

  

The application follows the Next.js App Router architecture, separating the storefront, authentication, and admin panel using route groups.

  

```text

app/
├── (store)/
│   ├── page.jsx
│   ├── cart/
│   └── products/[slug]/
│
├── (auth)/
│   ├── login/
│   ├── register/
│   ├── profile/
│   └── user/
│
├── (admin)/
│   └── admin/
│       ├── products/
│       ├── categories/
│       ├── brands/
│       ├── coupon/
│       ├── inventory/
│       └── users/
│
└── api/
    ├── auth/
    ├── products/
    ├── categories/
    ├── brands/
    ├── cart/
    ├── coupons/
    ├── inventory/
    └── users/

```

  

**Data flow:** the project combines server-side database access with API-based mutations.

  

```text

Client Component
      │
      ▼
Service / Context
      │
      ▼
Next.js Route Handler
      │
      ▼
Validation + Authorization
      │
      ▼
Mongoose Model
      │
      ▼
   MongoDB

```

  

For server-rendered pages:

  

```text

Server Component
      │
      ▼
Data Access Layer
      │
      ▼
Mongoose
      │
      ▼
MongoDB
      │
      ▼
Serialized Props
      │
      ▼
Client Component
```
  

---

  

## 🗃️ Data Models

  

Current database domain:

  

```text

User
 │
 └── Cart
      │
      └── CartItem ──► Product
                        │
                        ├── Category
                        └── Brand

Review
 ├── Product
 └── User

Core models:
  

- `User`

- `Product`

- `Category`

- `Brand`

- `Cart`

- `Review`

- `Coupon`

```

MongoDB access is centralized through the project's database connection layer.


---

  

## 🎨 UI & UX

  

The interface is specifically designed for a Persian, right-to-left experience.

  

**UI technologies:**

  

- Tailwind CSS

- shadcn/ui

- Radix UI

- Lucide React

- Sonner

- Embla Carousel

  

**

  

**:**

  

- Responsive layouts

- Loading skeletons

- Empty states

- Error boundaries

- Toast notifications

- Form validation feedback

- Stock-aware controls

- Responsive admin tables

- Mobile navigation

- RTL-aware layouts and components

  

The application globally uses `lang="fa"` and `dir="rtl"`:

  

```html

<html lang="fa" dir="rtl">

```

  

Persian typography uses the **Vazirmatn** font.

  

---

  

## 🧰 Tech Stack

  

| Technology | Purpose |

| --- | --- |

| Next.js 15 | Full-stack React framework |

| React 19 | UI development |

| JavaScript / JSX | Application language |

| MongoDB | Database |

| Mongoose | ODM for MongoDB |

| NextAuth v4 | Authentication and sessions |

| bcryptjs | Password hashing |

| Zod | Validation |

| React Hook Form | Form management |

| Tailwind CSS 4 | Styling |

| shadcn/ui | UI components |

| Radix UI | Accessible primitives |

| Lucide React | Icons |

| Sonner | Toast notifications |

| Embla Carousel | Carousels |

| date-fns | Date handling |

| Vazirmatn | Persian typography |

| Cloudinary | Cloud image storage and uploads |


---
## 🚀 Getting Started

### Prerequisites

- Node.js compatible with Next.js 15
- npm
- MongoDB
- A [Cloudinary](https://cloudinary.com) account and its configuration (Cloud Name, API Key, API Secret)
  
### 1. Clone the repository


```bash

git clone https://github.com/YOUR_USERNAME/my-shop.git

cd my-shop

```

  
### 2. Install dependencies

  

```bash
npm install
```

  
### 3. Configure environment variables

  

Create a `.env.local` file in the project root:

  

```bash

MONGODB_URI=your_mongodb_connection_string

NEXTAUTH_SECRET=your_secure_secret
  
CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret

```

  

> Do not commit real secrets or `.env.local` to the repository. The project depends on `MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and the Cloudinary variables.

  

### 4. Run the development server

  

```bash

npm run dev

```

  

Then open `http://localhost:3000`.

  

---

  

## 📁 Project Structure
```


my-shop/
│
├── app/
│   ├── (store)/
│   ├── (auth)/
│   ├── (admin)/
│   ├── api/
│   ├── error.jsx
│   ├── loading.jsx
│   ├── not-found.jsx
│   └── layout.jsx
│
├── components/
│   ├── admin/
│   ├── auth/
│   ├── layout/
│   ├── categories/
│   ├── brands/
│   ├── products/
│   ├── shared/
│   ├── skeletons/
│   └── ui/
│
├── lib/
│   ├── data/
│   ├── mongodb.js
│   ├── auth.js
│   ├── cart-context.js
│   ├── cloudinary.js
│   ├── nav.js
│   ├──slug.js
│   └── utils.js
│
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   ├── Brand.js
│   ├── Cart.js
│   ├── Coupon.js
│   ├── Review.js
│   └── Hero.js
│
├── schemas/
│   └── heroSchema.js
│
├── services/
│
├── public/
│
├── middleware.js
├── next.config.mjs
├── jsconfig.json
└── package.json
```



## 🧪 Project Status

The project is currently an early MVP, not a full production e-commerce platform.

### ✅ Implemented

  

- RTL-first Persian storefront

- Responsive UI

- Authentication (registration, login/logout, user session)

- Role-based authorization

- Admin panel

- Product CRUD

- Category CRUD

- Brand management

- Inventory management

- Coupon management infrastructure

- Database-backed shopping cart

- Stock-aware cart controls

- Product image uploads to Cloudinary

- Loading states

- Error handling

- Basic SEO metadata

  

This status reflects a working foundation in authentication, catalog management, cart operations, inventory, RTL UI, and cloud image management.

  

### ⏳ Not Yet Implemented

  

Checkout, orders, payments, reviews, wishlist, product search/filtering/sorting/pagination, and password recovery are **planned but not implemented**. See the [Roadmap](#️-roadmap).

  

---

  

## 🗺️ Roadmap

  

The project is developed incrementally, phase by phase.

  

### Phase 1 — Storefront

  

- [ ] Product listing page

- [ ] Category pages

- [ ] Brand pages

- [ ] Product search

- [ ] Filtering

- [ ] Sorting

- [ ] Pagination 

  

### Phase 2 — Commerce Flow

  

- [ ] Checkout

- [ ] Address management

- [ ] Shipping options

- [ ] Order model

- [ ] Order history

- [ ] Payment gateway integration

- [ ] Payment confirmation

- [ ] Server-side price/stock re-validation

  

### Phase 3 — User Features

  

- [ ] Product reviews

- [ ] Review management and moderation

- [ ] Wishlist

- [ ] Password recovery

- [ ] Email verification

- [ ] Improved account management

  

### Phase 4 — Admin & Analytics

  

- [ ] Dynamic dashboard statistics

- [ ] Order management

- [ ] Review management

- [ ] Advanced user management

- [ ] Reports

- [ ] Sales analytics

  

### Phase 5 — Production Improvements

  

- [ ] Image optimization pipeline

- [ ] Stronger file content validation

- [ ] Cache invalidation strategy

- [ ] Pagination on large datasets

- [ ] Rate limiting

- [ ] Security headers

- [ ] Automated tests

- [ ] Logging and observability

- [ ] Production deployment configuration

  

These are planned improvements, not claims of existing functionality.

  

---

  

## 🔒 Production Considerations

  

Before public use as a production store, the following should be hardened:

  

- Replace development environment values with production secrets

- Stronger file content validation for uploads

- Rate limiting and abuse protection

- Final stock and price verification at checkout

- Proper order/payment transaction handling

- Automated tests

- Monitoring and observability in production

  

The current implementation is intentionally an educational / MVP foundation, not a full production commercial platform.

  

---

  

## 🎯 Project Goals

  

This project is built with a focus on learning and demonstrating practical full-stack development concepts, including:

  

- Next.js App Router architecture

- Server and Client Components

- REST-style Route Handlers

- MongoDB data modeling

- Mongoose relations and population

- Authentication and authorization

- JWT sessions

- Role-based access control

- Form and API validation

- File upload management

- State management with React Context

- Responsive RTL UI development

- Domain modeling

- Error and loading state design

- SEO principles

  

The goal is not just a visual storefront, but the gradual evolution of the project into a more complete store system with a maintainable backend and a production-oriented architecture.

  

---

  

## 📌 Future Vision

  

The long-term goal is to evolve My Shop from an MVP into a complete commerce platform:

  

```

Storefront
    │
    ├── Product Catalog
    ├── Search & Filtering
    ├── Product Details
    ├── Cart
    ├── Checkout
    └── Orders
          │
          ▼
       Payment
          │
          ▼
    Order Processing
          │
          ▼
    Inventory System
          │
          ▼
     Admin Panel

```

  

Each part will be added gradually as the project evolves.

  

---

  

## 🤝 Contributing

  

This project is primarily a personal learning and portfolio project.

  

Suggestions, bug reports, and constructive feedback are welcome. If you spot an issue or have an architectural suggestion, feel free to open an issue or start a discussion.

  

---

  

## 📄 License

  

This project is currently released as a personal/portfolio project.

  

A formal open-source license may be added in a future release if the project is published for redistribution or contribution.

  

---

  

## 👨‍💻 Author

  

**Ali Hoseini**

  

Built as a personal full-stack project focused on Next.js, backend architecture, database design, authentication, and modern UI development.

  

---

  

⭐ If you find this project interesting, follow its development.