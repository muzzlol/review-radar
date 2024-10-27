from pydantic import BaseModel, Field, HttpUrl
from typing import Literal

# @router.post("/analyze-reviews")
class URLRequest(BaseModel):
    url: HttpUrl = Field(..., description="The URL to extract reviews from.")
    threshold: float = Field(0.7, description="Confidence threshold for labeling a review as fake.")

# @router.post("/analyze-single-review")
class SingleReviewRequest(BaseModel):
    review: str = Field(..., description="Review text content.")
    threshold: float = Field(0.7, description="Confidence threshold for labeling a review as fake.")
    rating: str = Field(..., pattern=r'^\d/5$')  # Only allows ratings like "1/5", "2/5", etc.
    
# @router.post("/openapi-verify-review")  
class OpenAPIReviewRequest(BaseModel):
    review: str = Field(..., description="Review text content.")
    threshold: Literal["high", "medium", "low"] = Field("medium", description="Confidence threshold for labeling a review as fake.")
