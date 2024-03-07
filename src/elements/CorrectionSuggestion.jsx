import React from 'react';
import './styles.css'; // Import the CSS for styling
import { useCallback } from 'react';


const CorrectionSuggestion = ({ editor }) => {

    const [correction, setCorrection] = React.useState({ original: '', suggestion: '' });
    const [isVisible, setIsVisible] = React.useState(false);

    const handleAccept = useCallback(() => {
        console.log("Running once");
        editor.chain().removeSelectionMark().replaceSelectionText().run();
        editor.commands.setNextMark();
    }, [correction.original]);

    const handleDismiss = useCallback(() => {
        console.log("Running once");
        editor.chain().removeSelectionMark().setNextMark().run();
    }, [correction.original])

    React.useEffect(() => {
        const handleAISelectionClick = (event) => {
            const id = event.detail.id;
            const htmlElement = document.getElementById(id);

            if (htmlElement) {
                setIsVisible(true);
                const originalText = htmlElement.innerText;
                const replaceText = htmlElement.getAttribute('datareplacetext');
                setCorrection({
                    original: originalText,
                    suggestion: replaceText
                });
            } else {
                setCorrection({
                    original: "",
                    suggestion: ""
                });

                setIsVisible(false);
            }
        };

        // Add event listener
        window.addEventListener('ai-selection-click', handleAISelectionClick);

        // Cleanup
        return () => {
            window.removeEventListener('ai-selection-click', handleAISelectionClick);
        };
    }, []); // Empty array ensures this runs only once on mount and cleanup on unmount

    return (
        <div className="correction-container">
            {isVisible && <div className="correction-content">
                <p className="correction-text">
                    <del>{correction.original}</del> <ins>{correction.suggestion}</ins>

                </p>
                <div className="correction-actions">
                    <button className="correction-btn accept" onClick={handleAccept}>Accept</button>
                    <button className="correction-btn dismiss" onClick={handleDismiss}>Dismiss</button>
                </div>
            </div>}
        </div>
    );
};

export default CorrectionSuggestion;