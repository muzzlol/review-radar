from pydantic import BaseModel, Field, HttpUrl
from typing import Literal

# @router.post("/analyze-reviews")
class URLRequest(BaseModel):
    url: HttpUrl = Field(..., description="The URL to extract reviews from.")
    threshold: float = Field(0.7, description="Confidence threshold for labeling a review as fake.")  # Set a default value

# @router.post("/analyze-single-review")
class ReviewRequest(BaseModel):
    review: str = Field(..., description="Review text content.")
    threshold: float = Field(0.7, description="Confidence threshold for labeling a review as fake.")  # Set a default value
    rating: int =  Field(5,description="Rating for review.")
    
# @router.post("/openapi-verify-review")  
class ReviewRequest(BaseModel):
    review: str = Field(..., description="Review text content.")
    threshold: Literal["high", "medium", "low"] = Field("medium", description="Confidence threshold for labeling a review as fake.")