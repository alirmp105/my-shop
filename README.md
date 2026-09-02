 My Shop
A modern Persian/RTL e-commerce application built with Next.js App Router, React, MongoDB, Mongoose, and NextAuth.
My Shop is a personal full-stack project focused on building a realistic e-commerce architecture with a Persian RTL storefront, authenticated users, a database-backed shopping cart, product management, inventory control, and an admin dashboard.
🚧 Project Status: Early MVP / Active Development
 The core storefront, authentication, product management, cart, and admin foundations are implemented. More advanced e-commerce features such as checkout, orders, payments, reviews, and advanced catalog browsing are planned for future releases.
________________________________________
✨ Features
🛒 Storefront
●	Persian and RTL-first interface
●	Responsive layout for desktop and mobile
●	Hero carousel
●	Trending products section
●	Category showcase
●	Brand showcase
●	Product detail pages
●	Product image gallery
●	Product specifications
●	Stock-aware product purchase controls
●	Shopping cart
●	Empty and loading states
●	Toast notifications
●	Product metadata generation for SEO
👤 Authentication & User Accounts
●	User registration
●	Email/password authentication
●	NextAuth Credentials Provider
●	JWT-based sessions
●	Password hashing with bcrypt
●	Active/inactive account handling
●	User profile page
●	Role-based access control
●	Protected user routes
●	Protected admin routes
Authentication and authorization are implemented through NextAuth, JWT sessions, middleware, server-side session checks, and API-level authorization.
🛠️ Admin Dashboard
The project includes a dedicated admin panel for managing the application's core data.
Products
●	Product listing
●	Create product
●	Edit product
●	Delete product
●	Multiple product images
●	Primary image selection
●	Image replacement/removal
●	Product specifications
●	Category assignment
●	Brand assignment
●	Price management
●	Stock management
●	Server-side validation
Categories
●	Create categories
●	Edit categories
●	Delete categories
●	Persian and English names
●	Automatic slug generation
●	Category image upload
●	Active/inactive state
●	Product-reference protection before deletion
Brands
●	Create brands
●	Edit brands
●	Delete brands
●	Persian and English names
●	Slugs
●	Brand image management
Inventory
●	Inventory overview
●	Stock availability filtering
●	Stock quantity adjustments
●	Stock-aware cart behavior
Users
●	User listing
●	Role-based filtering
●	Active/inactive filtering
●	User information display
Coupons
●	Coupon management foundation
●	Fixed and percentage coupon types
●	Minimum purchase amount
●	Maximum discount
●	Expiration date
●	Active/inactive state
________________________________________
🛍️ Shopping Cart
The cart is implemented as a database-backed, authenticated user feature.
The cart supports:
●	Add product
●	Increase quantity
●	Decrease quantity
●	Remove product
●	Stock validation
●	Maximum quantity based on available stock
●	Cart total calculation
●	Current product price synchronization during cart mutations
●	Loading states
●	Mutation error handling
●	Persistent cart data for authenticated users
Cart Architecture
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

The cart state is managed globally through a React Context provider, while database operations are handled through API routes and server-side data-access functions.
________________________________________
🔐 Security & Authorization
Security is handled at multiple layers.
Route protection
The application middleware protects authenticated routes such as:
/admin
/cart
/profile
/orders

Admin authorization
Admin pages perform server-side role checks.
Admin APIs also perform their own authorization checks rather than relying solely on middleware.
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

This ensures that directly calling an admin API does not bypass the application's authorization layer.
________________________________________
🖼️ Image Upload System
The project currently uses local filesystem storage for uploaded images.
Supported image types:
●	JPEG
●	PNG
●	WebP
Current upload features include:
●	File type validation
●	File size validation
●	UUID-based filenames
●	Primary image handling
●	Image replacement
●	Image deletion
●	Failed-upload cleanup in supported upload flows
Current storage structure:
public/
└── uploads/
    ├── products/
    ├── categories/
    └── brands/

