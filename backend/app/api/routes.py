#TODO : POST /api/analyze-review endpoint. use fastapi apirouter


from fastapi import APIRouter, HTTPException
from ..models import URLRequest, ReviewRequest
from ..services.scraper import extract_reviews
from ..services.fake_review_classifier import detect_fake_reviews
from ..services.open_api_controller import api_check_fake_reviews
# from app.services.preprocessing import text_process
router = APIRouter()

@router.post("/analyze-reviews")
# input format : { url : "http:somthing.com", threshold: 0.70}
async def analyze_reviews(url_request: URLRequest):
    try:
        # Extract reviews from the provided URL
        reviews = await extract_reviews(str(url_request.url))
        # reviews = [{"review_title": "Great product", "review_text": "Really loved it", "rating": "5/5"}]
        if not reviews:
            raise HTTPException(status_code=404, detail="No reviews found.")

        # Detect fake reviews
        analyzed_reviews = detect_fake_reviews(reviews, threshold= url_request.threshold)
        # analyzed_reviews = detect_fake_reviews(1)

        
        return {"analyzed_reviews": analyzed_reviews}
        # return {"reviews list": reviews}

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    
    
@router.post("/analyze-single-review")
# input format : { review: "Text content", threshold: 0.7, rating: "1/5" or "1/10"}
async def anallyze_single_review(review_request:ReviewRequest):
    try:
        reviews = [{"review_title": "", "review_text": review_request.review, "rating": review_request.rating}]
        
        if not reviews or reviews[0]["review_title"].strip() == "":
            raise HTTPException(status_code=404, detail="No reviews sent.")

        # Detect fake reviews
        analyzed_reviews = detect_fake_reviews(reviews, threshold= review_request.threshold)

        return {"analyzed_reviews": analyzed_reviews}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


# free api 
@router.post("/openapi-verify-review")
# input format : { review: "Text content", threshold: ["high, medium, low"]}
async def analyze_single_review(review_request:ReviewRequest):
    try:
        threshold_map = {
            "high": 0.9,
            "medium": 0.75,
            "low": 0.65
        }
        mapped_threshold = threshold_map[review_request.threshold]
        
        review = [{"review_text": f"{review_request.review}"}]
        
        if not review:
            raise HTTPException(status_code=404, detail="No review recieved.")

        # Detect fake reviews
        analyzed_reviews = api_check_fake_reviews(review, threshold= mapped_threshold)

        return {"analyzed_reviews": analyzed_reviews}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
