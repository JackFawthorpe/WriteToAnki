let selectedText = "Select some text!";

export const handleGetSelectedText = async () => {
    return selectedText;
}

export const setSelectedText = (text: string) => {
    selectedText = text;
}