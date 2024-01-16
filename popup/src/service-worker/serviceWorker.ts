import { handleGetSelectedText } from "./messaging/getSelectedText";
import { handleTranslation } from "./messaging/translate";
import { handleAddCard } from "./messaging/addCard"
import { registerContextMenu } from "./page/contextMenu";

console.log("Loading service worker");

// Routes messages from the popup
browser.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    console.log(`Received message: ${JSON.stringify(request)} `)
    switch (request.type) {
        case 'page.selectedText':
            handleGetSelectedText().then(sendResponse);
            break;
        case 'translate.translate':
            handleTranslation(request.body.text)
            .then(sendResponse)
            .catch(err => sendResponse({error: err}));
            break;
        case 'anki.addCard':
            handleAddCard(request.fields)
            .then(sendResponse)
            .catch(err => sendResponse({error: err}));
            break;
    }
    return true;
});

registerContextMenu();