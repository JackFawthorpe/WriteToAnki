import { AddCardResponse } from "../../types/ResponseTypes";

type ankiResponse = {
    error: string | null;
    result: number | null;
}

const validateResponse = (
    response:ankiResponse,
    resolve: any, 
    reject: any) => {
    if (response.error) {
        console.log("Rejecting response");
        reject(response.error);
    } else {
        resolve(response);
    }
}

export const handleAddCard = (fields: any): Promise<AddCardResponse> => {
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
        fetch("http://localhost:8765/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
    })
        .then(response => response.json())
        .then(data => validateResponse(data, resolve, reject))
        .catch(error => reject(error));
    });
}