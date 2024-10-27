import joblib
import string
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import nltk

# Ensure NLTK stopwords are downloaded
nltk.download('stopwords')
nltk.download('punkt')
stop_words = set(stopwords.words('english'))

# Load the pre-trained model
loaded_model = joblib.load('./models/fake_review_model.joblib')

def preprocess_reviews(reviews_list):
    """
    Preprocess reviews by combining title and text, removing punctuation, and filtering out stopwords.

    Args:
        reviews_list (list): A list of dictionaries containing review titles and texts.

    Returns:
        list: A list of preprocessed review strings.
    """
    processed_reviews = []
    
    for review_dict in reviews_list:
        # Combine title and text
        combined_text = review_dict["review_title"] + " " + review_dict["review_text"]
        # Remove punctuation and stop words
        tokens = word_tokenize(combined_text)
        filtered_tokens = [word.lower() for word in tokens if word.lower() not in stop_words and word not in string.punctuation]
        processed_reviews.append(" ".join(filtered_tokens))
    
    return processed_reviews

def detect_fake_reviews(reviews_list, threshold=0.70):
    """
    Detect fake reviews from a list of reviews.

    Args:
        reviews_list (list): A list of dictionaries containing review titles and texts.
        threshold (float): Confidence threshold for labeling a review as fake.

    Returns:
        list: A list of dictionaries containing review text, confidence, label, and rating.
    """
    # Preprocess reviews
    test_data = preprocess_reviews(reviews_list)

    # Predict labels and probabilities
    predictions = loaded_model.predict(test_data)
    probabilities = loaded_model.predict_proba(test_data)

    results = []
    
    for i in range(len(predictions)):
        datum = {
            "review_text": reviews_list[i]["review_title"] +  " : " +  reviews_list[i]["review_text"],
            "confidence": round(probabilities[i, 0] * 100),  # Confidence percentage
            "label": bool(probabilities[i, 0] < threshold),  # True if original, else generated
            "rating": reviews_list[i]["rating"]
        }
        results.append(datum)
    
    return results
