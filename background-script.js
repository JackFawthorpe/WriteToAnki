const ankiMenuId = "anki-context-menu";

let selectedText = "Select some text!"

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type == 'getSelectedText') {
        sendResponse({ text: selectedText });
    } else if (request.type == 'translate') {
        fetchTranslation(request.phrase).then(sendResponse);
    } else if (request.type == 'postCard') {
        postCard(request.fields).then(sendResponse);
    }
    return true;
  });

// DeepL Translation API
const translationUrl = 'http://localhost:5000/translate';

const fetchTranslation = (phrase) => {
    return new Promise((resolve, reject) => {
        fetch(translationUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'message': phrase
            }),
        })
        .then(response => response.json())
        .then(response => resolve(response.translation))
        .catch(error => reject(error));
    }) 
}

// Anki Connect API
const addCardUrl = 'http://localhost:8765';

const postCard = (fields) => {
    const body = {
        "action": "addNote",
        "version": 6,
        "params": {
            "note": {
                "deckName": "Immersion",
                "modelName": "Immersion Cards",
                "fields": fields,
                "options": {
                    "allowDuplicate": false,
                    "duplicateScope": "deck",
                    "duplicateScopeOptions": {
                        "deckName": "Default",
                        "checkChildren": false,
                        "checkAllModels": false
                    }
                },
            }
        }
    };

    return new Promise((resolve, reject) => {
        fetch(addCardUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
    })
        .then(response => response.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
}


browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === ankiMenuId) {
        selectedText = info.selectionText;
        await browser.browserAction.openPopup();
    }
});

browser.contextMenus.create(
    {
      id: ankiMenuId,
      title: "Write to Anki",
      contexts: ["selection"],
    },
  );