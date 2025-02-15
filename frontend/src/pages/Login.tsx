import { NavLink, useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try{
            const response = await axios.post("http://localhost:3000/login", {
                username,
                password
            });
            console.log("login successful");
            if(response.status===200){
                navigate('/dashboard');
            }
        }
        catch(error){
            console.log("Login Failed", error);
        }
    };
    
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
            <div className="flex flex-col border-2 border-gray-800 p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 w-96">
                <h2 className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-gray-100">
                    Login Page
                </h2>

                <div className="flex flex-col gap-2 mb-4">
                    <label className="text-gray-700 dark:text-gray-300">Enter username</label>
                    <Input className="border border-gray-400 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2 mb-4">
                    <label className="text-gray-700 dark:text-gray-300">Enter password</label>
                    <Input type="password" className="border border-gray-400 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="flex">
                    <button className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-300 mr-2"
                        onClick={handleSubmit}
                    >
                        Login
                    </button>
                    <NavLink to="/signup" className="w-full">
                        <button className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-300">
                            Signup
                        </button>
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default Login;
