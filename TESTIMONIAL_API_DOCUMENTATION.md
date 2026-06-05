# Testimonial Approval Workflow API Documentation

## Overview
This document describes the testimonial approval workflow backend API implementation for KHM Infra.

## Database Schema

### Testimonial Model
**File:** `src/lib/models/Testimonial.ts`

**Fields:**
- `name` (String, Required) - Name of the person submitting the testimonial
- `feedback` (String, Required) - The testimonial content/quote
- `industryType` (String, Required) - Industry of the person
- `rating` (Number, Optional, Default: 5) - Rating from 1-5
- `status` (String, Enum, Default: 'pending') - Status: 'pending' | 'approved' | 'rejected'
- `createdAt` (Date, Auto) - Timestamp when testimonial was created
- `updatedAt` (Date, Auto) - Timestamp when testimonial was last updated

## API Endpoints

### 1. POST /api/testimonials/submit
**Purpose:** Public users submit feedback/testimonials

**Request Body:**
```json
{
  "name": "John Doe",
  "feedback": "Excellent service provided by KHM Infra!",
  "industryType": "Manufacturing",
  "rating": 5
}
```

**Rules:**
- `status` is automatically set to 'pending'
- Cannot be approved directly through this endpoint
- All fields except rating are required

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Testimonial submitted successfully. It will be reviewed by the admin.",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "feedback": "Excellent service provided by KHM Infra!",
    "industryType": "Manufacturing",
    "rating": 5,
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response (Validation Error - 400):**
```json
{
  "success": false,
  "message": "Name is required"
}
```

**Testing Example:**
```bash
curl -X POST http://localhost:3000/api/testimonials/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "feedback": "Excellent service provided by KHM Infra!",
    "industryType": "Manufacturing",
    "rating": 5
  }'
```

---

### 2. GET /api/testimonials
**Purpose:** Admin retrieves all testimonials (with optional status filter)

**Query Parameters:**
- `status` (Optional) - Filter by status: 'pending', 'approved', or 'rejected'

**Examples:**
- Get all testimonials: `GET /api/testimonials`
- Get only pending: `GET /api/testimonials?status=pending`
- Get only approved: `GET /api/testimonials?status=approved`
- Get only rejected: `GET /api/testimonials?status=rejected`

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "feedback": "Excellent service provided by KHM Infra!",
      "industryType": "Manufacturing",
      "rating": 5,
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Jane Smith",
      "feedback": "Great work on the water treatment project!",
      "industryType": "Government",
      "rating": 5,
      "status": "approved",
      "createdAt": "2024-01-14T15:20:00.000Z",
      "updatedAt": "2024-01-15T09:00:00.000Z"
    }
  ]
}
```

**Testing Examples:**
```bash
# Get all testimonials
curl http://localhost:3000/api/testimonials

# Get only approved testimonials (for frontend)
curl http://localhost:3000/api/testimonials?status=approved

# Get only pending testimonials (for admin review)
curl http://localhost:3000/api/testimonials?status=pending
```

---

### 3. PATCH /api/testimonials/:id/status
**Purpose:** Admin approves or rejects testimonials

**Request Body:**
```json
{
  "status": "approved"
}
```

**Valid Status Transitions:**
- pending → approved
- pending → rejected
- approved → rejected
- rejected → approved

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Testimonial status updated to approved",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "feedback": "Excellent service provided by KHM Infra!",
    "industryType": "Manufacturing",
    "rating": 5,
    "status": "approved",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Response (Not Found - 404):**
```json
{
  "success": false,
  "message": "Testimonial not found"
}
```

**Response (Validation Error - 400):**
```json
{
  "success": false,
  "message": "Invalid status. Must be one of: pending, approved, rejected"
}
```

**Testing Examples:**
```bash
# Approve a testimonial
curl -X PATCH http://localhost:3000/api/testimonials/507f1f77bcf86cd799439011/status \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'

# Reject a testimonial
curl -X PATCH http://localhost:3000/api/testimonials/507f1f77bcf86cd799439011/status \
  -H "Content-Type: application/json" \
  -d '{"status": "rejected"}'
```

---

## Security Considerations

### Public Users (via /api/testimonials/submit):
- ✅ Can submit feedback
- ❌ Cannot approve testimonials
- ❌ Cannot reject testimonials
- ❌ Cannot modify status directly

### Admin Users (via /api/testimonials and /api/testimonials/:id/status):
- ✅ Can view all testimonials
- ✅ Can approve testimonials
- ✅ Can reject testimonials
- ✅ Can change status between any valid states

**Note:** Frontend authentication/authorization should be implemented to protect admin endpoints. This backend implementation assumes proper auth middleware will be added.

---

## Approval Workflow Explanation

1. **Submission Phase:**
   - Public user submits testimonial via `POST /api/testimonials/submit`
   - Testimonial is saved with `status: 'pending'`
   - User receives confirmation message

2. **Review Phase:**
   - Admin fetches pending testimonials via `GET /api/testimonials?status=pending`
   - Admin reviews each testimonial

3. **Decision Phase:**
   - Admin approves via `PATCH /api/testimonials/:id/status` with `status: 'approved'`
   - OR admin rejects via `PATCH /api/testimonials/:id/status` with `status: 'rejected'`

4. **Display Phase:**
   - Frontend fetches approved testimonials via `GET /api/testimonials?status=approved`
   - Only approved testimonials appear on the website

---

## Files Modified/Created

### Created Files:
1. `src/lib/models/Testimonial.ts` - MongoDB schema for testimonials
2. `src/pages/api/testimonials/submit.ts` - Public submission endpoint
3. `src/pages/api/testimonials/index.ts` - Get all testimonials endpoint
4. `src/pages/api/testimonials/[id]/status.ts` - Admin approval endpoint

### Not Modified (as per requirements):
- Homepage (`src/components/home/HomeTestimonials.tsx`)
- Admin testimonial UI (`src/pages/admin/testimonials.tsx`)
- Frontend testimonial display components

---

## Error Handling

All endpoints implement:
- ✅ Proper HTTP status codes (200, 201, 400, 404, 405, 500)
- ✅ Validation messages for missing/invalid fields
- ✅ Try/catch blocks for error handling
- ✅ MongoDB error handling (duplicate keys, cast errors, etc.)
- ✅ Console logging for debugging

---

## Next Steps (Frontend Integration)

When ready to integrate with frontend:

1. **Update Admin Testimonials Page:**
   - Replace localStorage with API calls
   - Add status display to testimonial cards
   - Add approve/reject buttons for pending testimonials
   - Filter by status (pending, approved, rejected)

2. **Update Homepage:**
   - Replace static data with API call to `GET /api/testimonials?status=approved`
   - Display only approved testimonials

3. **Add Authentication:**
   - Implement admin authentication middleware
   - Protect admin endpoints from unauthorized access
