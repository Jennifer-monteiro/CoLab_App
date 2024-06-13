// PlaceDetailsModal.jsx

import React from 'react';
import "../styles/PlaceDetailsModal.css"; // Add this import


const PlaceDetailsModal = ({ show, onClose, placeDetails }) => {
    if (!show) return null; // Ensure modal is not rendered if show prop is false or null

    // Destructure placeDetails object to retrieve necessary details
    const { name, photo_url, address } = placeDetails;

    return (
        <div className="modal">
            <div className="modal-content">
                <button onClick={onClose} className="close-button">&times;</button>
                <h2>{name}</h2>
                <img src={photo_url} alt={name} />
                <p>{address}</p>
                {/* Add other details as needed */}
            </div>
        </div>
    );
};


export default PlaceDetailsModal;
