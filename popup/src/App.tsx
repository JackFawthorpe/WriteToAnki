import { useEffect, useState } from "react"
import { API } from "./serviceWorkerAPI";

function App() {

  const [selectedText, setSelectedText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [clozeText, setClozeText] = useState<string>("");

  const handleSubmit = async () => {
    const fields = {
        "Spanish": selectedText,
        "English": translatedText,
        "Spanish Cloze": getCloze(),
        "Spanish Cloze Answer": getClozeAnswer()
    };
  browser.runtime.sendMessage({type: 'anki.addCard', fields: fields})
  .then(() => {window.close()})
  .catch(err => console.log(err));
}


  const initialiseSelectedText = () => {
    API.getSelectedText()
    .then((text: string) => {
      setSelectedText(text);
      setClozeText(text);
      updateTranslation(text);
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

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && event.ctrlKey) {
      handleSubmit();
    }
  };

  useEffect( () => {
    initialiseSelectedText();
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    }
  }, []);


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

  return (
    <div className="rootContainer">
      <h2 className="title">Write to Anki</h2>
      <hr/>
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
        <div className="form-footer">
            <button className="btn btn-primary" onClick={handleSubmit}>
                Save
            </button>
        </div>
      </div>
    </div>
  )
}

export default App
