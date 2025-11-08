# Backend API Documentation

## Endpoints

### Health Check
- **GET** `/health`
- Returns server status

### Generate Fitness Plan
- **POST** `/api/generate-plan`
- **Body**: User data object
- **Returns**: Generated fitness plan (workout, diet, tips)

### Generate Image
- **POST** `/api/generate-image`
- **Body**: `{ prompt: string }`
- **Returns**: Image generation data

### Text to Speech
- **POST** `/api/text-to-speech`
- **Body**: `{ text: string, section: string }`
- **Returns**: Audio URL

### Get Motivation Quote
- **GET** `/api/motivation-quote`
- **Returns**: Daily motivation quote

### Save Plan
- **POST** `/api/plans`
- **Body**: Plan data object
- **Returns**: Saved plan

### Get Plans
- **GET** `/api/plans`
- **Returns**: List of all saved plans

### Get Plan by ID
- **GET** `/api/plans/:id`
- **Returns**: Specific plan

## Environment Variables

```env
PORT=5000
GEMINI_API_KEY=your_key_here
ELEVENLABS_API_KEY=your_key_here
MONGODB_URI=your_connection_string
```

## Running the Server

```bash
npm install
npm run dev  # Development with auto-reload
npm start    # Production
```

