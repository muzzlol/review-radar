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

## Installation & Setup

To reproduce ReviewRadar on your local system, follow the steps below for both the frontend and backend setups.

### Prerequisites

- **Frontend**:
  - [Node.js](https://nodejs.org/) (v14.x or higher)
- **Backend**:
  - [Python](https://www.python.org/) (v3.12.x)
  - [pip](https://pip.pypa.io/en/stable/) (comes with Python)
  
### Frontend Setup

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/yourusername/ReviewRadar.git
    ```

2. **Navigate to the Frontend Directory**:
    ```bash
    cd ReviewRadar/frontend
    ```

3. **Install Dependencies**:
    ```bash
    npm install
    ```

4. **Start the Frontend Application**:
    ```bash
    npm start
    ```

    The application will run on `http://localhost:3000` by default.

### Backend Setup

There are two methods to set up the backend: using `pip` with `requirements.txt` or using Poetry. Below are the instructions for both methods.

#### Method 1: Using `pip` with `requirements.txt`

1. **Navigate to the Backend Directory**:
    ```bash
    cd ReviewRadar/backend
    ```

2. **Create a Virtual Environment**:
    ```bash
    python3.12 -m venv venv
    ```

3. **Activate the Virtual Environment**:
    - **On macOS/Linux**:
        ```bash
        source venv/bin/activate
        ```
    - **On Windows**:
        ```bash
        venv\Scripts\activate
        ```

4. **Install Dependencies**:
    ```bash
    pip install --upgrade pip
    pip install -r requirements.txt
    ```

5. **Set Up Environment Variables**:
    - Create a `.env` file in the `backend` directory based on the `.env.example` provided.
    - Add necessary environment variables, such as your OpenAI API key.
    
    ```env:backend/.env.example
    OPENAI_API_KEY=your_openai_api_key
    ```

6. **Run the Backend Server**:
    ```bash
    uvicorn main:app --reload
    ```

    The backend server will run on `http://localhost:8000` by default.

#### Method 2: Using Poetry

1. **Ensure Python 3.12+ is Installed**.

2. **Navigate to the Backend Directory**:
    ```bash
    cd ReviewRadar/backend
    ```

3. **Install Poetry**:
    ```bash
    curl -sSL https://install.python-poetry.org | python3 -
    ```
    - **Add Poetry to PATH**: Follow the on-screen instructions after installation to add Poetry to your system's PATH.

4. **Install Dependencies**:
    ```bash
    poetry install
    ```

5. **Activate the Virtual Environment**:
    ```bash
    poetry shell
    ```

6. **Set Up Environment Variables**:
    - Create a `.env` file in the `backend` directory based on the `.env.example` provided.
    - Add necessary environment variables, such as your OpenAI API key.
    
    ```env:backend/.env.example
    OPENAI_API_KEY=your_openai_api_key
    ```

7. **Run the Backend Server**:
    ```bash
    uvicorn main:app --reload
    ```

    The backend server will run on `http://localhost:8000` by default.

## Contributing

Contributions are welcome. Please open an issue or submit a pull request for any changes or improvements. Future work underway is on upgrading model to a deeplearning one to capture the sequential relationship between words and the indexing of words in the overall review text.

## License

MIT License. See `LICENSE` for more information.