Note: Local filesystem storage is suitable for the current development/MVP environment. A future production version will move uploads to durable object storage.
________________________________________
🧩 Validation
The project uses Zod for request and form validation.
Validation schemas cover areas such as:
●	Authentication
●	Products
●	Categories
●	Brands
●	Coupons
●	Reviews
Server-side validation is used alongside client-side form validation where appropriate.
________________________________________
🏗️ Architecture
The application follows the Next.js App Router architecture and separates storefront, authentication, and admin functionality using route groups.
app/
├── (store)/
│   ├── page.jsx
│   ├── cart/
│   └── products/[slug]/
│
├── (auth)/
│   ├── login/
│   ├── register/
│   ├── profile/
│   └── user/
│
├── (admin)/
│   └── admin/
│       ├── products/
│       ├── categories/
│       ├── brands/
│       ├── coupon/
│       ├── inventory/
│       └── users/
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

Data flow
The project uses both server-side database access and API-based data mutations.
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

For server-rendered pages:
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

________________________________________
🗃️ Data Models
The current database domain includes:
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

Coupon

Main models
●	User
●	Product
●	Category
●	Brand
●	Cart
●	Review
●	Coupon
MongoDB access is centralized through the project's database connection layer.
________________________________________
🎨 UI & UX
The interface is designed specifically around a Persian RTL experience.
UI technologies
●	Tailwind CSS
●	shadcn/ui
●	Radix UI
●	Lucide React
●	Sonner
●	Embla Carousel
UX considerations
●	Responsive layouts
●	Loading skeletons
●	Empty states
●	Error boundaries
●	Toast notifications
●	Form validation feedback
●	Stock-aware controls
●	Responsive admin tables
●	Mobile navigation
●	RTL-aware layouts and components
The application globally uses:
<html lang="fa" dir="rtl">

and uses the Vazirmatn font for Persian typography.
________________________________________
🧰 Tech Stack
Technology	Purpose
Next.js 15	Full-stack React framework
React 19	UI development
JavaScript / JSX	Application language
MongoDB	Database
Mongoose	MongoDB ODM
NextAuth v4	Authentication & sessions
bcryptjs	Password hashing
Zod	Validation
React Hook Form	Form management
Tailwind CSS 4	Styling
shadcn/ui	UI components
Radix UI	Accessible primitives
Lucide React	Icons
Sonner	Toast notifications
Embla Carousel	Carousels
date-fns	Date handling
Vazirmatn	Persian typography
The technology choices and current architecture are based on the project's implemented stack.
________________________________________
🚀 Getting Started
Prerequisites
Make sure you have:
●	Node.js compatible with Next.js 15
●	npm
●	MongoDB
●	A writable filesystem for the current local upload system
1. Clone the repository
git clone https://github.com/YOUR_USERNAME/my-shop.git

cd my-shop

2. Install dependencies
npm install

3. Configure environment variables
Create a .env.local file in the project root:
MONGODB_URI=your_mongodb_connection_string

NEXTAUTH_SECRET=your_secure_secret

NEXTAUTH_URL=http://localhost:3000

Do not commit .env.local or real secret values to the repository.
The project currently relies on MONGODB_URI, NEXTAUTH_SECRET, and NEXTAUTH_URL.
4. Start the development server
npm run dev

Open:
http://localhost:3000

________________________________________
📁 Project Structure
A simplified view of the project:
my-shop/
│
├── app/
│   ├── (store)/
│   ├── (auth)/
│   ├── (admin)/
│   ├── api/
│   ├── error.jsx
│   ├── loading.jsx
│   ├── not-found.jsx
│   └── layout.jsx
│
├── components/
│   ├── admin/
│   ├── auth/
│   ├── cart/
│   ├── categories/
│   ├── brands/
│   ├── products/
│   ├── layout/
│   ├── shared/
│   ├── skeletons/
│   └── ui/
│
├── lib/
│   ├── data/
│   ├── mongodb.js
│   ├── auth.js
│   └── cart-context.jsx
│
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   ├── Brand.js
│   ├── Cart.js
│   ├── Coupon.js
│   └── Review.js
│
├── schemas/
│
├── services/
│
├── public/
│   └── uploads/
│
├── middleware.js
├── next.config.mjs
├── jsconfig.json
└── package.json

