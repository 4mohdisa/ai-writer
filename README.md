# Cover Letter Generator

A minimalist web application that generates tailored cover letters for job applications using AI. Simply paste a job posting and get a personalized cover letter based on your profile.

## Features

- **Clean, minimalist design** with white and black theme
- **Mobile-first responsive layout** with max 720px width
- **Form validation** with inline error messages
- **Real-time character counting** for text areas
- **Copy to clipboard** functionality with success notifications
- **Redux state management** with automatic persistence across sessions
- **User profile persistence** - Your details are saved and auto-filled on return visits
- **Error handling** with retry functionality
- **Loading states** with spinners and disabled buttons
- **AI Learning System** - Improves over time by learning from successful cover letters
- **Feedback Collection** - Rate letters to help the AI improve for everyone
- **Comprehensive Resume Parsing** - Extracts work experience, education, certifications, and projects
- **Detailed Cover Letters** - Uses specific achievements and responsibilities from your resume

## Tech Stack

- **Next.js 15** with React 18
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Google Gemini 2.0 Flash API** for AI-powered cover letter generation
- **Redux Toolkit** with Redux Persist for state management
- **Automatic State Persistence** across sessions

## Components

### Reusable UI Components
- `InputField` - Text input with validation and error states
- `TextAreaField` - Textarea with character counter and validation
- `CustomButton` - Button with primary, secondary, ghost variants and loading states
- `CustomCard` - Card layout component with optional title and description
- `AlertBanner` - Alert messages for errors, success, and info
- `Spinner` - Loading spinner in multiple sizes

### Main Component
- `CoverLetterGenerator` - Main form component with all functionality

## Form Fields

- **Job Title** (required) - The position you're applying for
- **Company Name** (required) - Name of the hiring company
- **Job Location** (optional) - Location of the job
- **Job Link** (optional) - URL to the job posting (validated)
- **Job Description** (required) - Full job posting content
- **Extra Notes** (optional) - Additional information to include

## API

### POST /api/parse-resume

Parses uploaded resume files (PDF, DOCX, TXT) and extracts comprehensive user information using Gemini AI.

**Request:**
- Multipart form data with `resume` file field
- Supported formats: PDF, DOCX, TXT
- Max file size: 5MB

**Response:**
```json
{
  "userName": "John Doe",
  "email": "john@example.com",
  "phone": "+1 (555) 123-4567",
  "professionalSummary": "Experienced software engineer with 5 years...",
  "keySkills": "JavaScript, React, Node.js, Python, AWS",
  "totalYearsExperience": "5 years",
  "workExperience": [
    {
      "company": "Tech Corp",
      "position": "Senior Software Engineer",
      "duration": "2020 - Present",
      "responsibilities": ["Led team of 5 developers", "Architected microservices"],
      "achievements": ["Reduced load time by 40%", "Increased user engagement by 25%"]
    }
  ],
  "education": [
    {
      "institution": "University of Technology",
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "graduationYear": "2018"
    }
  ],
  "certifications": ["AWS Certified Solutions Architect", "Google Cloud Professional"],
  "projects": ["E-commerce platform with 100k+ users", "Real-time chat application"]
}
```

### POST /api/generate

Generates a tailored cover letter based on job details and user-provided profile information.

**Request:**
```json
{
  "userName": "John Doe",
  "email": "john@example.com",
  "phone": "+1 (555) 123-4567",
  "professionalSummary": "Experienced software engineer with 5 years in full-stack development",
  "keySkills": "JavaScript, React, Node.js, Python, AWS",
  "jobTitle": "Senior Software Engineer",
  "companyName": "Tech Corp",
  "jobDescription": "We are looking for...",
  "extraNotes": "Additional context...",
  "tone": "conversational"
}
```

**Response:**
```json
{
  "body": "Dear Hiring Manager\n\nI am writing to express..."
}
```

## Environment Variables

Create a `.env.local` file in the root directory with the following:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

To get a Gemini API key, visit [Google AI Studio](https://aistudio.google.com/app/apikey).

## Local Storage

The app automatically saves:
- Form data as you type
- Last generated cover letter
- Restores state on page reload

## Validation

- Required fields must be filled
- Job URL must be a valid URL format
- Form submission disabled until all validations pass
- Real-time error clearing as user types

## Usage

1. Fill in the job details form
2. Paste the job description from job boards like Seek, Indeed, or LinkedIn
3. Add any extra notes if needed
4. Click "Generate Letter" to create your cover letter
5. Copy the generated letter to your clipboard
6. Use "Clear Form" to reset all fields

## Development

```bash
npm run dev
```

The app runs on `http://localhost:3000` with hot reloading enabled.

## AI Learning System

CoverCraft implements a **Retrieval-Augmented Generation (RAG)** system that continuously improves by learning from successful cover letters.

### How It Works

1. **Generation** - Every cover letter is automatically saved with metadata
2. **Feedback** - Users rate letters (1-5 stars) and indicate if they used it or got an interview
3. **Learning** - When generating new letters, the AI retrieves similar successful examples
4. **Improvement** - Highly-rated examples are used as inspiration for better results

### Key Features

- **Automatic Storage** - Letters saved to `data/cover-letters.json`
- **Smart Retrieval** - Finds similar jobs with the same tone
- **Success Scoring** - Ranks examples by rating, usage, and interview success
- **Privacy First** - All data stored locally, no external database needed

### Using the Feedback System

After generating a letter, click **"Rate This Letter"** to:
- Give a star rating (1-5)
- Mark if you used the letter
- Indicate if you got an interview
- Add optional comments

Your feedback helps the AI generate better letters for everyone!

### Technical Details

See [LEARNING_SYSTEM.md](./LEARNING_SYSTEM.md) for complete documentation including:
- Architecture overview
- API endpoints
- Data structure
- Upgrading to a database
- Best practices

## Future Enhancements

- Multiple user profiles
- Cover letter templates
- Export to PDF
- Job application tracking
- Resume storage and management