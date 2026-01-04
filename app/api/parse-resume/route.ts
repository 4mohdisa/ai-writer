import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import mammoth from 'mammoth'

interface WorkExperience {
  company: string
  position: string
  duration: string
  responsibilities: string[]
  achievements: string[]
}

interface Education {
  institution: string
  degree: string
  field: string
  graduationYear: string
}

interface ParsedResumeData {
  userName: string
  email: string
  phone: string
  professionalSummary: string
  keySkills: string
  workExperience: WorkExperience[]
  education: Education[]
  certifications: string[]
  projects: string[]
  totalYearsExperience: string
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('resume') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload PDF, DOCX, or TXT file.' },
        { status: 400 }
      )
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      )
    }

    // Extract text from file based on type
    let parsedData: ParsedResumeData
    const buffer = await file.arrayBuffer()

    if (file.type === 'application/pdf') {
      // For PDFs, use OpenAI Vision API directly
      const base64 = Buffer.from(buffer).toString('base64')
      parsedData = await parseResumeWithAIVision(base64, 'pdf')
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Parse DOCX
      const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) })
      const resumeText = result.value

      if (!resumeText || resumeText.trim().length < 50) {
        return NextResponse.json(
          { error: 'Could not extract meaningful text from the resume' },
          { status: 400 }
        )
      }

      parsedData = await parseResumeWithAI(resumeText)
    } else {
      // Plain text
      const resumeText = await file.text()

      if (!resumeText || resumeText.trim().length < 50) {
        return NextResponse.json(
          { error: 'Could not extract meaningful text from the resume' },
          { status: 400 }
        )
      }

      parsedData = await parseResumeWithAI(resumeText)
    }

    return NextResponse.json(parsedData)

  } catch (error) {
    console.error('Resume parsing error:', error)
    return NextResponse.json(
      { error: 'Failed to parse resume. Please try again or fill in manually.' },
      { status: 500 }
    )
  }
}

async function parseResumeWithAIVision(base64Data: string, fileType: string): Promise<ParsedResumeData> {
  const genai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  })

  const prompt = `You are an expert resume parser. Extract comprehensive information from this resume PDF and return it as JSON.

Extract and return ONLY a JSON object with these exact fields:
{
  "userName": "Full name",
  "email": "Email address",
  "phone": "Phone number",
  "professionalSummary": "2-3 sentence career summary",
  "keySkills": "Comma-separated skills",
  "totalYearsExperience": "Total years of professional experience (e.g., '5 years', '2+ years')",
  "workExperience": [
    {
      "company": "Company name",
      "position": "Job title",
      "duration": "Time period (e.g., 'Jan 2020 - Present', '2018-2020')",
      "responsibilities": ["Key responsibility 1", "Key responsibility 2"],
      "achievements": ["Notable achievement 1", "Notable achievement 2"]
    }
  ],
  "education": [
    {
      "institution": "University/College name",
      "degree": "Degree type (e.g., 'Bachelor of Science', 'Master of Arts')",
      "field": "Field of study",
      "graduationYear": "Year (e.g., '2020', 'Expected 2024')"
    }
  ],
  "certifications": ["Certification 1", "Certification 2"],
  "projects": ["Project 1: Brief description", "Project 2: Brief description"]
}

Detailed Instructions:
- userName: Extract full name from the top of resume
- email: Extract email address (empty string if not found)
- phone: Extract phone number as-is (empty string if not found)
- professionalSummary: Write a compelling 2-3 sentence summary of their career, highlighting role, experience level, and key strengths
- keySkills: List 10-15 most relevant technical and professional skills as comma-separated values
- totalYearsExperience: Calculate or extract total years of professional experience
- workExperience: Extract ALL work positions with:
  * company: Company name
  * position: Job title/role
  * duration: Time period worked
  * responsibilities: 3-5 key responsibilities or duties
  * achievements: 2-4 quantifiable achievements or notable accomplishments
- education: Extract ALL educational qualifications
- certifications: List ALL professional certifications, licenses, or credentials
- projects: Extract notable projects with brief descriptions (especially relevant for tech roles)

If any field is not found, use empty string for strings or empty array for arrays. Return ONLY the JSON object, no other text.`

  const response = await genai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: base64Data,
            },
          },
        ],
      },
    ],
  })

  const responseText = response.text || '{}'

  try {
    // Clean the response text to extract JSON
    let jsonText = responseText.trim()
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '')
    }
    
    const parsed = JSON.parse(jsonText) as ParsedResumeData

    // Validate and provide defaults
    return {
      userName: parsed.userName || '',
      email: parsed.email || '',
      phone: parsed.phone || '',
      professionalSummary: parsed.professionalSummary || '',
      keySkills: parsed.keySkills || '',
      workExperience: parsed.workExperience || [],
      education: parsed.education || [],
      certifications: parsed.certifications || [],
      projects: parsed.projects || [],
      totalYearsExperience: parsed.totalYearsExperience || ''
    }
  } catch (error) {
    console.error('Failed to parse AI response:', error)
    console.error('Response text:', responseText)
    throw new Error('Failed to parse AI response')
  }
}

