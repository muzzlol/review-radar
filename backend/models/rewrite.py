import pickle
import joblib



import string
from nltk.corpus import stopwords

# Ensure NLTK stopwords are downloaded
stop_words = set(stopwords.words('english'))

def text_process(review):
    """
    Preprocess the review text by removing punctuation and stop words.
    
    Args:
        review (str): The review text to process.

    Returns:
        list: A list of processed words.
    """
    nopunc = ''.join([char for char in review if char not in string.punctuation])
    return [word for word in nopunc.split() if word.lower() not in stop_words]


# Define the file paths
pkl_file_path = 'fake_review_model.pkl'  # Path to your .pkl file
joblib_file_path = 'fake_review_model.joblib'  # Desired path for the .joblib file

# Load the model from the .pkl file
with open(pkl_file_path, 'rb') as file:
    model = pickle.load(file)

# Save the model to a .joblib file
joblib.dump(model, joblib_file_path)

print(f"Model converted and saved to {joblib_file_path}")