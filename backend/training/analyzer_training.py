import nltk
import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import warnings
import string
import nltk
from nltk.corpus import stopwords
from nltk import word_tokenize
from nltk.stem import PorterStemmer, WordNetLemmatizer
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.svm import SVC

nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('omw-1.4')
nltk.download('punkt')

nltk.download('punkt_tab')

# Set to ignore warnings
warnings.filterwarnings('ignore')

# Visualize rating distribution
from nltk.corpus import stopwords

# Clean text function
df = pd.read_csv('fake reviews dataset.csv')
df.dropna(inplace=True)
# Preload stop words
stop_words = set(stopwords.words('english'))

def clean_text(review):
    nopunc = [char for char in review if char not in string.punctuation]
    nopunc = ''.join(nopunc)
    return ' '.join([word for word in nopunc.split() if word.lower() not in stop_words])


# Apply text cleaning
df['text_'] = df['text_'].astype(str)
df['text_'] = df['text_'].apply(clean_text)

def preprocess(text):
    # Tokenize the text
    tokens = word_tokenize(text)
    # Filter out stop words, digits, and punctuation
    return ' '.join([word for word in tokens if word not in stop_words and not word.isdigit() and word not in string.punctuation])

# Apply preprocessing in chunks
chunk_size = 10000
for i in range(0, df.shape[0], chunk_size):
    df['text_'][i:i + chunk_size] = df['text_'][i:i + chunk_size].apply(preprocess)

df['text_'] = df['text_'].str.lower()


# Stemming and Lemmatization
stemmer = PorterStemmer()
lemmatizer = WordNetLemmatizer()

def stem_words(text):
    return ' '.join([stemmer.stem(word) for word in text.split()])

def lemmatize_words(text):
    return ' '.join([lemmatizer.lemmatize(word) for word in text.split()])

df['text_'] = df['text_'].apply(stem_words)
df['text_'] = df['text_'].apply(lemmatize_words)

# Save preprocessed dataset
df.to_csv('Preprocessed Fake Reviews Detection Dataset.csv', index=False)

df = pd.read_csv('Preprocessed Fake Reviews Detection Dataset.csv')

def text_process(review):
    nopunc = [char for char in review if char not in string.punctuation]
    nopunc = ''.join(nopunc)
    return [word for word in nopunc.split() if word.lower() not in stopwords.words('english')]

df = df.dropna(subset=['text_'])
df['text_'] = df['text_'].fillna('')


bow_transformer = CountVectorizer(analyzer=text_process)

bow_transformer.fit(df['text_'])

review4 = df['text_'][3]

bow_msg4 = bow_transformer.transform([review4])

bow_reviews = bow_transformer.transform(df['text_'])

tfidf_transformer = TfidfTransformer().fit(bow_reviews)
tfidf_rev4 = tfidf_transformer.transform(bow_msg4)

tfidf_reviews = tfidf_transformer.transform(bow_reviews)
review_train, review_test, label_train, label_test = train_test_split(df['text_'],df['label'],test_size=0.35)

pipeline = Pipeline([
    ('bow',CountVectorizer(analyzer=text_process)),
    ('tfidf',TfidfTransformer()),
    ('classifier',SVC(probability=True))
])


pipeline.fit(review_train,label_train)
svc_pred = pipeline.predict(review_test)
print('Model Prediction Accuracy:',str(np.round(accuracy_score(label_test,svc_pred)*100,2)) + '%')


import pickle

# Assuming `pipeline` is your trained model
with open('backend/models/fake_review_model.pkl', 'wb') as file:
    pickle.dump(pipeline, file)

print("Model saved to backend/models/fake_review_model.pkl")

# Load the model from the pickle file
with open('backend/models/fake_review_model.pkl', 'rb') as file:
    loaded_model = pickle.load(file)

# Test the loaded model with some data
test_data = ['very bad product.','bad' , 'very bad noob']  # Replace with your actual test data
predictions = loaded_model.predict(test_data)

# Get the class labels and probabilities
probabilities = loaded_model.predict_proba(test_data)
class_labels = loaded_model.classes_

# Print the predictions
print("Predictions:", predictions)

# Print the probabilities
for label, prob in zip(class_labels, probabilities[0]):
    print(f'Probability for {label}: {prob * 100:.2f}%')
