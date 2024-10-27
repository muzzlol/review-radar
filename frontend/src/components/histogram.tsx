import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface HistogramProps {
  data: Array<{ review_text: string; confidence: number; label: boolean; rating: string }>
}

export function ConfidenceHistogram({ data }: HistogramProps) {
  const prepareHistogramData = useMemo(() => {
    // Change from 10 ranges to 5 ranges for better distribution
    const confidenceRanges = Array.from({length: 5}, (_, i) => ({
      range: `${i*20 + 1}-${(i+1)*20}`,
      count: 0
    }))

    data.forEach(review => {
      // Adjust the range index calculation
      const rangeIndex = Math.floor(review.confidence / 20)
      if (rangeIndex >= 0 && rangeIndex < confidenceRanges.length) {
        confidenceRanges[rangeIndex].count++
      }
    })
    return confidenceRanges
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confidence Distribution</CardTitle>
        <CardDescription>Distribution of confidence scores (20% intervals)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[265px]"> {/* Increased height for better visibility */}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={prepareHistogramData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--chart-1))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
