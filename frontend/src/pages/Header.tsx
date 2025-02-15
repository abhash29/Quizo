import { useEffect, useState } from "react";

import axios from "axios";

const Header = () => {
    const [userName, setUsername] = useState("");
    const userId="";
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/user/${userId}`);
                setUsername(response.data.username);
            }
            catch(err){
                console.log(err);
            }
        };
        fetchUser();
    }, [userId]);   

    return (
        <div className="p-4 bg-cyan-500	 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
                {userName ? `Username: ${userName}` : "Loading..."}
            </h3>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300">
                Logout
            </button>
        </div>
    );
};

export default Header;
