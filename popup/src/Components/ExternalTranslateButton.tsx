import { useEffect } from "react";

type ExternalTranslateButtonProps = {
    text: string
}

export default ({
    text
}: ExternalTranslateButtonProps
) => {

    const handleClick = () => {
        console.log("Opening window");
        browser.tabs.create({url: `https://translate.google.com/?sl=es&tl=en&text=${text.replace(' ', '%20')}&op=translate`});
    }

    const onKeyFilter = (event: KeyboardEvent) => {
        console.log("Key Filter Triggered");
        if (event.key === "Enter" && event.shiftKey && event.ctrlKey) {
            console.log("Passed filter");
            handleClick();
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', onKeyFilter);
        
        return () => {
            document.removeEventListener('keydown', onKeyFilter);
        }
    }, [text]);

    return (
        <button className='btn btn-secondary' onClick={handleClick}>Explore</button>
    )
}
