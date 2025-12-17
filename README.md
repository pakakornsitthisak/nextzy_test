### Prerequisites

- Node.js 18+ and npm

1. **Set up Backend**

   ```bash
   cd backend
   npm install

   # Create .env file
   cp env.example .env
   # Edit .env and add your OMDB_API_KEY
   ```

2. **Set up Frontend**

   ```bash
   cd ../frontend
   npm install

   # Create .env.local file
   echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env
   ```

### Running the Application

1. **Start Backend Server**

   ```bash
   cd backend
   npm run start:dev
   ```

   Backend will run on `http://localhost:3000`

2. **Start Frontend Server**

   ```bash
   cd frontend
   npm run dev
   ```

   Frontend will run on `http://localhost:3001`

3. **Open your browser**
   Navigate to `http://localhost:3001`

## API Documentation

### Base URL

```
http://localhost:3000/api/movies
```

### Endpoints

#### Get Movies

```
GET /api/movies?category={category}&page={page}
```

**Query Parameters:**

- `category` (optional): `popular` | `top_rated` | `now_playing` | `upcoming` (default: `popular`)
- `page` (optional): Page number (default: 1)

**Response:**

```json
{
  "movies": [...],
  "totalPages": 500,
  "totalResults": 10000
}
```

#### Get Movie Detail

```
GET /api/movies/:id
```

**Response:**

```json
{
  "id": 123,
  "title": "Movie Title",
  "overview": "...",
  "posterPath": "...",
  "backdropPath": "...",
  "releaseDate": "2024-01-01",
  "voteAverage": 8.5,
  "voteCount": 1000,
  "runtime": 120,
  "budget": 50000000,
  "revenue": 200000000,
  ...
}
```

#### Search Movies

```
GET /api/movies/search?query={query}&page={page}
```

**Query Parameters:**

- `query` (required): Search query string
- `page` (optional): Page number (default: 1)

**Response:**

```json
{
  "movies": [...],
  "totalPages": 10,
  "totalResults": 200
}
```

You can test the API using:

- **Postman**: Import the endpoints and test manually
- **Apidog**: Create a workspace and import the API documentation
- **curl**: Use command line tools
- **Browser**: Navigate to the endpoints directly

Example:

```bash
curl http://localhost:3000/api/movies?category=popular&page=1
```
