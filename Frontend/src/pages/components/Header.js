import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';
import '../css/Header.css';

function Header() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };

    return (
        <div className="header">
            <button onClick={() => navigate(-1)} title="Back" className="back-button">
                <FaArrowLeft size={24} />
            </button>
            <div className="header-spacer"></div>
            <button onClick={handleLogout} title="Logout" className="logout-button">
                <FaSignOutAlt size={24} />
            </button>
        </div>
    );
}

export default Header;
