export const handleTranslation =  (text: string): Promise<string> => {
    console.log("Fetching translations for ", text);
    return new Promise((resolve, reject) => {
        fetch('http://localhost:5000/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'message': text
            }),
        })
        .then(response => response.json())
        .then(response => resolve(response.translation))
        .catch(error => reject(error));
    }) 
}

