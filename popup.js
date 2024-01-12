document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('loading-text').setAttribute('class', 'loading');
    const response = await browser.runtime.sendMessage({type: 'getSelectedText'});
    document.getElementById('selected-text').value = response.selectedText;
    const translation = await browser.runtime.sendMessage({type: 'translate', phrase: response.selectedText});
    console.log(`Received at popup: ${translation}`)
    document.getElementById('translated-text').value = translation;
    document.getElementById('loading-text').setAttribute('class', 'hidden-loading');
});


