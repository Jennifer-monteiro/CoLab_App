import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AddToItineraryModal.css';
import CreateItineraryModal from './CreateItineraryModal';
import MessageModal, { Messages as MessageTypes } from './MessageModal'; // Import the MessageModal component and Messages object

const AddToItineraryModal = ({ show, onClose, place }) => {
    const [selectedItinerary, setSelectedItinerary] = useState(null);
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [itineraries, setItineraries] = useState([]);

    const axiosInstance = axios.create({
        baseURL: process.env.NODE_ENV === 'production' ? 'https://colab-app.onrender.com' : 'http://localhost:5000',
        withCredentials: true,
    });

    useEffect(() => {
        if (showModal) {
            fetchItineraries();
        } else {
            // Reset message when the modal is closed
            setMessage('');
        }
    }, [showModal]);

    useEffect(() => {
        if (place) {
            setShowModal(true);
        }
    }, [place]);

    const fetchItineraries = async () => {
        try {
            const response = await axiosInstance.get('/itineraries');
            setItineraries(response.data.itineraries);
        } catch (error) {
            console.error('Error fetching itineraries:', error);
        }
    };

    const handleSelectItinerary = async (itinerary) => {
        setSelectedItinerary(itinerary);
        localStorage.setItem('selectedItineraryName', itinerary.name);
        const selectedPlaceName = localStorage.getItem('selectedPlaceName');
        const selectedPlacePhoto = localStorage.getItem('selectedPlacePhoto');
        const userId = localStorage.getItem('userId');
        const itineraryId = itinerary.id;

        try {
            await axiosInstance.post(`/itineraries/${itineraryId}/items`, {
                name: selectedPlaceName,
                photo_url: selectedPlacePhoto,
                user_id: userId,
            });
            setShowModal(false);
            setMessage(MessageTypes.PLACE_ADDED_SUCCESSFULLY); // Set success message
            setTimeout(() => {
                setMessage('');
            }, 3000); // Hide message after 3 seconds
        } catch (error) {
            console.error('Error adding place to itinerary:', error);
            setMessage('Error adding place to itinerary.');
            setTimeout(() => {
                setMessage('');
            }, 3000); // Hide message after 3 seconds
        }
    };

    const handleOpenCreateModal = () => {
        setShowModal(false);
        setShowCreateModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        onClose();
        setMessage(''); // Reset message when closing the modal
    };

    const handleCreateItinerary = (newItinerary) => {
        setItineraries([...itineraries, newItinerary]);
        setSelectedItinerary(newItinerary);
        setShowCreateModal(false);
    };

    const getRandomPhoto = (itinerary) => {
        if (itinerary.items && itinerary.items.length > 0) {
            const randomPlace = itinerary.items[Math.floor(Math.random() * itinerary.items.length)];
            return randomPlace.photo_url;
        } else {
            return null;
        }
    };

    return (
        <>
            {showModal && (
                <div className="add-to-itinerary-modal">
                    <div className="add-to-itinerary-modal-content">
                        <span className="add-to-itinerary-modal-close" onClick={handleCloseModal}>&times;</span>
                        <h2>Add to Itinerary</h2>
                        <div className="divider"></div>
                        <div>
                            {itineraries && itineraries.length > 0 ? (
                                <div className="itinerary-list">
                                    {itineraries.map((itinerary) => (
                                        <div
                                            key={itinerary.id}
                                            className={`itinerary-item ${selectedItinerary && selectedItinerary.id === itinerary.id ? 'add-to-itinerary-modal-selected' : ''}`}
                                            onClick={() => handleSelectItinerary(itinerary)}
                                        >
                                            <img src={getRandomPhoto(itinerary)} alt={itinerary.name} />
                                            <span>{itinerary.name}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No existing itineraries found.</p>
                            )}
                        </div>
                        <button onClick={handleOpenCreateModal}>Create New Itinerary</button>
                        {message && <p className="add-to-itinerary-modal-message">{message}</p>}
                    </div>
                </div>
            )}
            {/* Create New Itinerary Modal */}
            {showCreateModal && (
                <CreateItineraryModal
                    show={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreateItinerary}
                />
            )}
        </>
    );
};

export default AddToItineraryModal;
