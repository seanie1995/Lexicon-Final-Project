Based on and extended from [EmelieNyberg/projekt-agila-metoder-startkod (dev branch)](https://github.com/EmelieNyberg/projekt-agila-metoder-startkod/tree/dev).

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install the dependencies:

```bash
npm install
```

To start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Configuration

Set the `API_URL` environment variable to point to your backend API. Defaults to `http://localhost:3000`.

## API Endpoints

The app expects the following endpoints from the backend:

### Resources
- `GET /products`: Get all products
- `GET /products/:id`: Get a single product by ID
- `GET /categories`: Get all categories
- `GET /categories/:id`: Get a category by ID
- `GET /categories?slug=:slug`: Get a category by slug

### Create Product
- `POST /products`: Create a new product

**Required Fields:**
- `title`: String
- `price`: Number
- `description`: String
- `thumbnail`: URL String
- `categoryId`: Number (ID of an existing category)
- `brand`: String

### Update Product
- `PATCH /products/:id`: Update an existing product

### Delete Product
- `DELETE /products/:id`: Delete a product

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
