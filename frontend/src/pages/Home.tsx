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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

type Review = {
  review_text: string
  confidence: number
  label: boolean
  rating: string
}

type ThresholdOption = 'lenient' | 'average' | 'strict'
type ThresholdValues = {
  lenient: number
  average: number
  strict: number
}

const THRESHOLD_VALUES: ThresholdValues = {
  lenient: 0.60,
  average: 0.70,
  strict: 0.90,
}

const validateAndFormatRating = (value: string): string | null => {
  const numValue = parseInt(value)
  if (isNaN(numValue) || numValue <= 0 || numValue > 5) return null
  return `${numValue}/5`
}

type ApiResponse = {
  analyzed_reviews: {
    review_text: string
    confidence: number
    label: boolean
    rating: string
  }[]
}

export default function HomePage() {
  const { toast } = useToast()
  const [selectedMode, setSelectedMode] = useState<'automatic' | 'manual' | null>('automatic')
  const [url, setUrl] = useState('')
  const [analyzedData, setAnalyzedData] = useState<Review[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [threshold, setThreshold] = useState<ThresholdOption | undefined>()
  const [manualRating, setManualRating] = useState('')
  const [ratingError, setRatingError] = useState<string | null>(null)
  const [manualReviews, setManualReviews] = useState<Review[]>([]);

  const handleModeSelect = (mode: 'automatic' | 'manual') => {
    setSelectedMode(mode)
    setAnalyzedData(null) // Reset analyzed data when switching modes
  }

  const handleUrlSubmit = useCallback(async () => {
    if (!url || !threshold) {
      alert('Please enter both URL and threshold');
      return;
    }

    setIsLoading(true);
    setAnalyzedData(null);

    try {
      const thresholdValue = THRESHOLD_VALUES[threshold];
      console.log('Sending request with:', {
        url,
        threshold: thresholdValue
      });
      
      const response = await fetch('http://localhost:8000/api/analyze-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          threshold: thresholdValue
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Server response:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(
          errorData?.detail || 
          `Server error: ${response.status} ${response.statusText}`
        );
      }

      const data: ApiResponse = await response.json();
      console.log('Received response:', data);
      
      const transformedData: Review[] = data.analyzed_reviews.map(review => ({
        review_text: review.review_text,
        confidence: review.confidence,
        label: review.label,
        rating: review.rating
      }));

      setAnalyzedData(transformedData);

      // Add this after successful analysis
      toast({
        title: "Reviews Analyzed",
        description: "Successfully analyzed reviews from the provided URL",
        variant: "default",
      })
    } catch (error) {
      console.error('Error details:', error);
      alert(error instanceof Error ? error.message : 'Failed to analyze reviews. Please try again.');
      toast({
        title: "Error",
        description: "Failed to analyze reviews. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false);
    }
  }, [url, threshold]);

  const handleManualSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Get the form element and review text directly from the form
    const form = e.target as HTMLFormElement;
    const reviewTextarea = form.querySelector('textarea[name="review"]') as HTMLTextAreaElement;
    const reviewText = reviewTextarea?.value;
    
    if (!reviewText?.trim()) {
      alert('Please enter a review');
      return;
    }

    const formattedRating = validateAndFormatRating(manualRating);
    if (!formattedRating) {
      setRatingError('Please enter a valid rating (1-5)');
      return;
    }

    setIsLoading(true);

    try {
      // Keep the current threshold if it exists, otherwise use 'average'
      const currentThreshold = threshold || 'average';
      const thresholdValue = THRESHOLD_VALUES[currentThreshold];
      
      console.log('Sending manual review:', {
        review: reviewText,
        threshold: thresholdValue,
        rating: formattedRating
      });

      const response = await fetch('http://localhost:8000/api/analyze-single-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          review: reviewText,
          threshold: thresholdValue,
          rating: formattedRating
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to analyze review');
      }

      console.log('Received response:', data);

      // Add the new review to the list
      const newReview = data.analyzed_reviews[0];
      setManualReviews(prevReviews => [...prevReviews, newReview]);

      // Clear the form inputs
      reviewTextarea.value = '';  // Clear the textarea
      setManualRating('');       // Clear the rating

      // Add this after successful analysis
      toast({
        title: "Review Analyzed",
        description: "Successfully analyzed the provided review",
        variant: "default",
      })
    } catch (error) {
      console.error('Error details:', error);
      alert(error instanceof Error ? error.message : 'Failed to analyze review. Please try again.');
      toast({
        title: "Error",
        description: "Failed to analyze review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false);
    }
  };

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
                <div className="flex space-x-4 items-center">
                  <Input
                    type="url"
                    placeholder="Enter URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 text-lg p-6 rounded-xl border-2 border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                  />
                  <Select
                    value={threshold}
                    onValueChange={(value: ThresholdOption) => setThreshold(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue defaultValue="" placeholder="Set threshold" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="lenient">Lenient</SelectItem>
                        <SelectItem value="average">Average</SelectItem>
                        <SelectItem value="strict">Strict</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
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
              <div className="space-y-8">
                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <div className="flex space-x-4">
                    <Textarea
                      name="review"
                      placeholder="Enter your review here"
                      className="flex-1 h-48 text-lg p-6 rounded-xl border-2 border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                    />
                    <div className="flex flex-col space-y-4 w-[180px]">
                      <Select
                        value={threshold}
                        onValueChange={(value: ThresholdOption) => setThreshold(value)}
                      >
                        <SelectTrigger>
                          <SelectValue defaultValue="" placeholder="Set threshold" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lenient">Lenient</SelectItem>
                          <SelectItem value="average">Average</SelectItem>
                          <SelectItem value="strict">Strict</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="space-y-2">
                        <Input
                          type="number"
                          placeholder="Rating (1-5)"  // Updated placeholder
                          value={manualRating}
                          onChange={(e) => {
                            setManualRating(e.target.value)
                            setRatingError(null)
                          }}
                          className="w-full"
                          min="1"
                          max="5"  // Changed from 10 to 5
                        />
                        {ratingError && (
                          <p className="text-red-500 text-sm">{ratingError}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <Button 
                      type="submit"
                      className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-xl py-6 rounded-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Analyzing...' : 'Submit Review'}
                    </Button>
                    {manualReviews.length > 0 && (
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setManualReviews([])}
                        className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200 hover:border-red-300"
                      >
                        Clear All
                      </Button>
                    )}
                  </div>
                </form>

                {manualReviews.length > 0 && (
                  <div className="mt-12 space-y-8">
                    <h2 className="text-2xl font-bold text-center mb-6">Analyzed Reviews</h2>
                    {manualReviews.map((review, index) => (
                      <ReviewCard 
                        key={`manual-review-${index}`} 
                        review={review} 
                        index={index + 1} 
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
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
                  <RatingPieChart data={analyzedData} />
                  <ConfidenceHistogram data={analyzedData} />
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
