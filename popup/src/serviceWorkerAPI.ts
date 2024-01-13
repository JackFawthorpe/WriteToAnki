
// API to communicate with the Service worker of the extension
export const API = {
    getSelectedText: (): Promise<string> => {
        return browser.runtime.sendMessage({ type: "page.selectedText" })
            .then((response: string) => response)
            .catch((error: string) => {
                throw error;
            });
    },
    getTranslation: (text: string): Promise<string> => {
        return browser.runtime.sendMessage({type: 'translate.translate', body: {text}})
        .then(translation => translation)
        .catch((error: string) => {
            throw error;
        })
    }
}