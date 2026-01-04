"use client"

import { useState } from "react"
import { Star, ThumbsUp, Briefcase, MessageSquare } from "lucide-react"
import { CustomButton } from "./custom-button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"
import { Label } from "./label"
import { Textarea } from "./textarea"

interface FeedbackDialogProps {
  letterId: string
  onSubmit?: () => void
}

export function FeedbackDialog({ letterId, onSubmit }: FeedbackDialogProps) {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [wasUsed, setWasUsed] = useState(false)
  const [gotInterview, setGotInterview] = useState(false)
  const [comments, setComments] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          letterId,
          rating,
          wasUsed,
          gotInterview,
          comments: comments.trim() || undefined,
        }),
      })

      if (response.ok) {
        setOpen(false)
        onSubmit?.()
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <CustomButton variant="outline" size="sm" icon={<Star className="w-4 h-4" />}>
          Rate This Letter
        </CustomButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Help Us Improve</DialogTitle>
          <DialogDescription>
            Your feedback helps the AI generate better cover letters for everyone
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>How would you rate this cover letter?</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-amber-500 text-amber-500'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setWasUsed(!wasUsed)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                wasUsed
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <ThumbsUp className={`w-5 h-5 ${wasUsed ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="text-sm font-medium">I used this cover letter</span>
            </button>

            <button
              type="button"
              onClick={() => setGotInterview(!gotInterview)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                gotInterview
                  ? 'border-green-600 bg-green-600/5'
                  : 'border-border hover:border-green-600/50'
              }`}
            >
              <Briefcase className={`w-5 h-5 ${gotInterview ? 'text-green-600' : 'text-muted-foreground'}`} />
              <span className="text-sm font-medium">I got an interview!</span>
            </button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Additional Comments (Optional)
            </Label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="What did you like or what could be improved?"
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <CustomButton
            variant="outline"
            onClick={() => setOpen(false)}
            fullWidth
            disabled={isSubmitting}
          >
            Cancel
          </CustomButton>
          <CustomButton
            onClick={handleSubmit}
            fullWidth
            disabled={rating === 0 || isSubmitting}
            loading={isSubmitting}
          >
            Submit Feedback
          </CustomButton>
        </div>
      </DialogContent>
    </Dialog>
  )
}
