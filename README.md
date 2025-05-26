# Welcome to my project

### 🔧 **Core Technologies Overview**

* **React** (`.tsx` files): A declarative UI framework for building component-based frontends.
* **TypeScript** (`.ts`, `.tsx`): Adds strong typing and better tooling for large-scale JavaScript apps.
* **Vite** (`vite.config.ts`): Lightning-fast dev server and optimized build process with hot module replacement (HMR).
* **Tailwind CSS** (`tailwind.config.ts`, `postcss.config.js`): Utility-first CSS framework enabling rapid UI development with pre-defined class utilities.
* **Node.js** (`package.json`, `package-lock.json`): Used for dependency management and project tooling (via `npm` or `yarn`).

---

### 🗂️ **File Structure & Key Directories**

* **`src/`**: Root source directory.

  * **`App.tsx`**: Main application wrapper.
  * **`main.tsx`**: Entry point that mounts the app to the DOM.
  * **`index.css`, `App.css`**: Global and scoped styles.
  * **`vite-env.d.ts`**: Declares Vite environment variables for TypeScript.

#### 🧩 **Component & UI Architecture**

* **`components/`**: Reusable building blocks (e.g., `AuthModal`, `BookCard`, `Navbar`, `ShoppingCart`).
* **`components/ui/`**: Likely auto-generated/custom UI kit or shadcn/ui-style library.
* **`pages/`**: Page-level components like `BookDetails`, `NotFound`, `Index`, implying routing with `react-router-dom` or similar.

#### 🧠 **Hooks & Logic**

* **`hooks/`**: Custom React hooks (e.g., `use-mobile.tsx`, `use-toast.ts`), encapsulating stateful logic for reusability.

#### 🛠️ **Utilities & Support Modules**

* **`lib/`** & **`utils/`**: Utility functions and abstractions (e.g., API logic, date formatting, DB interaction).
* **`data/`**:

  * **`mockData.ts`**: Mock objects for UI or test environments.
  * **`database/`**: Static JSON "backend" (e.g., `books.json`, `users.json`, `orders.json`) used as fake databases.

---

### ⚙️ **Project Configuration & Tooling**

* **`.idx/dev.nix`**: Development environment defined via Nix, useful for reproducible setups.
* **`components.json`**: Possibly used by a component cataloging tool or documentation generator.
* **`eslint.config.js`**: Linting rules for code consistency and quality assurance.
* **`tsconfig.*.json`**: TypeScript compiler options tailored for different build targets (app, node, etc.).
* **`index.html`**: The HTML shell used by Vite during development and build.
* **`README.md`**: Project overview and instructions—essential for onboarding contributors.

---

### 📦 Likely Application Domain

Based on file naming conventions (`BookCard`, `BookDetails`, `ShoppingCart`, `orders.json`), the app is most likely:

**📚 A Bookstore or E-commerce Application**

* Features likely include: book listings, detailed product pages, shopping cart functionality, user authentication (via `AuthModal`), and category-based filtering.
