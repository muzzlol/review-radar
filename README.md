# ReviewRadar

ReviewRadar is a web application that classifies reviews as **real** or **fake** based on a user-defined strictness level. It leverages **crawl4ai** for scraping reviews, utilizes an **OpenAI LLM extraction strategy** for JSON formatting, and employs a **pretrained SVC classifier** with **88% accuracy** for classification.

Users can input URLs to review pages or individual reviews for immediate classification. Additionally, ReviewRadar offers an **open API** for developers to integrate fake review detection into their own applications.

## Table of Contents

- [Key Differences Between Fake and Real Reviews](#key-differences-between-fake-and-real-reviews)
- [Features](#features)
- [API Endpoint](#api-endpoint)
- [Model Approach](#model-approach)
- [How It Works](#how-it-works)
- [Usage Example](#usage-example)
- [Installation & Setup](#installation--setup)
  - [Prerequisites](#prerequisites)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Key Differences Between Fake and Real Reviews

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

- **Review Page Analysis**: Submit URLs containing reviews to be scraped and classified as real or fake based on selected strictness levels.
- **Individual Review Testing**: Input single reviews and receive immediate authenticity feedback.
- **Data Visualization**: View insightful visualizations like pie charts and histograms to analyze the distribution of real and fake reviews.
- **Open API**: Access an API endpoint to integrate fake review detection into your own applications.

## API Endpoint

**`POST /api/openapi-verify-review`**

Developers can verify reviews through a simple JSON interface. The input includes the review text and a threshold level (`high`, `medium`, or `low`), and the output is a classification of the review as real or fake.

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

**Objective**: Classify reviews as fake or genuine using text-based features.

### Algorithm

- **Support Vector Classifier (SVC)**: Chosen for its effectiveness in text classification tasks.

### Process

1. **Data Preparation**:
   - Loaded a dataset of reviews and preprocessed the text (removing punctuation, filtering stop words).
   - Split the dataset into training and testing sets.

2. **Text Processing**:
   - Prepared reviews for vectorization using a text processing function.
   - Applied **CountVectorizer** to convert the text into a bag-of-words model.

3. **Model Training**:
   - Created a pipeline combining:
     - **CountVectorizer**: Converts text into numerical vectors.
     - **TF-IDF Transformer**: Scales vectors by term frequency-inverse document frequency.
     - **SVC Classifier**: Trained on the vectorized data.
   - Trained the model on the preprocessed data.

4. **Model Saving**:
   - Saved the trained model using **joblib** for later predictions.

### Outcome

- Achieves **88% accuracy** in classifying reviews as real or fake.
- Allows users to analyze new reviews by loading the model for inference.

## How It Works

1. **User Submission**: Submit a URL containing reviews or an individual review.
2. **Scraping and Parsing**: Scrapes reviews from the URL using **crawl4ai** and processes the content through an OpenAI LLM to generate structured JSON data.
3. **Review Classification**: Passes the structured data through the pretrained SVC classifier to identify fake reviews.
4. **Visualization**: Displays the results with visual insights through pie charts and histograms.

## Usage Example

Submit a link to a review page to receive a visual breakdown of real vs. fake reviews in pie chart and histogram formats based on the chosen strictness level (`high`, `medium`, `low`). Alternatively, manually input a review to check its authenticity.

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

1. **Navigate to the Backend Directory**:
    ```bash
    cd ReviewRadar/backend
    ```

2. **Set Up Environment Variables**:
    - Create a `.env` file in the `backend` directory based on the `.env.example` provided.
    - Add necessary environment variables, such as your OpenAI API key.
    
    ```env:backend/.env.example
    OPENAI_API_KEY=your_openai_api_key
    ```

3. **Choose Your Installation Method**:

    - **Using `pip`**:
        1. **Create a Virtual Environment**:
            ```bash
            python3.12 -m venv venv
            ```

        2. **Activate the Virtual Environment**:
            - **On macOS/Linux**:
                ```bash
                source venv/bin/activate
                ```
            - **On Windows**:
                ```bash
                venv\Scripts\activate
                ```

        3. **Install Dependencies**:
            ```bash
            pip install --upgrade pip
            pip install -r requirements.txt
            ```
    - **Using Poetry**:
        1. **Install Poetry** (if not already installed):
            ```bash
            curl -sSL https://install.python-poetry.org | python3 -
            ```

        2. **Set Python Version**:
            ```bash
            poetry env use python3.12
            ```

        3. **Check Python Version & Environment Path**:
            ```bash
            poetry env info
            ```
            Take note of the `Path` field in the output - you can use this path as the Python interpreter in VS Code or your preferred editor's settings.

        4. **Activate the Virtual Environment**:
            ```bash
            poetry shell
            ```

        5. **Install Dependencies**:
            ```bash
            poetry install
            ```

4. **Run the Backend Server**:
    ```bash
    uvicorn main:app --reload
    ```

    The backend server will run on `http://localhost:8000` by default.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes or improvements. Future work includes upgrading the model to a deep learning approach to better capture the sequential relationships between words and their indexing in the overall review text.

## License

MIT License. See `LICENSE` for more information.