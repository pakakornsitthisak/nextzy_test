# Nextflix Backend API

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- OMDb API Key

### Installation

```bash
npm install
```

### Running the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 📚 API Endpoints

### Get Movies

```
GET /api/movies?category={category}&page={page}
```

**Categories:** `popular`, `top_rated`, `now_playing`, `upcoming`

### Get Movie Detail

```
GET /api/movies/:id
```

### Search Movies

```
GET /api/movies/search?query={query}&page={page}
```
