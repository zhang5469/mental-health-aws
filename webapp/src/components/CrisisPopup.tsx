import { useState } from "react";
import "./Glossary.css";

function CrisisPopup() {
    const [isOpen, setIsOpen] = useState(true);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="popup-overlay">
            <div className="popup">

                <button
                    className="close-button"
                    onClick={() => setIsOpen(false)}
                >
                    ✕
                </button>

                <p className="popup-text">
                    If you or anyone you know are facing a crisis 
                    at this time, please call
                </p>

                <div className="phone-number">
                    988
                </div>

            </div>
        </div>
    );
}

export default CrisisPopup;