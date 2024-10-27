from pydantic import BaseModel, Field, HttpUrl

class URLRequest(BaseModel):
    url: HttpUrl = Field(..., description="The URL to extract reviews from.")
    threshold: float = Field(0.7, description="Confidence threshold for labeling a review as fake.")  # Set a default value


class ReviewRequest(BaseModel):
    review: str = Field(..., description="Review text content.")
    threshold: float = Field(0.7, description="Confidence threshold for labeling a review as fake.")  # Set a default value
    rating: int =  Field(5,description="Rating for review.")