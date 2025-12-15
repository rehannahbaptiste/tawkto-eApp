# Tawkto eApp - Node.js API

A public services API for selecting services and branches, built with Node.js and Express.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Access the API**
   - API: http://localhost:3000
   - OpenAPI Spec: http://localhost:3000/openapi.yaml

### Production

```bash
npm start
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | List all available services |
| GET | `/api/branches?serviceId=xxx` | List branches (optionally filtered) |
| POST | `/api/selections/service` | Select a service |
| POST | `/api/selections/branch` | Select a branch |
| GET | `/openapi.yaml` | OpenAPI specification |

## 🔧 Environment Variables

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://... (optional)
CORS_ORIGIN=*
```

## 📦 Deploy to Render

### Option 1: Using render.yaml (Blueprint)

1. Push this code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New" → "Blueprint"
4. Connect your repository
5. Render will automatically deploy based on `render.yaml`

### Option 2: Manual Setup

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your repository
4. Configure:
   - **Name**: tawkto-eapp
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Add environment variable: `NODE_ENV=production`
6. Click "Create Web Service"

Your API will be live at: `https://tawkto-eapp.onrender.com`

## 🗄️ Database (Optional)

Currently uses in-memory data. To add PostgreSQL:

1. On Render, create a PostgreSQL database
2. Copy the connection string
3. Add to your web service environment variables:
   ```
   DATABASE_URL=postgresql://...
   ```

## 📝 Project Structure

```
tawkto-eApp/
├── src/
│   ├── index.js           # Main application entry
│   ├── routes/
│   │   └── catalog.js     # API route handlers
│   ├── config/
│   │   └── database.js    # Database configuration
│   └── utils/
│       └── helpers.js     # Utility functions
├── resources/
│   └── openapi.yaml       # API specification
├── .env                   # Environment config (local)
├── .env.production        # Production environment template
├── render.yaml            # Render deployment blueprint
└── package.json           # Dependencies and scripts
```

## 🛠️ Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload

## 📖 API Documentation

See the OpenAPI specification at `/openapi.yaml` or view it in [Swagger Editor](https://editor.swagger.io/).

## 🔒 Security

- Helmet.js for security headers
- CORS configured
- Input validation with express-validator
- Non-root Docker user

## 📄 License

MIT
