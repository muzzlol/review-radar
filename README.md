
# ReviewRadar

# ReviewRadar: Fake vs Genuine Review Detection

ReviewRadar is a web application that allows users to send links to review pages, and classifies each review as **real** or **fake** based on a user-defined strictness level. The application uses **crawl4ai** to scrape reviews from the provided URLs, processes them through an **OpenAI LLM extraction strategy** to generate the required JSON format, and then passes the reviews to a **pretrained classifier** with **88% accuracy** for classification.

Users can also input individual reviews for classification directly on the app. Additionally, the app provides an **open API** that allows developers to use the model for review classification through a simple JSON interface.


**Key Differences Between Fake and Real Reviews**:

1. **Overly Positive Language** (Fake): Exaggerated praise with phrases like "Love this!", "Amazing!", and "10 Stars", often without specifics.
2. **Repetitive Phrasing** (Fake): Common phrases like "I love" and "the only problem is" repeated across reviews.
3. **Personal Pronouns** (Fake): Frequent use of "I", "we", or "my" to create a forced personal connection.
4. **Contradictory/Incomplete Sentences** (Fake): Some reviews seem cut off or make contradictory statements.
5. **Time Mentions** (Fake): Fake reviews often mention usage duration to imply long-term experience.
6. **Specific & Critical Feedback** (Real): Real reviews focus on specific product features, highlighting both pros and cons.
7. **Practicality Focus** (Real): Emphasis on product functionality and day-to-day use.
8. **Balanced Opinions** (Real): Mix of positive and negative points.
9. **Short & Objective** (Real): Concise and direct feedback, avoiding unnecessary embellishment.

## Features

- **Review Page Analysis**: Users can submit URLs containing reviews, which are scraped and classified as real or fake based on user-selected strictness levels.
- **Individual Review Testing**: Users can input single reviews and get immediate feedback on their authenticity.
- **Data Visualization**: The app offers insightful visualizations, such as pie charts and histograms, to help users analyze the distribution of real and fake reviews on a page.
- **Open API**: Developers can access an API endpoint to integrate the model into their own applications for fake review detection.

## API Endpoint

**`POST /api/openapi-verify-review`**

Developers can use this endpoint to verify reviews through a simple JSON interface. The input includes the review text and a threshold level (high, medium, or low), and the output is a classification of the review as real or fake.

### Example Request:

```json
{
  "review": "Great product, highly recommend!",
  "threshold": "high"
}
```

### Example Response:

```json
{
  "analyzed_reviews": {
    "review_text": "Great product, highly recommend!",
    "is_fake": false,
    "confidence": 0.92
  }
}
```

## Model Approach

**Objective**: To classify reviews as fake or genuine using text-based features.

### Algorithm:

- **Support Vector Classifier (SVC)**, chosen for its effectiveness in text classification tasks.

### Process

1. **Data Preparation**:

   - Loaded a dataset of reviews and preprocessed the text (removing punctuation, filtering stop words).
   - Split the dataset into training and testing sets.

2. **Text Processing**:

   - Used a text processing function to prepare reviews for vectorization.
   - Applied **CountVectorizer** to convert the text into a bag-of-words model.

3. **Model Training**:

   - Created a pipeline combining:
     - **CountVectorizer**: Converts text into numerical vectors.
     - **TF-IDF Transformer**: Scales vectors by term frequency-inverse document frequency.
     - **SVC Classifier**: Trained on the vectorized data.
   - Trained the model on the preprocessed data.

4. **Model Saving**:
   - Saved the trained model using **joblib** for later predictions.

### Outcome:

- The model achieves **88% accuracy** in classifying reviews as real or fake.
- Successfully loads the model for inference, allowing users to analyze new reviews.

## How It Works

1. **User Submission**: Users submit a URL containing reviews or an individual review.
2. **Scraping and Parsing**: The application scrapes reviews from the URL using **crawl4ai**, and the scraped content is processed through an OpenAI LLM to generate structured JSON data.
3. **Review Classification**: The structured data is passed through the pretrained SVC classifier to identify fake reviews.
4. **Visualization**: The app displays the results, offering visual insights through pie charts and histograms.

## Usage Example

Users can submit a link to a review page and get a visual breakdown of real vs fake reviews in a pie chart and histogram format, based on their chosen strictness level (high, medium, low). They can also manually input a review to check its authenticity.

## Conclusion

ReviewRadar simplifies the process of detecting fake reviews, offering both a web interface and a developer-friendly API. Its robust classification pipeline, powered by SVC, ensures high accuracy and reliable results, making it an essential tool for consumers and developers alike.