________________________________________
🧪 Current Project Status
The project is currently an early MVP rather than a complete production e-commerce platform.
✅ Implemented
●	Persian RTL storefront
●	Responsive UI
●	Authentication
●	Registration
●	Login/logout
●	User sessions
●	Role-based authorization
●	Admin dashboard
●	Product CRUD
●	Category CRUD
●	Brand management
●	Inventory management
●	Coupon management foundation
●	Database-backed shopping cart
●	Stock-aware cart controls
●	Product image uploads
●	Loading states
●	Error handling
●	Basic SEO metadata
The audit confirms that the project already provides a functional foundation across authentication, catalog administration, cart operations, inventory, RTL UI, and image handling.
________________________________________
🗺️ Roadmap
The project is intentionally being developed incrementally.
Phase 1 — Storefront
●	[ ] Product listing page
●	[ ] Category pages
●	[ ] Brand pages
●	[ ] Product search
●	[ ] Filtering
●	[ ] Sorting
●	[ ] Pagination
Phase 2 — E-commerce Flow
●	[ ] Checkout
●	[ ] Address management
●	[ ] Shipping options
●	[ ] Order model
●	[ ] Order history
●	[ ] Payment integration
●	[ ] Payment verification
●	[ ] Final server-side price/stock verification
Phase 3 — User Features
●	[ ] Product reviews
●	[ ] Review moderation
●	[ ] Wishlist
●	[ ] Password reset
●	[ ] Email verification
●	[ ] Improved account management
Phase 4 — Admin & Analytics
●	[ ] Dynamic dashboard statistics
●	[ ] Order management
●	[ ] Review moderation
●	[ ] Advanced user management
●	[ ] Reports
●	[ ] Sales analytics
Phase 5 — Production Improvements
●	[ ] Object storage for uploaded images
●	[ ] Image optimization pipeline
●	[ ] Stronger file-content validation
●	[ ] Cache invalidation strategy
●	[ ] Pagination across large datasets
●	[ ] Rate limiting
●	[ ] Security headers
●	[ ] Automated tests
●	[ ] Logging and observability
●	[ ] Production deployment configuration
These items are planned improvements rather than claims about functionality that already exists. The project's audit similarly identifies storefront catalog expansion, checkout/order/payment infrastructure, reviews, search/filtering, production storage, testing, and observability as future development areas.
________________________________________
🔒 Production Considerations
Before using the project as a public production store, several areas should be strengthened.
In particular:
●	Replace development environment values with production secrets
●	Use durable object storage instead of local filesystem uploads
●	Add stronger file-content validation
●	Implement rate limiting and abuse protection
●	Add final stock and price verification during checkout
●	Introduce proper order/payment transaction handling
●	Add automated tests
●	Add production monitoring and observability
The current implementation is intentionally positioned as a learning project / MVP foundation rather than a finished production commerce platform.
________________________________________
🎯 Project Goals
This project is being developed with a focus on learning and demonstrating practical full-stack development concepts, including:
●	Next.js App Router architecture
●	Server and Client Components
●	REST-style Route Handlers
●	MongoDB data modeling
●	Mongoose relationships and population
●	Authentication and authorization
●	JWT sessions
●	Role-based access control
●	Form and API validation
●	File upload handling
●	React Context state management
●	Responsive RTL UI development
●	E-commerce domain modeling
●	Error and loading state design
●	SEO fundamentals
The goal is not only to create a visual storefront, but to gradually evolve the project into a more complete e-commerce system with a maintainable backend and production-oriented architecture.
________________________________________
📌 Future Vision
The long-term goal is to evolve My Shop from an MVP into a complete e-commerce platform with:
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

Each part will be introduced incrementally as the project evolves.
________________________________________
🤝 Contributing
This is primarily a personal learning and portfolio project.
Suggestions, bug reports, and constructive feedback are welcome.
If you find an issue or have an architectural suggestion, feel free to open an issue or start a discussion.
________________________________________
📄 License
This project is currently intended as a personal/portfolio project.
A formal open-source license can be added in a future release if the project is made available for redistribution or contribution.
________________________________________
👨‍💻 Author
Ali Hoseini
Built as a personal full-stack development project with a focus on Next.js, backend architecture, database design, authentication, and modern UI development.
________________________________________
⭐ If you find the project interesting, feel free to explore the source code and follow its development.

