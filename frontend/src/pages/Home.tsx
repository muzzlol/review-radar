import { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Header } from '@/components/header'
import { RatingPieChart } from '@/components/pie-chart'
import { ConfidenceHistogram } from '@/components/histogram'
import { ReviewCard } from '@/components/review-card'

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
    setAnalyzedData(null) // Reset analyzed data when switching modes
  }

  const handleUrlSubmit = useCallback(async () => {
    setIsLoading(true)
    setAnalyzedData(null) // Reset analyzed data before fetching new data
    // Simulating API call
    setTimeout(() => {
      const mockData: Review[] = [
        {review_text: "This product exceeded my expectations! The quality is outstanding, and it's clear that a lot of thought went into its design. I've been using it for a few weeks now, and I'm consistently impressed with its performance. Highly recommend to anyone in the market for this type of product.", confidence: 92, label: true, rating: "5/5" },
        {review_text: "Terrible quality, would not recommend. The product arrived damaged and customer service was unhelpful.", confidence: 78, label: false, rating: "1/5" },
        {review_text: "Average product, nothing special. It does the job, but there's room for improvement in terms of design and functionality.", confidence: 75, label: true, rating: "3/5" },
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

  return (
    <div className="min-h-screen w-screen bg-gray-100 overflow-x-hidden">
      <Header />
      <main className="w-full px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-12">
            <button
              className={`w-full md:w-64 h-32 md:h-64 text-2xl font-bold rounded-2xl shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl ${
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
            <div className="hidden md:block h-64 w-px bg-gray-300"></div>
            <button
              className={`w-full md:w-64 h-32 md:h-64 text-2xl font-bold rounded-2xl shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl ${
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

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
              {isLoading ? (
                <>
                  <Card className="lg:col-span-5">
                    <CardHeader>
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-[250px] w-[250px] rounded-full mx-auto" />
                    </CardContent>
                  </Card>
                  <Card className="lg:col-span-7">
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
                  <div className="lg:col-span-5">
                    <RatingPieChart data={analyzedData} />
                  </div>
                  <div className="lg:col-span-7">
                    <ConfidenceHistogram data={analyzedData} />
                  </div>
                </>
              ) : null}
            </div>

            {isLoading ? (
              <div className="mt-12 space-y-8">
                <h2 className="text-2xl font-bold text-center mb-6">Analyzed Reviews</h2>
                {[1, 2, 3, 4].map((index) => (
                  <Card key={index} className="w-full max-w-md mx-auto">
                    <CardHeader className="relative pb-0">
                      <Skeleton className="h-8 w-8 rounded-full absolute top-4 left-4" />
                      <div className="ml-12 pr-4">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-end">
                        <div className="space-x-2">
                          <Skeleton className="h-6 w-24 inline-block" />
                          <Skeleton className="h-6 w-24 inline-block" />
                        </div>
                        <Skeleton className="h-16 w-16 rounded-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : analyzedData ? (
              <div className="mt-12 space-y-8">
                <h2 className="text-2xl font-bold text-center mb-6">Analyzed Reviews</h2>
                {analyzedData.map((review, index) => (
                  <ReviewCard key={index} review={review} index={index + 1} />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  )
}
