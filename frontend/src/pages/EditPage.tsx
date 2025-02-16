import { Input } from "../components/ui/input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const EditPage = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    
    const quizId = "";
    
    const handleUpdateQuiz = async () => {
        if (!quizId) {
            console.error("Quiz ID is missing");
            return;
        }

        try {
            const response = await axios.put(
                "http://localhost:3000/user/quiz",  // No need to pass quizId in URL
                { title, description, date },
                { headers: { quizid: quizId } } // Pass quizId in headers
            );

            console.log("Quiz updated successfully:", response.data);
            alert("Quiz updated successfully!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error updating quiz:");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-md w-full">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    Edit Quiz
                </h3>

                {/* Title Input */}
                <div className="flex flex-col gap-2 mb-4">
                    <label className="text-gray-700 dark:text-gray-300 font-medium">
                        Quiz Title
                    </label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                {/* Description Input */}
                <div className="flex flex-col gap-2 mb-4">
                    <label className="text-gray-700 dark:text-gray-300 font-medium">
                        Quiz Description
                    </label>
                    <Input value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>

                {/* Date Input */}
                <div className="flex flex-col gap-2 mb-6">
                    <label className="text-gray-700 dark:text-gray-300 font-medium">
                        Quiz Date
                    </label>
                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>

                {/* Update Button */}
                <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
                    onClick={handleUpdateQuiz}
                >
                    Update Quiz
                </button>
            </div>
        </div>
    );
};

export default EditPage;
