import "./Popup.css";

function Popup({ show, type, message, onClose }) {

    if (!show) return null;

    return (

        <div className="popup-overlay">

            <div className={`popup-box ${type}`}>

                <h3>
                    {type === "success"
                        ? "Success"
                        : type === "error"
                        ? "Error"
                        : "Message"}
                </h3>

                <p>{message}</p>

                <button onClick={onClose}>
                    OK
                </button>

            </div>

        </div>

    );

}

export default Popup;