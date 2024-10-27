#TODO : POST /api/analyze-review endpoint. use fastapi apirouter


from fastapi import APIRouter, HTTPException
from ..models import URLRequest
from ..services.scraper import extract_reviews
from ..services.fake_review_detector import detect_fake_reviews

router = APIRouter()

@router.post("/analyze-reviews")
async def analyze_reviews(url_request: URLRequest):
    try:
        # Extract reviews from the provided URL
        reviews = await extract_reviews(str(url_request.url))

        if not reviews:
            raise HTTPException(status_code=404, detail="No reviews found.")

        # # Detect fake reviews
        # analyzed_reviews = detect_fake_reviews(reviews)

        # return {"analyzed_reviews": analyzed_reviews}
        return {"reviews list": reviews}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))