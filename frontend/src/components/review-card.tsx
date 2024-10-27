import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface ReviewCardProps {
  review: {
    review_text: string
    confidence: number
    label: boolean
    rating: string
  }
  index: number
}

export function ReviewCard({ review, index }: ReviewCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="relative pb-0">
        <div className="absolute top-4 left-4 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
          {index}
        </div>
        <div className="ml-12 pr-4">
          <p className="text-sm text-muted-foreground mb-2">Review</p>
          <div className="max-h-32 overflow-y-auto">
            <p className="text-sm">{review.review_text}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex justify-between items-end">
          <div className="space-x-2">
            <Badge variant="outline" className="bg-teal-50">
              Confidence: {review.confidence}%
            </Badge>
            <Badge variant="outline" className="bg-teal-50">
              Rating: {review.rating}
            </Badge>
          </div>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xs font-bold ${review.label ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {review.label ? 'Real' : 'Fake'}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}