# Database Setup Guide

This project uses PostgreSQL with Prisma ORM for database management.

## Prerequisites

1. PostgreSQL installed and running
2. Database named `fra` created in PostgreSQL

## Setup Instructions

### 1. Configure Database Connection

Update the `.env` file with your PostgreSQL connection details:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/fra?schema=public"
```

Replace `username` and `password` with your PostgreSQL credentials.

### 2. Run Database Migrations

```bash
# Generate Prisma client
npm run db:generate

# Run migrations to create tables
npm run db:migrate

# Seed the database with sample data (optional)
npm run db:seed
```

### 3. Database Schema

The database includes the following models:

#### User Model
- `id`: Unique identifier
- `email`: User email (unique)
- `name`: User's full name
- `password`: Hashed password for authentication
- `role`: User role (ADMIN, USER, REVIEWER)
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

#### Claim Model
- `id`: Unique identifier
- `claimNumber`: Auto-generated claim number (e.g., CLM-2024-001)
- `claimantName`: Name of the claimant
- `spouseName`: Name of the spouse (optional)
- `fatherMotherName`: Name of father/mother (optional)
- `address`: Address of the claimant
- `village`: Village name
- `gramPanchayat`: Gram Panchayat name
- `tehsilTaluka`: Tehsil/Taluka name
- `district`: District name
- `state`: State name
- `isScheduledTribe`: Boolean for Scheduled Tribe status
- `isOtherTraditionalForestDweller`: Boolean for Other Traditional Forest Dweller status
- `familyMembers`: JSON array of family members with names and ages
- `title`: Claim title
- `description`: Detailed description
- `status`: Claim status (DRAFT, PENDING, UNDER_REVIEW, APPROVED, REJECTED, PROCESSED)
- `priority`: Priority level (LOW, MEDIUM, HIGH, URGENT)
- `category`: Claim category
- `amount`: Claim amount
- `currency`: Currency (default: INR)
- `userId`: Reference to user who created the claim
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp
- `submittedAt`: Submission timestamp
- `processedAt`: Processing completion timestamp

#### Document Model
- `id`: Unique identifier
- `filename`: Stored filename
- `originalName`: Original filename
- `filePath`: File storage path
- `fileSize`: File size in bytes
- `mimeType`: MIME type
- `fileType`: Document type (INVOICE, RECEIPT, CONTRACT, etc.)
- `userId`: Reference to user who uploaded the document
- `claimId`: Reference to associated claim (optional)
- `status`: Processing status (UPLOADED, PROCESSING, PROCESSED, FAILED)
- `processedAt`: Processing completion timestamp
- `extractedText`: AI-extracted text content
- `confidence`: AI processing confidence score
- `metadata`: Additional processing metadata (JSON)
- `createdAt`: Upload timestamp
- `updatedAt`: Last update timestamp

### 4. Available Scripts

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio

# Reset database (WARNING: This will delete all data)
npm run db:reset
```

### 5. API Endpoints

#### Authentication API
- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/signin` - Sign in with email and password

#### Claims API
- `GET /api/claims` - Get all claims (with optional filters)
- `POST /api/claims` - Create a new claim
- `GET /api/claims/[id]` - Get specific claim
- `PUT /api/claims/[id]` - Update claim
- `DELETE /api/claims/[id]` - Delete claim

#### Documents API
- `GET /api/documents` - Get all documents (with optional filters)
- `POST /api/documents` - Upload new document
- `GET /api/documents/[id]` - Get specific document
- `PUT /api/documents/[id]` - Update document
- `DELETE /api/documents/[id]` - Delete document

#### Dashboard API
- `GET /api/dashboard/stats` - Get dashboard statistics

### 6. Database Service Functions

The `src/lib/database.ts` file provides service functions for:

- **User operations**: Create, find, update, delete users with password hashing
- **Claim operations**: Create, find, update, delete claims with comprehensive form data
- **Document operations**: Create, find, update, delete documents with user and claim associations
- **Utility functions**: Generate claim numbers, get dashboard stats, password verification

### 7. Example Usage

```typescript
import { userService, claimService, documentService } from '@/lib/database'

// Create a new user
const user = await userService.create({
  email: 'user@example.com',
  name: 'John Doe',
  password: 'securepassword123',
  role: 'USER'
})

// Create a new claim with comprehensive data
const claim = await claimService.create({
  claimNumber: 'CLM-2024-001',
  claimantName: 'Ramesh Gond',
  spouseName: 'Sita Gond',
  fatherMotherName: 'Bhola Gond',
  address: 'House No. 12, Near Primary School',
  village: 'Kanha',
  gramPanchayat: 'Bhoramdeo',
  tehsilTaluka: 'Mandla',
  district: 'Balaghat',
  state: 'Madhya Pradesh',
  isScheduledTribe: true,
  isOtherTraditionalForestDweller: false,
  familyMembers: [
    { name: 'Sita Gond', age: 35 },
    { name: 'Raju Gond', age: 12 }
  ],
  title: 'Forest Rights Claim',
  description: 'Claim for forest land rights',
  category: 'Forest Rights',
  amount: 50000,
  userId: user.id
})

// Upload a document
const document = await documentService.create({
  filename: 'claim-document-123.pdf',
  originalName: 'Forest Rights Document.pdf',
  filePath: '/uploads/claim-document-123.pdf',
  fileSize: 1024000,
  mimeType: 'application/pdf',
  fileType: 'IDENTITY_DOCUMENT',
  userId: user.id,
  claimId: claim.id
})

// Update document processing status
await documentService.updateStatus(
  document.id,
  'PROCESSED',
  'Extracted text content...',
  0.95,
  { extractedFields: { claimantName: 'Ramesh Gond', village: 'Kanha' } }
)
```

### 8. Environment Variables

Make sure to set these environment variables in your `.env` file:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/fra?schema=public"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3001"
```

### 9. Troubleshooting

1. **Connection Issues**: Verify PostgreSQL is running and credentials are correct
2. **Migration Errors**: Ensure the database exists and you have proper permissions
3. **Client Generation**: Run `npm run db:generate` after schema changes
4. **Type Errors**: Restart your TypeScript server after generating the client

### 10. Next Steps

1. Update the database connection string in `.env`
2. Run the migration commands
3. Test the API endpoints
4. Integrate with your frontend components
5. Add authentication and authorization as needed