async function parseResumeWithAI(resumeText: string): Promise<ParsedResumeData> {
  const genai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  })

  const prompt = `You are an expert resume parser. Extract comprehensive information from this resume and return it as JSON.

Resume Text:
${resumeText}

Extract and return ONLY a JSON object with these exact fields:
{
  "userName": "Full name",
  "email": "Email address",
  "phone": "Phone number",
  "professionalSummary": "2-3 sentence career summary",
  "keySkills": "Comma-separated skills",
  "totalYearsExperience": "Total years of professional experience (e.g., '5 years', '2+ years')",
  "workExperience": [
    {
      "company": "Company name",
      "position": "Job title",
      "duration": "Time period (e.g., 'Jan 2020 - Present', '2018-2020')",
      "responsibilities": ["Key responsibility 1", "Key responsibility 2"],
      "achievements": ["Notable achievement 1", "Notable achievement 2"]
    }
  ],
  "education": [
    {
      "institution": "University/College name",
      "degree": "Degree type (e.g., 'Bachelor of Science', 'Master of Arts')",
      "field": "Field of study",
      "graduationYear": "Year (e.g., '2020', 'Expected 2024')"
    }
  ],
  "certifications": ["Certification 1", "Certification 2"],
  "projects": ["Project 1: Brief description", "Project 2: Brief description"]
}

Detailed Instructions:
- userName: Extract full name from the top of resume
- email: Extract email address (empty string if not found)
- phone: Extract phone number as-is (empty string if not found)
- professionalSummary: Write a compelling 2-3 sentence summary of their career, highlighting role, experience level, and key strengths
- keySkills: List 10-15 most relevant technical and professional skills as comma-separated values
- totalYearsExperience: Calculate or extract total years of professional experience
- workExperience: Extract ALL work positions with:
  * company: Company name
  * position: Job title/role
  * duration: Time period worked
  * responsibilities: 3-5 key responsibilities or duties
  * achievements: 2-4 quantifiable achievements or notable accomplishments
- education: Extract ALL educational qualifications
- certifications: List ALL professional certifications, licenses, or credentials
- projects: Extract notable projects with brief descriptions (especially relevant for tech roles)

If any field is not found, use empty string for strings or empty array for arrays. Return ONLY the JSON object, no other text.`

  const response = await genai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  })

  const responseText = response.text || '{}'

  try {
    // Clean the response text to extract JSON
    let jsonText = responseText.trim()
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '')
    }
    
    const parsed = JSON.parse(jsonText) as ParsedResumeData

    // Validate and provide defaults
    return {
      userName: parsed.userName || '',
      email: parsed.email || '',
      phone: parsed.phone || '',
      professionalSummary: parsed.professionalSummary || '',
      keySkills: parsed.keySkills || '',
      workExperience: parsed.workExperience || [],
      education: parsed.education || [],
      certifications: parsed.certifications || [],
      projects: parsed.projects || [],
      totalYearsExperience: parsed.totalYearsExperience || ''
    }
  } catch (error) {
    console.error('Failed to parse AI response:', error)
    console.error('Response text:', responseText)
    throw new Error('Failed to parse AI response')
  }
}
