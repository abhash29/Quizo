import { useEffect, useState } from "react";

import { Input } from "../components/ui/input";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateQuiz = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const navigate = useNavigate();


    const handleCreateQuiz = async() => {
        const userId = localStorage.getItem("userId");
        if(!userId){
            console.log("User not found");
            return;
        }
        try{
            const response = await axios.post(`http://localhost:3000/user/${userId}`, {
                title,
                description,
                date
            });
            if(response.status===200){
                navigate('/dashboard');
            }
        }
        catch(err){
            console.log(err);
        }
    };
    useEffect(() => {
        const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
        setDate(today);
    }, []);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-md w-full">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    Create Quiz
                </h3>

                {/* Title Input */}
                <div className="flex flex-col gap-2 mb-4">
                    <label className="text-gray-700 dark:text-gray-300 font-medium">
                        Quiz Title
                    </label>
                    <Input
                        className="border border-gray-400 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition"
                        placeholder="Enter quiz title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                {/* Description Input */}
                <div className="flex flex-col gap-2 mb-4">
                    <label className="text-gray-700 dark:text-gray-300 font-medium">
                        Quiz Description
                    </label>
                    <Input
                        className="border border-gray-400 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition"
                        placeholder="Enter quiz description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* Date Input */}
                <div className="flex flex-col gap-2 mb-6">
                    <label className="text-gray-700 dark:text-gray-300 font-medium">
                        Quiz Date
                    </label>
                    <Input
                        type="date"
                        className="border border-gray-400 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                {/* Submit Button */}
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
                    onClick={handleCreateQuiz}
                >
                    Create Quiz
                </button>
            </div>
        </div>
    );
};

export default CreateQuiz;
