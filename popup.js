const loadTranslation = async () => {
    document.getElementById('loading-text').setAttribute('class', 'loading');
    const response = await browser.runtime.sendMessage({type: 'getSelectedText'});
    document.getElementById('selected-text').value = response.text;
    document.getElementById('cloze-text').value = response.text;
    await browser.runtime.sendMessage({type: 'translate', phrase: response.text})
        .then(translation => {
            console.log(translation)
            document.getElementById('translated-text').value = translation;
            document.getElementById('loading-text').setAttribute('class', 'hidden-loading');
            document.getElementById('cloze-text').focus();
        })
        .catch(err => console.log(`Error translating: ${err}`));

}

const getCloze = () => {
    const phrase = document.getElementById('cloze-text').value;
    const words = phrase.split(' ');
    for (let i = 0; i < words.length; i++) {
        if (words[i].includes('_')) {
            words[i] = '_'.repeat(words[i].length - 1);
        }
    }
    return words.join(' ')
}

const getClozeAnswer = () => {
    const phrase = document.getElementById('cloze-text').value;
    const words = phrase.split(' ');
    const filteredWords = [];

    for (const element of words) {
        if (element.includes('_')) {
            filteredWords.push(element.replace('_', ''));
        }
    }

    return filteredWords.join(' ');
}

const handleCardSubmit = async () => {
    const fields = {
        "Spanish": document.getElementById('selected-text').value,
        "English": document.getElementById('translated-text').value,
        "Spanish Cloze": getCloze(),
        "Spanish Cloze Answer": getClozeAnswer()
    };
   browser.runtime.sendMessage({type: 'postCard', fields: fields})
   .then(() => {window.close()})
   .catch(err => console.log(err));
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('submit-button').onclick = handleCardSubmit;

    // Submit functionality
    document.addEventListener('keydown', function(event) {
        // Check if the Ctrl key and Enter key are pressed simultaneously
        if (event.ctrlKey && event.key === 'Enter') {
          // Trigger a click on the 'submit-button'
          document.getElementById('submit-button').click();
        }
      });

    // Load translation from server
    loadTranslation();
});



