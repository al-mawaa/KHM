# Admin Testimonial Approval Dashboard Documentation

## Overview
This document describes the upgraded Admin Testimonial Management page with approval workflow support.

## Files Modified

### 1. `src/pages/admin/testimonials.tsx`
**Changes:**
- Replaced localStorage-based data management with API integration
- Added status badges (pending=yellow, approved=green, rejected=red)
- Added approve/reject action buttons for pending testimonials
- Added status management (switch between approved/rejected)
- Added filter buttons (All, Pending, Approved, Rejected)
- Added summary counters (Total, Pending, Approved, Rejected)
- Added loading states with spinner
- Added error handling with toast notifications
- Added empty state with professional messaging
- Kept existing delete functionality
- Removed manual "Add" button (testimonials now submitted by public users)

### 2. `src/pages/api/testimonials/[id]/index.ts` (NEW)
**Purpose:** DELETE endpoint for removing testimonials
- Validates testimonial ID
- Handles MongoDB deletion
- Returns proper status codes and error messages

## UI Changes

### Summary Counters
Four cards displayed at the top showing:
- **Total** - All testimonials count
- **Pending** - Yellow badge, awaiting review
- **Approved** - Green badge, visible on website
- **Rejected** - Red badge, not visible

### Status Badges
- **Pending** - Yellow background (`bg-yellow-100 text-yellow-800`)
- **Approved** - Green background (`bg-green-100 text-green-800`)
- **Rejected** - Red background (`bg-red-100 text-red-800`)

### Filter Buttons
Filter testimonials by status with count badges:
- All (shows total count)
- Pending (shows pending count)
- Approved (shows approved count)
- Rejected (shows rejected count)

Active filter uses primary variant, others use secondary.

### Testimonial Cards
Each card displays:
- Status badge (top-left)
- Star rating (top-right)
- Feedback text (italic, line-clamp-3)
- Name (bold)
- Industry type (small)
- Created date (small, formatted)
- Action buttons (bottom)

### Action Buttons by Status

**Pending Testimonials:**
- ✓ Approve button (secondary variant, green)
- ✕ Reject button (danger variant, red)
- Delete button (ghost variant)

**Approved Testimonials:**
- ✕ Reject button (danger variant, red)
- Delete button (ghost variant)

**Rejected Testimonials:**
- ✓ Approve button (secondary variant, green)
- Delete button (ghost variant)

### Loading States
- Initial load: Full-page spinner with Loader2 icon
- Status update: Button shows spinner during API call
- Delete operation: Confirmation modal with loading state

### Empty State
When no testimonials exist:
- MessageSquare icon (large, gray)
- "No testimonials found" message
- Contextual message based on filter

### Error Handling
- Red error banner at top of page
- Toast notifications for success/error
- Console logging for debugging

## API Integrations

### GET /api/testimonials
**Usage:** Fetch all testimonials or filter by status
```typescript
const url = filter === 'all' 
  ? '/api/testimonials'
  : `/api/testimonials?status=${filter}`;

const res = await fetch(url);
const data = await res.json();
```

### PATCH /api/testimonials/:id/status
**Usage:** Update testimonial status
```typescript
const res = await fetch(`/api/testimonials/${id}/status`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: newStatus }),
});
```

### DELETE /api/testimonials/:id
**Usage:** Delete testimonial
```typescript
const res = await fetch(`/api/testimonials/${id}`, {
  method: 'DELETE',
});
```

## Approval Workflow

### 1. Submission Phase (Public)
- User submits testimonial via `POST /api/testimonials/submit`
- Status automatically set to `pending`
- Admin dashboard shows new pending testimonial

### 2. Review Phase (Admin)
- Admin navigates to `/admin/testimonials`
- Pending counter shows new submissions
- Admin clicks "Pending" filter to see only pending testimonials

### 3. Decision Phase (Admin)
**Approve:**
- Click ✓ Approve button
- API call: `PATCH /api/testimonials/:id/status` with `{ status: 'approved' }`
- Toast: "Testimonial approved successfully"
- Card moves to approved filter
- Approved counter increments

**Reject:**
- Click ✕ Reject button
- API call: `PATCH /api/testimonials/:id/status` with `{ status: 'rejected' }`
- Toast: "Testimonial rejected successfully"
- Card moves to rejected filter
- Rejected counter increments

### 4. Status Management (Admin)
**Approved → Rejected:**
- Click ✕ Reject button on approved testimonial
- Status changes to rejected
- Counter updates accordingly

**Rejected → Approved:**
- Click ✓ Approve button on rejected testimonial
- Status changes to approved
- Counter updates accordingly

