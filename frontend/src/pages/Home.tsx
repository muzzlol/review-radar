import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function HomePage() {
  const [selectedMode, setSelectedMode] = useState<'automatic' | 'manual' | null>('automatic')
  const [url, setUrl] = useState('')

  const handleModeSelect = (mode: 'automatic' | 'manual') => {
    setSelectedMode(mode)
  }

  const handleUrlSubmit = () => {
    console.log('Analyzing reviews for URL:', url)
    // Add your logic here to handle the URL submission
  }

  const handleManualSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const review = formData.get('review')
    console.log('Submitted review:', review)
    // Add your logic here to handle the manual review submission
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

      <div className="mt-12 max-w-2xl mx-auto">
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
            >
              Analyze Reviews
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
      </div>
    </div>
  )
}