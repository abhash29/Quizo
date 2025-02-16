import { useEffect, useState } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const [userName, setUsername] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if(storedUsername){
            setUsername(storedUsername);
        }
        else{
            const fetchUser = async () => {
                try {
                    const userId = localStorage.getItem("userId");
                    if (userId) {
                        const response = await axios.get(`http://localhost:3000/user/${userId}`);
                        setUsername(response.data.username);
                    }
                }
                catch (err) {
                    console.log(err);
                }
            };
            fetchUser();
        }
    }, []);   

    const handleLogout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        navigate('/login');
        
    }
        return (
        <div className="p-4 bg-cyan-500	 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
                {userName ? `${userName}` : "Loading..."}
            </h3>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );
};

export default Header;
