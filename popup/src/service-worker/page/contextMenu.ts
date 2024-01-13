import { setSelectedText } from "../messaging/getSelectedText";

const ankiMenuId = "anki-context-menu";

export const registerContextMenu = () => {
    browser.contextMenus.onClicked.addListener(async (info, _tab) => {
        if (info.menuItemId === ankiMenuId) {
            setSelectedText(info.selectionText ?? "");
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
}