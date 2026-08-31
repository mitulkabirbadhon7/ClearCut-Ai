# Developer API Reference — SnapCut AI

## 1. Overview
SnapCut AI provides a RESTful developer API for programmatic background removal.

## 2. Authentication
All API requests require an `x-api-key` header containing a valid developer API key.
```http
POST https://api.snapcut.ai/v1/remove-background
x-api-key: sc_live_xxxxxxxxxxxxxxxxxxxxxxxx
Content-Type: application/json
```

## 3. Endpoints

### Remove Background
`POST /v1/remove-background`

**Request Body:**
```json
{
  "image_url": "https://example.com/photo.jpg",
  "format": "png",
  "crop": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "job_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "output_url": "https://res.cloudinary.com/.../cutout.png",
  "credits_remaining": 49,
  "duration_ms": 1420,
  "expires_in_hours": 24
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or expired API key.
- `402 Payment Required`: Insufficient credit balance.
- `422 Unprocessable Entity`: Invalid image format or file size exceeded (>10MB).
- `429 Too Many Requests`: Rate limit exceeded.
