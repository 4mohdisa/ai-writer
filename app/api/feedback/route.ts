import { NextRequest, NextResponse } from 'next/server'
import { addFeedback } from '@/lib/learning-system'

interface FeedbackRequest {
  letterId: string
  rating: number
  wasUsed: boolean
  gotInterview?: boolean
  comments?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: FeedbackRequest = await request.json()

    if (!body.letterId || body.rating === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    await addFeedback(body.letterId, {
      rating: body.rating,
      wasUsed: body.wasUsed,
      gotInterview: body.gotInterview,
      comments: body.comments,
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Feedback error:', error)
    return NextResponse.json(
      { error: 'Failed to save feedback' },
      { status: 500 }
    )
  }
}
