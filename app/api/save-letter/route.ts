import { NextRequest, NextResponse } from 'next/server'
import { saveCoverLetter } from '@/lib/learning-system'

interface SaveLetterRequest {
  jobTitle: string
  companyName: string
  industry?: string
  tone: string
  generatedLetter: string
  keySkills?: string
  professionalSummary?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: SaveLetterRequest = await request.json()

    if (!body.jobTitle || !body.companyName || !body.tone || !body.generatedLetter) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const letterId = await saveCoverLetter({
      jobTitle: body.jobTitle,
      companyName: body.companyName,
      industry: body.industry,
      tone: body.tone,
      generatedLetter: body.generatedLetter,
      metadata: {
        keySkills: body.keySkills,
        professionalSummary: body.professionalSummary,
      },
    })

    return NextResponse.json({ letterId })

  } catch (error) {
    console.error('Save letter error:', error)
    return NextResponse.json(
      { error: 'Failed to save letter' },
      { status: 500 }
    )
  }
}
