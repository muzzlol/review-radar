'use client'

import { useState, useMemo, useCallback } from 'react'
import { TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label, Pie, PieChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { ReviewCard } from "@/components/review-card"

type Review = {
  review_text: string
  confidence: number
  label: boolean
  rating: string
}

export default function HomePage() {
  const [selectedMode, setSelectedMode] = useState<'automatic' | 'manual' | null>('automatic')
  const [url, setUrl] = useState('')
  const [analyzedData, setAnalyzedData] = useState<Review[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleModeSelect = (mode: 'automatic' | 'manual') => {
    setSelectedMode(mode)
  }

  const handleUrlSubmit = useCallback(async () => {
    setIsLoading(true)
    // Simulating API call
    setTimeout(() => {
      const mockData: Review[] = [
        {review_text: "This product exceeded my expectations! The quality is outstanding, and it's clear that a lot of thought went into its design. I've been using it for a few weeks now, and I'm consistently impressed with its performance. Highly recommend to anyone in the market for this type of product.", confidence: 92, label: true, rating: "5/5" },
        {review_text: "Terrible quality, would not recommend. The product arrived damaged and customer service was unhelpful.", confidence: 78, label: false, rating: "1/5" },
        {review_text: "Average product, nothing special. It does the job, but there's room for improvement in terms of design and functionality.", confidence: 75, label: true, rating: "1/5" },
        {review_text: "Great value for money, very satisfied. While it's not perfect, it offers excellent features for its price point.", confidence: 88, label: true, rating: "4/5" },
      ]
      setAnalyzedData(mockData)
      setIsLoading(false)
    }, 2000) // 2 second delay to simulate API call
  }, [])

  const handleManualSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const review = formData.get('review')
    console.log('Submitted review:', review)
    // Add your logic here to handle the manual review submission
  }

  const prepareDonutChartData = useMemo(() => {
    if (!analyzedData) return []
    const ratingCounts = analyzedData.reduce((acc, review) => {
      const rating = review.rating.split('/')[0]
      acc[rating] = (acc[rating] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(ratingCounts).map(([rating, count]) => ({
      rating: `${rating}/5`,
      count,
      fill: `hsl(${parseInt(rating) * 60}, 70%, 50%)`
    }))
  }, [analyzedData])

  const totalReviews = useMemo(() => {
    return analyzedData ? analyzedData.length : 0
  }, [analyzedData])

  const prepareHistogramData = useMemo(() => {
    if (!analyzedData) return []
    const confidenceRanges = Array.from({length: 10}, (_, i) => ({
      range: `${i*10 + 1}-${(i+1)*10}`,
      count: 0
    }))

    analyzedData.forEach(review => {
      const rangeIndex = Math.floor(review.confidence / 10)
      confidenceRanges[rangeIndex].count++
    })

    return confidenceRanges
  }, [analyzedData])

  const chartConfig: ChartConfig = {
    count: {
      label: "Count",
    },
    "1/5": {
      label: "1 Star",
      color: "hsl(var(--chart-1))",
    },
    "2/5": {
      label: "2 Stars",
      color: "hsl(var(--chart-2))",
    },
    "3/5": {
      label: "3 Stars",
      color: "hsl(var(--chart-3))",
    },
    "4/5": {
      label: "4 Stars",
      color: "hsl(var(--chart-4))",
    },
    "5/5": {
      label: "5 Stars",
      color: "hsl(var(--chart-5))",
    },
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <div className="flex justify-center items-center space-x-8 mb-12">
        <button
          className={`w-64 h-64 text-2xl font-bold rounded-2xl shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl ${
            selectedMode === 'automatic'
              ? 'bg-teal-600 text-white'
              : 'bg-white text-teal-600 hover:bg-teal-50'
          }`}
          onClick={() => handleModeSelect('automatic')}
          style={{
            boxShadow: selectedMode === 'automatic' 
              ? '0 10px 0 rgb(13 148 136)' 
              : '0 10px 0 rgb(204 251 241)',
          }}
        >
          Automatic
        </button>
        <div className="h-64 w-px bg-gray-300"></div>
        <button
          className={`w-64 h-64 text-2xl font-bold rounded-2xl shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl ${
            selectedMode === 'manual'
              ? 'bg-teal-600 text-white'
              : 'bg-white text-teal-600 hover:bg-teal-50'
          }`}
          onClick={() => handleModeSelect('manual')}
          style={{
            boxShadow: selectedMode === 'manual' 
              ? '0 10px 0 rgb(13 148 136)' 
              : '0 10px 0 rgb(204 251 241)',
          }}
        >
          Manual
        </button>
      </div>

      <div className="mt-12 max-w-4xl mx-auto">
        {selectedMode === 'automatic' && (
          <div className="flex flex-col space-y-4">
            <Input
              type="url"
              placeholder="Enter URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="text-lg p-6 rounded-xl border-2 border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
            />
            <Button 
              onClick={handleUrlSubmit}
              className="bg-teal-600 hover:bg-teal-700 text-white text-xl py-6 rounded-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? 'Analyzing...' : 'Analyze Reviews'}
            </Button>
          </div>
        )}

        {selectedMode === 'manual' && (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <Textarea
              name="review"
              placeholder="Enter your review here"
              className="w-full h-48 text-lg p-6 rounded-xl border-2 border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
            />
            <Button 
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xl py-6 rounded-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            >
              Submit Review
            </Button>
          </form>
        )}

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {isLoading ? (
            <>
              <Card>
                <CardHeader>
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[250px] w-[250px] rounded-full mx-auto" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-4 w-[300px]" />
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[250px] w-full" />
                </CardContent>
              </Card>
            </>
          ) : analyzedData ? (
            <>
              <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                  <CardTitle>Rating Distribution</CardTitle>
                  <CardDescription>Analysis of customer ratings</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                  <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                  >
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={prepareDonutChartData}
                        dataKey="count"
                        nameKey="rating"
                        innerRadius={60}
                        strokeWidth={5}
                      >
                        <Label
                          content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                              return (
                                <text
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                >
                                  <tspan
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    className="fill-foreground text-3xl font-bold"
                                  >
                                    {totalReviews}
                                  </tspan>
                                  <tspan
                                    x={viewBox.cx}
                                    y={(viewBox.cy || 0) + 24}
                                    className="fill-muted-foreground"
                                  >
                                    Reviews
                                  </tspan>
                                </text>
                              )
                            }
                          }}
                        />
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2 font-medium leading-none">
                    Average rating: {(prepareDonutChartData.reduce((acc, curr) => acc + parseInt(curr.rating) * curr.count, 0) / totalReviews).toFixed(1)}
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="leading-none text-muted-foreground">
                    Based on {totalReviews} customer reviews
                  </div>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Confidence Distribution</CardTitle>
                  <CardDescription>Distribution of confidence scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={prepareHistogramData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar  dataKey="count" fill="hsl(var(--chart-1))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>

        {analyzedData && (
          <div className="mt-12 space-y-8">
            <h2 className="text-2xl font-bold text-center mb-6">Analyzed Reviews</h2>
            {analyzedData.map((review, index) => (
              <ReviewCard key={index} review={review} index={index + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}