from pydantic import BaseModel, Field, HttpUrl

class URLRequest(BaseModel):
    url: HttpUrl = Field(..., description="The URL to extract reviews from.")
    # page_limit: int = Field(..., description="The number of pages to extract reviews from.")
