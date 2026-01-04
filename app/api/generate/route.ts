import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { getSuccessfulExamples } from '@/lib/learning-system'

type ToneType = 'professional' | 'conversational' | 'enthusiastic' | 'formal'

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

interface GenerateRequest {
  // User Information
  userName: string
  email?: string
  phone?: string
  professionalSummary?: string
  keySkills?: string
  workExperience?: WorkExperience[]
  education?: Education[]
  certifications?: string[]
  projects?: string[]
  totalYearsExperience?: string

  // Job Information
  jobTitle: string
  companyName: string
  jobDescription: string
  extraNotes?: string

  // Tone & Style
  tone: ToneType
}


export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json()

    // Validate required fields
    if (!body.userName || !body.jobTitle || !body.companyName || !body.jobDescription) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate cover letter using Gemini
    const coverLetter = await generateWithGemini(body)

    return NextResponse.json({ body: coverLetter })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Mock function kept for testing purposes (not currently used in production)
function generateMockCoverLetter(data: GenerateRequest): string {
  const { userName, email, phone, jobTitle, companyName, extraNotes, professionalSummary, keySkills } = data

  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${companyName}.${professionalSummary ? ` ${professionalSummary}` : ''}

${keySkills ? `My background in ${keySkills} aligns well with your requirements.` : ''}

Key qualifications that make me an ideal candidate:
• Relevant experience with the technologies mentioned in your job posting
• Proven track record of successful project delivery
• Strong problem-solving and analytical skills
• Excellent communication and teamwork abilities

${extraNotes ? `Additional considerations: ${extraNotes}` : ''}

I am particularly drawn to ${companyName} and would welcome the opportunity to discuss how my skills and experience can contribute to your team's continued success.

Thank you for considering my application. I look forward to hearing from you soon.

Best regards,
${userName}${email ? `\n${email}` : ''}${phone ? `\n${phone}` : ''}

---
This cover letter was generated based on the job requirements and tailored to highlight relevant experience and skills.`
}

// Helper function to get tone-specific instructions
function getToneInstructions(tone: ToneType): string {
  const toneGuides = {
    conversational: `
      Use casual conversational language
      Sound human and authentic not corporate
      Focus on problem solving mindset
      Keep sentences short and punchy
      Use I statements confidently
      No buzzwords or corporate speak
      Make it feel personal and genuine`,

    professional: `
      Use professional but approachable language
      Balance formality with personality
      Demonstrate competence without being overly casual
      Use complete sentences with proper structure
      Show enthusiasm while maintaining professionalism
      Avoid slang but do not be stiff`,

    enthusiastic: `
      Show genuine excitement about the opportunity
      Use energetic and positive language
      Express passion for the work and company
      Be dynamic and engaging in tone
      Demonstrate eagerness to contribute
      Maintain professionalism while showing personality`,

    formal: `
      Use traditional formal business language
      Maintain professional distance
      Use complete well structured sentences
      Follow traditional cover letter conventions
      Be respectful and courteous throughout
      Demonstrate seriousness and commitment`
  }

  return toneGuides[tone]
}

async function generateWithGemini(data: GenerateRequest): Promise<string> {
  const genai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  })

  // Build comprehensive user profile section
  let userProfile = `
Name ${data.userName}${data.email ? `\nEmail ${data.email}` : ''}${data.phone ? `\nPhone ${data.phone}` : ''}`

  if (data.totalYearsExperience) {
    userProfile += `\nTotal Experience ${data.totalYearsExperience}`
  }

  if (data.professionalSummary) {
    userProfile += `\nProfessional Summary ${data.professionalSummary}`
  }

  if (data.keySkills) {
    userProfile += `\nKey Skills ${data.keySkills}`
  }

  // Add detailed work experience
  if (data.workExperience && data.workExperience.length > 0) {
    userProfile += `\n\nWork Experience`
    data.workExperience.forEach((exp, index) => {
      userProfile += `\n${index + 1}. ${exp.position} at ${exp.company} (${exp.duration})`
      if (exp.responsibilities && exp.responsibilities.length > 0) {
        userProfile += `\n   Responsibilities: ${exp.responsibilities.join(', ')}`
      }
      if (exp.achievements && exp.achievements.length > 0) {
        userProfile += `\n   Achievements: ${exp.achievements.join(', ')}`
      }
    })
  }

  // Add education
  if (data.education && data.education.length > 0) {
    userProfile += `\n\nEducation`
    data.education.forEach((edu, index) => {
      userProfile += `\n${index + 1}. ${edu.degree} in ${edu.field} from ${edu.institution} (${edu.graduationYear})`
    })
  }

  // Add certifications
  if (data.certifications && data.certifications.length > 0) {
    userProfile += `\n\nCertifications: ${data.certifications.join(', ')}`
  }

  // Add projects
  if (data.projects && data.projects.length > 0) {
    userProfile += `\n\nNotable Projects`
    data.projects.forEach((project, index) => {
      userProfile += `\n${index + 1}. ${project}`
    })
  }

  // Get tone-specific instructions
  const toneInstructions = getToneInstructions(data.tone)

  // Retrieve successful examples for learning
  const successfulExamples = await getSuccessfulExamples(data.jobTitle, data.tone, 2)
  
  let examplesSection = ''
  if (successfulExamples.length > 0) {
    examplesSection = `\n\nSUCCESSFUL EXAMPLES FOR REFERENCE\nHere are examples of highly rated cover letters for similar positions with the same tone. Use these as inspiration for style and structure but DO NOT copy them. Create something unique for this applicant.\n\n`
    
    successfulExamples.forEach((example, index) => {
      examplesSection += `Example ${index + 1} for ${example.jobTitle} at ${example.companyName}\n${example.generatedLetter.substring(0, 400)}...\n\n`
    })
  }

  const prompt = `You are a professional cover letter writer helping ${data.userName} create a compelling cover letter for a job application.

Job Information
Position ${data.jobTitle}
Company ${data.companyName}
Job Description ${data.jobDescription}
Additional Notes ${data.extraNotes || 'None'}

Applicant Profile
${userProfile}

Writing Tone ${data.tone.charAt(0).toUpperCase() + data.tone.slice(1)}${examplesSection}

TONE AND STYLE REQUIREMENTS
${toneInstructions}

STRUCTURE GUIDELINES
Opening Strong hook that shows genuine interest in the company and role
Introduction Brief introduction connecting the applicant background to the role
Qualifications Highlight 2 to 3 key qualifications that match the job requirements
Value Proposition Explain what the applicant brings to the company
Closing Professional closing with clear call to action

IMPORTANT INSTRUCTIONS FOR HUMANIZED OUTPUT
Write in first person as ${data.userName}
Tailor the content specifically to the job description provided
${data.workExperience && data.workExperience.length > 0 ? 'Reference specific achievements and responsibilities from the work experience provided. Use quantifiable results when available.' : ''}
${data.education && data.education.length > 0 ? 'Mention relevant educational background when it aligns with job requirements.' : ''}
${data.certifications && data.certifications.length > 0 ? 'Highlight relevant certifications that match the job requirements.' : ''}
${data.projects && data.projects.length > 0 ? 'Reference relevant projects that demonstrate skills needed for this role.' : ''}
${data.keySkills ? 'Naturally incorporate the skills listed ' + data.keySkills : 'Focus on transferable skills and qualifications'}
${data.professionalSummary ? 'Build upon this experience ' + data.professionalSummary : 'Focus on enthusiasm and potential if experience is limited'}
${data.totalYearsExperience ? 'Emphasize ' + data.totalYearsExperience + ' of experience when relevant to the position' : ''}
Match the job description keywords and requirements naturally
Keep the letter concise between 230 and 280 words maximum
Make it feel authentic and personal
Include appropriate contact information at the end with name${data.email ? ' and email' : ''}${data.phone ? ' and phone' : ''}
Use specific examples from the work experience achievements and responsibilities provided
Avoid generic statements and use specific relevant details from both the job description and the applicant profile
Do NOT fabricate experience or skills not mentioned in the profile
ONLY use information explicitly provided in the applicant profile above

CRITICAL FORMATTING RULES
Do NOT use any special characters like dashes hyphens colons semicolons or bullet points
Do NOT use asterisks or any markdown formatting
Write in natural flowing paragraphs only
Use simple plain text without any special symbols
Write like a real human would write naturally
No lists no bullet points no special formatting
Just write natural conversational paragraphs

Generate the cover letter now as plain natural text`

  const response = await genai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  })

  return response.text || 'Failed to generate cover letter'
}