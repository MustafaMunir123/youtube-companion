import spacy

nouns = ""

nlp = spacy.load("en_core_web_sm") 

text = "When is Rimac Nevera mentioned"
text_tokens = text.split(" ")
for word in text_tokens:
    doc = nlp(word) 

    if(doc[0].tag_ == 'NNP'):
        nouns += word + " "
        print(word, " is a noun.") 
    else: 
        print(word, " is not a noun.") 
print(nouns)

# python -m spacy download en_core_web_sm

