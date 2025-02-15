import { Card, CardContent } from "@/components/ui/card";

import Header from "./Header";

const DashBoard = () => {
    const arr = [
        { title: "Quiz1", description: "Basic Math Quiz", date: "10/12/24" },
        { title: "Quiz1", description: "Basic Math Quiz", date: "10/12/24" },
        { title: "Quiz1", description: "Basic Math Quiz", date: "10/12/24" },
        { title: "Quiz1", description: "Basic Math Quiz", date: "10/12/24" },
        { title: "Quiz1", description: "Basic Math Quiz", date: "10/12/24" },
    ];

    return (
        <>
        <Header />
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Dashboard Heading */}
            <h3 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h3>

            {/* List of Quizzes */}
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mt-4">List of Quizzes</h2>

            {/* Quiz Cards */}
            <div className="mt-6 space-y-4">
                {arr.map((quiz, index) => (
                    <Card
                        key={index}
                        className="border border-gray-300 bg-white shadow-md p-6 rounded-lg hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                    >
                        <CardContent className="flex justify-between items-center">
                            {/* Quiz Info */}
                            <div className="flex flex-col gap-3 text-gray-800 dark:text-gray-200">
                                <span className="text-lg font-semibold">{quiz.title}</span>
                                <span className="text-md text-gray-600 dark:text-gray-400">{quiz.description}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{quiz.date}</span>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col gap-3 ml-6">
                                <button className="bg-blue-600 text-white py-2 px-5 rounded-full hover:bg-blue-700 transition">
                                    Edit
                                </button>
                                <button className="bg-red-600 text-white py-2 px-5 rounded-full hover:bg-red-700 transition">
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
