export const handleAddCard = (fields: any) => {
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

    console.log(`Fields: ${JSON.stringify(fields)}`)

    return new Promise((resolve, reject) => {
        fetch("http://localhost:8765/", {
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