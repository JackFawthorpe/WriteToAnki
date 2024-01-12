# Write to Anki

The goal of this project is to ease the process of making flashcards for myself to learn spanish.

The idea is that when reading spanish content its a hassle to manually find the translation and then build a flash cards out of the new words.

## Installation

### Enable Extension
- In firefox, type about:debugging into the URL  
- Click This Firefox
- Load Temporary Add-on -> Pick root directory of the project

### Enable Translation Service
This application uses the free deepL api although you will need to create your own API-key.
Place this key within a .env file within the /translation-service directory
Install all the required packages and then start the flask server

### Anki Integration
Within the background-script.js you can see a function called postCard.  
This function is responsible for pushing cards to your deck.

The current implementation creates a card with 4 fields,
- Spanish
- English
- Spanish Cloze
- Spanish Cloze Answer

Within Anki I suggest creating a card type that makes use of these four fields. Personally I use english to spanish, spanish to english and spanish cloze as my three prompts.

You can change the deck that the cards get saved to with deckType and cardType with modelName.

This project also makes use of the Anki Connections add on to anki https://foosoft.net/projects/anki-connect/.


## Usage
1. Highlight a sentence that you don't understand
2. Understand why you don't understand the sentence and see if you can rewrite something simpler that contains that grammar structure / word
3. In the cloze section and underscores anywhere you want in the critical words for practice. For example El _Quiero una manz_ana will create a cloze flashcard that looks like El _____ una ______
4. Ctrl+Enter or click submit to send the card to anki.