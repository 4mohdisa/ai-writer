# AI Learning System Documentation

## Overview

CoverCraft implements a **Retrieval-Augmented Generation (RAG)** system that allows the AI to improve over time by learning from successful cover letters. The system collects user feedback and uses highly-rated examples to enhance future generations.

## How It Works

### 1. **Generation & Storage**
When a user generates a cover letter:
- The letter is automatically saved to `data/cover-letters.json`
- A unique ID is assigned to track the letter
- Metadata is stored (job title, company, tone, skills, etc.)

### 2. **Feedback Collection**
Users can rate their cover letters:
- **Star Rating** (1-5 stars)
- **Usage Status** (Did they use it?)
- **Interview Success** (Did they get an interview?)
- **Comments** (Optional feedback)

### 3. **Learning Loop**
When generating new letters:
- System retrieves similar successful examples (same tone, similar job title)
- Examples are ranked by success metrics:
  - Base rating (1-5 stars)
  - +2 points if the letter was used
  - +3 points if it led to an interview
- Top 2 examples are included in the AI prompt as inspiration
- AI creates unique content while learning from successful patterns

## File Structure

```
/Users/mohammedisa/Development/Web/CoverCraft/
├── lib/
│   └── learning-system.ts          # Core learning system logic
├── app/api/
│   ├── generate/route.ts           # Updated to use RAG
│   ├── save-letter/route.ts        # Saves generated letters
│   └── feedback/route.ts           # Collects user feedback
├── components/ui/
│   └── feedback-dialog.tsx         # Feedback UI component
└── data/
    └── cover-letters.json          # Storage (auto-created)
```

## API Endpoints

### POST /api/save-letter
Saves a generated cover letter to the learning system.

**Request:**
```json
{
  "jobTitle": "Senior Software Engineer",
  "companyName": "Tech Corp",
  "tone": "conversational",
  "generatedLetter": "Dear Hiring Manager...",
  "keySkills": "JavaScript, React, Node.js",
  "professionalSummary": "5 years of experience..."
}
```

**Response:**
```json
{
  "letterId": "letter_1704345600000_abc123"
}
```

### POST /api/feedback
Submits user feedback for a cover letter.

**Request:**
```json
{
  "letterId": "letter_1704345600000_abc123",
  "rating": 5,
  "wasUsed": true,
  "gotInterview": true,
  "comments": "Great letter, got me an interview!"
}
```

**Response:**
```json
{
  "success": true
}
```

## Data Structure

Each cover letter record contains:

```typescript
{
  id: string                    // Unique identifier
  timestamp: string             // ISO timestamp
  jobTitle: string              // Position applied for
  companyName: string           // Company name
  industry?: string             // Industry (optional)
  tone: string                  // Writing tone used
  generatedLetter: string       // The actual letter
  userFeedback?: {              // User feedback (optional)
    rating: number              // 1-5 stars
    wasUsed: boolean            // Did they use it?
    gotInterview?: boolean      // Got interview?
    comments?: string           // Additional comments
  }
  metadata: {
    keySkills?: string          // User's skills
    professionalSummary?: string // User's experience
  }
}
```

## Success Metrics

The system calculates success scores:
- **Rating**: 1-5 points (from star rating)
- **Usage Bonus**: +2 points (if letter was used)
- **Interview Bonus**: +3 points (if led to interview)

**Maximum Score**: 10 points (5 stars + used + interview)

## Retrieval Algorithm

When generating a new letter:

1. **Filter** letters with good feedback (rating ≥ 4 OR used OR interview)
2. **Match** by tone (exact match required)
3. **Match** by job title (fuzzy matching - similar titles)
4. **Rank** by success score (highest first)
5. **Return** top 2 examples

## Privacy & Data

- All data is stored **locally** in `data/cover-letters.json`
- No external database required
- Users control their own data
- Can be easily deleted or backed up

## Upgrading to Database (Optional)

For production use with multiple users, consider:

### Option 1: PostgreSQL with Prisma
```bash
npm install prisma @prisma/client
npx prisma init
```

### Option 2: MongoDB
```bash
npm install mongodb
```

### Option 3: Supabase (Recommended)
```bash
npm install @supabase/supabase-js
```

Replace the JSON file storage in `lib/learning-system.ts` with database queries.

## Benefits

1. **Continuous Improvement** - AI gets better with each generation
2. **Personalized Results** - Learns what works for different job types
3. **Tone Optimization** - Improves each writing tone separately
4. **User Empowerment** - Users directly influence AI quality
5. **No External Training** - Works without fine-tuning the model

## Limitations

1. **Cold Start** - Needs initial feedback to be effective
2. **Local Storage** - JSON file not suitable for high traffic
3. **Simple Matching** - Basic keyword matching for job titles
4. **No Vector Search** - Could be enhanced with embeddings

## Future Enhancements

- **Vector Embeddings** - Use Gemini embeddings for semantic search
- **Industry Categorization** - Group by industry for better matching
- **A/B Testing** - Test different prompt strategies
- **Analytics Dashboard** - Visualize learning progress
- **Export/Import** - Share successful patterns between instances
- **Multi-user Support** - Database integration for scalability

## Getting Started

The learning system is **automatically active**. No configuration needed!

1. Generate cover letters as normal
2. Rate them using the "Rate This Letter" button
3. System automatically improves future generations
4. Check `data/cover-letters.json` to see stored data

## Monitoring

View learning system stats programmatically:

```typescript
import { getStats } from '@/lib/learning-system'

const stats = await getStats()
// Returns: { totalGenerated, withFeedback, averageRating, successRate }
```

## Best Practices

1. **Encourage Feedback** - More feedback = better results
2. **Diverse Examples** - Collect feedback across different job types
3. **Regular Cleanup** - Remove low-quality examples periodically
4. **Backup Data** - Copy `data/cover-letters.json` regularly
5. **Monitor Quality** - Check that examples are actually helpful

---

**Note**: This is a RAG (Retrieval-Augmented Generation) system, not model fine-tuning. The base Gemini model remains unchanged - we're just providing better context through successful examples.