### 5. Deletion (Admin)
- Click trash icon on any testimonial
- Confirmation modal appears
- API call: `DELETE /api/testimonials/:id`
- Toast: "Testimonial deleted successfully"
- Card removed from list
- Counters update

## Testing Steps

### 1. Test Public Submission
```bash
# Submit a testimonial
curl -X POST http://localhost:3000/api/testimonials/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "feedback": "This is a test testimonial",
    "industryType": "Manufacturing",
    "rating": 5
  }'
```

**Expected:** 201 response with testimonial data, status = "pending"

### 2. Test Admin Dashboard
1. Navigate to `/admin/testimonials`
2. Verify pending counter shows 1
3. Verify testimonial card appears with yellow badge
4. Verify approve and reject buttons are visible

### 3. Test Approval
1. Click ✓ Approve button
2. Verify loading spinner appears on button
3. Verify toast notification: "Testimonial approved successfully"
4. Verify card moves to approved filter
5. Verify pending counter decreases
6. Verify approved counter increases

### 4. Test Rejection
1. Submit another testimonial
2. Click ✕ Reject button
3. Verify toast notification: "Testimonial rejected successfully"
4. Verify card moves to rejected filter
5. Verify pending counter decreases
6. Verify rejected counter increases

### 5. Test Status Switching
1. Click ✕ Reject on approved testimonial
2. Verify status changes to rejected
3. Click ✓ Approve on rejected testimonial
4. Verify status changes back to approved

### 6. Test Filters
1. Click "All" filter - verify all testimonials shown
2. Click "Pending" filter - verify only pending shown
3. Click "Approved" filter - verify only approved shown
4. Click "Rejected" filter - verify only rejected shown

### 7. Test Deletion
1. Click trash icon on any testimonial
2. Verify confirmation modal appears
3. Click "Delete"
4. Verify toast notification: "Testimonial deleted successfully"
5. Verify card removed from list
6. Verify counters update

### 8. Test Empty State
1. Delete all testimonials
2. Verify empty state appears
3. Verify MessageSquare icon shown
4. Verify "No testimonials found" message

### 9. Test Error Handling
1. Stop MongoDB server
2. Navigate to admin testimonials
3. Verify error banner appears
4. Verify error message displayed

### 10. Test Loading States
1. Clear browser cache
2. Navigate to admin testimonials
3. Verify loading spinner shown
4. Verify spinner disappears after data loads

## MongoDB Verification

### Check Testimonials Collection
```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017/Khm_db

# Switch to database
use Khm_db

# View all testimonials
db.testimonials.find().pretty()

# Count by status
db.testimonials.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
])

# View pending testimonials
db.testimonials.find({ status: "pending" }).pretty()

# View approved testimonials
db.testimonials.find({ status: "approved" }).pretty()

# View rejected testimonials
db.testimonials.find({ status: "rejected" }).pretty()
```

### Verify Schema
```bash
# Check collection structure
db.testimonials.findOne()

# Expected fields:
{
  _id: ObjectId,
  name: String,
  feedback: String,
  industryType: String,
  rating: Number (default 5),
  status: String (enum: pending, approved, rejected),
  createdAt: Date,
  updatedAt: Date
}
```

### Test Status Updates
```bash
# Update status manually (for testing)
db.testimonials.updateOne(
  { _id: ObjectId("...") },
  { $set: { status: "approved" } }
)

# Verify update
db.testimonials.findOne({ _id: ObjectId("...") })
```

## Features Implemented

✅ Connected to GET /api/testimonials API
✅ Status badges (pending=yellow, approved=green, rejected=red)
✅ Approve/reject buttons for pending testimonials
✅ Status management (switch between approved/rejected)
✅ Filters (All, Pending, Approved, Rejected)
✅ Summary counters (Total, Pending, Approved, Rejected)
✅ Loading states with spinner
✅ Error handling with toast notifications
✅ Empty state with professional messaging
✅ Delete functionality preserved
✅ Responsive grid layout (1-2-3 columns)
✅ Date formatting
✅ Star rating display
✅ Text truncation (line-clamp-3)

## Not Modified (as per requirements)

- Homepage testimonials section (`src/components/home/HomeTestimonials.tsx`)
- Navbar
- Footer
- Admin shell layout
- Admin UI components

## Next Steps (Frontend Integration)

When ready to connect homepage:

1. **Update Homepage Testimonials Component:**
   - Replace static data with API call
   - Fetch from `GET /api/testimonials?status=approved`
   - Display only approved testimonials
   - Handle loading and empty states

2. **Add Public Submission Form:**
   - Create testimonial submission form on contact page
   - Call `POST /api/testimonials/submit`
   - Show success message after submission
   - Validate required fields

3. **Add Admin Authentication:**
   - Implement authentication middleware
   - Protect admin endpoints
   - Verify admin credentials before status changes
