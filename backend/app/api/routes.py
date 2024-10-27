#TODO : POST /api/analyze-review endpoint. use fastapi apirouter


from fastapi import APIRouter, HTTPException
from ..models import URLRequest, SingleReviewRequest, OpenAPIReviewRequest
from ..services.scraper import extract_reviews
from ..services.fake_review_classifier import detect_fake_reviews
from ..services.open_api_controller import api_check_fake_reviews
# from app.services.preprocessing import text_process

# Add prefix to the router
router = APIRouter(prefix="/api")  # This ensures all routes have /api prefix

@router.post("/analyze-reviews")
# input format : { url : "http:somthing.com", threshold: 0.70}
async def analyze_reviews(url_request: URLRequest):
    try:
        # Add logging
        print(f"Received request to analyze URL: {url_request.url}")
        print(f"Using threshold: {url_request.threshold}")
        
        # Extract reviews from the provided URL
        reviews = await extract_reviews(str(url_request.url))
        
        if not reviews:
            print("No reviews found for the URL")
            raise HTTPException(status_code=404, detail="No reviews found.")

        print(f"Successfully extracted {len(reviews)} reviews")
        
        # Detect fake reviews
        analyzed_reviews = detect_fake_reviews(reviews, threshold=url_request.threshold)
        print(f"Analysis complete. Processed {len(analyzed_reviews)} reviews")
        
        return {"analyzed_reviews": analyzed_reviews}

    except Exception as e:
        print(f"Error processing request: {str(e)}")
        print(f"Error type: {type(e)}")
        # Include more detailed error message
        raise HTTPException(status_code=500, detail=f"Error processing reviews: {str(e)}")
    
    
@router.post("/analyze-single-review")
async def analyze_single_review(review_request: SingleReviewRequest):
    try:
        print(f"Received review request: {review_request}")  # Add logging
        
        reviews = [{
            "review_title": "",  # Empty title is fine
            "review_text": review_request.review,
            "rating": review_request.rating
        }]
        
        # Remove the empty title check since we're intentionally leaving it empty
        if not reviews:
            raise HTTPException(status_code=404, detail="No reviews sent.")

        # Detect fake reviews
        analyzed_reviews = detect_fake_reviews(reviews, threshold=review_request.threshold)
        print(f"Analysis complete: {analyzed_reviews}")  # Add logging

        return {"analyzed_reviews": analyzed_reviews}
    except Exception as e:
        print(f"Error processing review: {str(e)}")  # Add logging
        raise HTTPException(status_code=500, detail=str(e))


# free api 
@router.post("/openapi-verify-review")
# input format : { review: "Text content", threshold: ["high, medium, low"]}
async def analyze_openapi_review(review_request: OpenAPIReviewRequest):
    try:
        threshold_map = {
            "high": 0.9,
            "medium": 0.75,
            "low": 0.65
        }
        mapped_threshold = threshold_map[review_request.threshold]
        
        review = [{"review_text": f"{review_request.review}"}]
        
        if not review:
            raise HTTPException(status_code=404, detail="No review received.")

        analyzed_reviews = api_check_fake_reviews(review, threshold=mapped_threshold)

        return {"analyzed_reviews": analyzed_reviews}
    except Exception as e:
        print(f"Error processing review: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
