import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

import Header from "./Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Quiz {
    _id: string;
    title: string;
    description: string;
    date: string;
}

const DashBoard = () => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const navigate = useNavigate();

    const handleQuiz = ():void => {
        navigate("/createQuiz");
    }

    const fetchQuizzes = async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            console.log("User not found");
            return;
        }
        try {
            const response = await axios.get(`http://localhost:3000/user/${userId}/quizzes`);
            console.log(response.data);
            setQuizzes(response.data);
        }
        catch (error) {
            console.log("Error", error);
        }
    };
    useEffect(() => {
        fetchQuizzes();
    }, []);

    //Delete function
    const handleDeleteQuiz = async (quizId: string): Promise<void> => {
        console.log("Deleting quiz with ID:", quizId);

        try {
            const response = await axios.delete("http://localhost:3000/user/quiz", {
                headers: { quizid: quizId }
            });

            console.log("Delete button clicked:", quizId);
            if (response.status === 200) {
                navigate('/dashboard');
            }
            fetchQuizzes();
        } catch (err: any) {
            console.error("Error deleting quiz:", err.response?.data || err.message);
        }
    };

    const handleUpdateQuiz = async (quiz: { _id: string }) => {
        if (!quiz._id) {
            console.error("Quiz ID is missing");
            return;
        }
        localStorage.setItem("quizId", quiz._id); // Store quizId
        navigate("/editPage"); // Navigate to edit page
    };


    return (
        <>
        <Header />
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Dashboard Heading */}
            <h3 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h3>

            {/* List of Quizzes */}
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mt-4">List of Quizzes</h2>
                <button className="bg-blue-600 text-white py-2 px-5 rounded-full hover:bg-blue-700 transition mt-4"
                    onClick={handleQuiz}
                >
                    Create Quiz
                </button>

            {/* Quiz Cards */}
                <div className="mt-6 space-y-4" onClick={handleUpdateQuiz(quiz._id)}>
                {quizzes.map((quiz, index) => (
                    <Card
                        key={index}
                        className="border border-gray-300 bg-white shadow-md p-6 rounded-lg hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                    >
                        <CardContent className="flex justify-between items-center">
                            {/* Quiz Info */}
                            <div className="flex flex-col gap-3 text-gray-800 dark:text-gray-200">
                                <span className="text-lg font-semibold">{index+1}</span>
                                <span className="text-lg font-semibold">{quiz.title}</span>
                                <span className="text-md text-gray-600 dark:text-gray-400">{quiz.description}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(quiz.date).toLocaleDateString()}</span>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col gap-3 ml-6">
                                <button className="bg-blue-600 text-white py-2 px-5 rounded-full hover:bg-blue-700 transition"
                                    onClick={handleUpdateQuiz}
                                >
                                    Edit
                                </button>
                                <button className="bg-red-600 text-white py-2 px-5 rounded-full hover:bg-red-700 transition"
                                    onClick={() =>  handleDeleteQuiz(quiz._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
        </>
    );  
};

export default DashBoard;
