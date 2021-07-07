import nltk
import json
import random
import pickle
import numpy as np
from keras.models import load_model
from nltk.stem import WordNetLemmatizer
from portfolio.settings import BASE_DIR


lemmatizer = WordNetLemmatizer()


class ChatBot:
    def __init__(self):
        self.models_path = str(BASE_DIR) + "\\Core\\chatbot\\chat_models\\"
        self.model = load_model(self.models_path + "chatbot_model.h5")
        self.intents = json.loads(open(self.models_path + 'intents.json').read())
        self.words = pickle.load(open(self.models_path + 'words.pkl', 'rb'))
        self.classes = pickle.load(open(self.models_path + 'classes.pkl', 'rb'))

    def clean_up_sentence(self, sentence):
        sentence_words = nltk.word_tokenize(sentence)
        sentence_words = [lemmatizer.lemmatize(word.lower()) for word in sentence_words]
        return sentence_words

    def bow(self, sentence, words, show_details=True):
        # tokenize the pattern
        sentence_words = self.clean_up_sentence(sentence)
        # bag of words - matrix of N words, vocabulary matrix
        bag = [0] * len(words)
        for s in sentence_words:
            for i, w in enumerate(words):
                if w == s:
                    # assign 1 if current word is in the vocabulary position
                    bag[i] = 1
                    if show_details:
                        print("found in bag: %s" % w)
        return np.array(bag)

    def get_questions(self):
        questions = []
        for intent in self.intents['intents']:
            for question in intent['patterns']:
                questions.append(question)
        else:
            return questions


    def predict_class(self, sentence):
        # filter out predictions below a threshold
        p = self.bow(sentence, self.words, show_details=False)
        res = self.model.predict(np.array([p]))[0]
        ERROR_THRESHOLD = 0.25
        results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]
        # sort by strength of probability
        results.sort(key=lambda x: x[1], reverse=True)
        return_list = []
        for r in results:
            return_list.append({"intent": self.classes[r[0]], "probability": str(r[1])})
        return return_list

    def getResponse(self, ints):
        tag = ints[0]['intent']
        list_of_intents = self.intents['intents']
        for i in list_of_intents:
            if i['tag'] == tag:
                result = random.choice(i['responses'])
                break
        return result

    def chatbot_response(self, msg):
        ints = self.predict_class(msg)
        res = self.getResponse(ints)
        return res
