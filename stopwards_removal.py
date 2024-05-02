from nltk.corpus import stopwords
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
# import nltk


"""
nltk.download('stopwords')
nltk.download('punkt')
"""

example_sent = """When is Rimac Nevera mentioned."""

stop_words = set(stopwords.words('english'))

word_tokens = word_tokenize(example_sent)
filtered_sentence = [w for w in word_tokens if not w.lower() in stop_words]

filtered_sentence = []

for w in word_tokens:
	if w not in stop_words:
		filtered_sentence.append(w)

print(word_tokens)
print(" ".join(filtered_sentence))
