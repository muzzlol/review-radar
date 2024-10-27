import asyncio
import json
import openai
from crawl4ai import AsyncWebCrawler
from crawl4ai.extraction_strategy import LLMExtractionStrategy
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from pydantic import ValidationError
import os

# Load the .env file
load_dotenv()

# Access the API key
openai.api_key = os.getenv('OPENAI_API_KEY')


# Not a model. Just return format definition. Dont move to models.py
class Review(BaseModel):
    review_title: str = Field(..., description="Title of the review.")
    review_text: str = Field(..., description="Content of the review.")
    rating: str = Field(..., description="Rating given in the review.")


async def extract_reviews(base_url: str, page_limit:int = 1):
    """Extracts reviews from the given URL using AsyncWebCrawler and returns them as a list of JSON objects."""
    all_reviews = []
    page_number = 1

    try:
        while True:
                       
            url = f"{base_url}-page-{page_number}" if page_number > 1 else base_url

            async with AsyncWebCrawler(verbose=True) as crawler:
                result = await crawler.arun(
                    url=url,
                    word_count_threshold=1,
                    extraction_strategy=LLMExtractionStrategy(
                        provider="openai/gpt-4o-mini",
                        api_token=openai.api_key,
                        schema=Review.model_json_schema(),
                        extraction_type="schema",
                        instruction="""From the crawled content, extract all reviews. The rating is supposed to be return as a fraction like 4/5 or 7/10 depending on the website.
                            Each extracted review should be in JSON format as follows:
                            {"review_title": "Title", "review_text": "Full review text", "rating": "Rating"}"""
                    ),
                    bypass_cache=True,
                    magic = True,
                    headless= False,
                    
                )

                if not result.extracted_content:
                    print(f"No content extracted from {url}.")
                    break  # Stop if no more reviews are found
                
                # print("result.extracted_content",result.extracted_content)

                # Parse JSON response
                try:
                    parsed_reviews = json.loads(result.extracted_content)
                    # all_reviews.extend(parsed_reviews)
                    for review in parsed_reviews:
                        try:
                            # Validate and match fields to Review schema
                            validated_review = Review(**review)
                            all_reviews.append(validated_review.dict())  # Convert to dict for FastAPI compatibility
                        except ValidationError as ve:
                            print(f"Validation error for review: {ve}")
                except json.JSONDecodeError as e:
                    print(f"Error parsing JSON from {url}: {e}")
                    break
                
                # print("parsed reviews: ",parsed_reviews)
            
            if page_number == page_limit:  # Limit to 1 page for testing/ default
                break

            page_number += 1  # Move to the next page

    except Exception as e:
        print(f"An error occurred while extracting reviews: {e}")

    return all_reviews

'''example output: 
[
    {
        'review_title': 'Best mobile with Rs 11339',
        
        'review_text': "The camera quality is decent, but I did expect a bit more in terms of rear camera clarity. However, the front camera features are fantastic, perfect for selfies. This phone delivers solid performance for its price range. The overall performance is smooth, though there can be occasional lags. Thankfully, there are no heating issues, even with heavy use. One downside is the air gestures. They simply don't work. While the phone offers a few gesture-based features, none of them function as expected. Appearance-wise, I got the forest green color, and it looks stunning! It’s sleek, modern, and definitely stands out. The battery life is impressive. It easily lasts a full day, even with around 6-7 hours of continuous use. The phone's size is also spot on—comfortable to hold and carry around. Overall, for its price, this phone is one of the best budget options available, despite a few minor flaws.", 
         
        'rating': '5.0 out of 5 stars', 
        
        'error': False
    },
]
'''

# async def extract_reviews(base_url):
#     all_reviews = []
#     page_number = 1  # Start from the first page

#     while True:
#         if page_number == 2:
#             break
#         url = f"{base_url}-page-{page_number}" if page_number > 1 else base_url

#         async with AsyncWebCrawler(verbose=True) as crawler:
#             result = await crawler.arun(
#                 url=url,
#                 word_count_threshold=1,
#                 extraction_strategy=LLMExtractionStrategy(
#                     provider="openai/gpt-4o-mini",
#                     api_token= openai.api_key,  # Safely retrieve the API key
#                     # schema=Review.schema(), # schema() is depricated
#                     schema= Review.model_json_schema(),
#                     extraction_type="schema",
#                     instruction=f"""From the crawled content, extract all reviews.
#                     Each extracted review should be in JSON format as follows:
#                     {{"review_title": "Title", "review_text": "Full review text", "rating": "Rating"}}
#                     For reference use this example output: {{
#                         "review_title": "Best mobile with Rs 11339",
#                         "review_text": "The camera quality is decent, but I did expect a bit more in terms of rear camera clarity. However, the front camera features are fantastic, perfect for selfies. This phone delivers solid performance for its price range. The overall performance is smooth, though there can be occasional lags. Thankfully, there are no heating issues, even with heavy use. One downside is the air gestures. They simply don't work. While the phone offers a few gesture-based features, none of them function as expected. Appearance-wise, I got the forest green color, and it looks stunning! It’s sleek, modern, and definitely stands out. The battery life is impressive. It easily lasts a full day, even with around 6-7 hours of continuous use. The phone's size is also spot on—comfortable to hold and carry around. Overall, for its price, this phone is one of the best budget options available, despite a few minor flaws.",
#                         "rating": "3/5"
#                     }}. The JSONs will be used in Python application."""
#                 ),
#                 bypass_cache=True,
#             )
            
#             # Debugging output
#             # print(f"Extracted content from {url}: {result.extracted_content}")

#             # Check if any reviews were extracted
#             if not result.extracted_content:
#                 break  # Exit loop if no more reviews are found

#             # Parse the extracted content if it's returned as JSON string
#             try:
#                 parsed_reviews = json.loads(result.extracted_content)
#                 # print("parsed_reviews : ",parsed_reviews)
#                 all_reviews.extend(parsed_reviews)
#             except json.JSONDecodeError as e:
#                 print(f"Error parsing JSON: {e}")
#                 break

#         page_number += 1  # Move to the next page
#     return all_reviews


