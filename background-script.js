const ankiMenuId = "anki-context-menu";

let selectedText = "Select some text!"

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received message");
    console.log(request);
    if (request.type === 'getSelectedText') {
        console.log("On the way boss");
        sendResponse({ selectedText: selectedText });
    } else if (request.type === 'translate') {
        return fetchTranslation(request.phrase);
    }
  });

// DeepL Translation API
const url = 'http://localhost:5000/translate';

const fetchTranslation = async (phrase) => {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'message': phrase
        }),
    });
    response = await response.json();
    return response.translation;
}
  
browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === ankiMenuId) {
        console.log("Saving text")
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