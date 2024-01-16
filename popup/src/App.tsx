import { useCallback, useEffect, useRef, useState } from "react"
import { API } from "./serviceWorkerAPI";
import { AddCardResponse } from "./types/ResponseTypes";
import ExternalTranslateButton from "./Components/ExternalTranslateButton";

function App() {

  const [selectedText, setSelectedText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [clozeText, setClozeText] = useState<string>("");

  const [displayError, setDisplayError] = useState<boolean>(false);
  const errorSignalRef = useRef<undefined | number>();

  const handleAddCardResponse = (response: AddCardResponse) => {
    if (response.error) {
      console.log(`Failed to add card: ${response.error}`)
      setDisplayError(true);
      errorSignalRef.current = setTimeout(() => {
        setDisplayError(false);
      }, 5000);
      return;
    }
    window.close();
  }

  const handleSubmit = async () => {
    const fields = {
        "Spanish": selectedText,
        "English": translatedText,
        "Spanish Cloze": getCloze(),
        "Spanish Cloze Answer": getClozeAnswer()
    };
    browser.runtime.sendMessage({type: 'anki.addCard', fields: fields})
    .then(handleAddCardResponse);
  }

  const initialiseSelectedText = () => {
    API.getSelectedText()
    .then((text: string) => {
      const filteredText = text.replace(/(\r\n|\n|\r)/gm, '').trim();
      setSelectedText(filteredText);
      setClozeText(filteredText);
      updateTranslation(filteredText);
    }).catch((err: string) => { 
      console.log(`An error occured getting selected text: ${err}`);
      setSelectedText("An error occured reading selected text, please try again");
    });
  }

  const updateTranslation = (text: string) => {
    API.getTranslation(text)
    .then((translation: string) => {
      setTranslatedText(translation);
    }).catch(err => 
      setTranslatedText(`There was an error fetching the translation ${err}`)
    );
  }

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Enter' && event.ctrlKey && !event.shiftKey) {
      handleSubmit();
    }
  }, [clozeText, selectedText, translatedText]);

  const getCloze = () => {
    const words = clozeText.split(' ');
    for (let i = 0; i < words.length; i++) {
        if (words[i].includes('_')) {
            words[i] = '_'.repeat(words[i].length - 1);
        }
    }
    return words.join(' ')
  }

  const getClozeAnswer = () => {
    const words = clozeText.split(' ');
    const filteredWords = [];

    for (const element of words) {
        if (element.includes('_')) {
            filteredWords.push(element.replace('_', ''));
        }
    }
    return filteredWords.join(' ');
  }

  useEffect( () => {
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    }
  }, [handleKeyPress]);

  useEffect(() => {
    initialiseSelectedText();

    return () => {
      if (errorSignalRef.current) {
        clearTimeout(errorSignalRef.current);
      }
    }
  }, []);

  return (
    <div className="rootContainer">
      <h2 className="title">Write to Anki</h2>
      <hr/>
      <div hidden={!displayError} className="alert mt-2">An error occured saving your card</div>
      <div className="form">
        <div className="form-group">
          <label htmlFor="selected-text" className="label">Spanish</label>
          <textarea id="selected-text" value={selectedText} onChange={e => setSelectedText(e.target.value)} className="input"/>
        </div>
        <div className="form-group">
          <label htmlFor="selected-text" className="label">English</label>
          <textarea id="selected-text" value={translatedText} onChange={e => setTranslatedText(e.target.value)} className="input"/>
        </div>
        <div className="form-group">
          <label htmlFor="selected-text" className="label">Cloze Excercise (Put underscore in word to hide in Anki)</label>
          <textarea id="selected-text" value={clozeText} onChange={e => setClozeText(e.target.value)} className="input"/>
        </div>
        <div className="form-footer spacing-container">
            <ExternalTranslateButton text={selectedText}/>
            <button className="btn btn-primary" onClick={handleSubmit}>
                Save
            </button>
        </div>
      </div>
    </div>
  )
}

export default App
