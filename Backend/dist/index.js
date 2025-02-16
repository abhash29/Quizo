"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importStar(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Connect to MongoDB
mongoose_1.default.connect('mongodb+srv://abhashkumardas29:Abhash29@authentication.1vp14.mongodb.net/Courses', { dbName: "Courses" })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
const userSchema = new mongoose_1.Schema({
    //id: {type: Number, required: true, unique: true},
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    quizzes: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Quiz' }]
});
const quizSchema = new mongoose_1.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    date: { type: Date, required: true }
});
const User = mongoose_1.default.model('User', userSchema);
const Quiz = mongoose_1.default.model('Quiz', quizSchema);
// Routes
app.get('/', (req, res) => {
    res.send('Backend for User authentication');
});
// Signup Route
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield User.findOne({ username, password });
        if (user) {
            res.status(401).json({ message: "User already exists" });
        }
        const newUser = new User({ username, password });
        yield newUser.save();
        res.status(200).json({ message: "Signup successful" });
    }
    catch (error) {
        res.status(500).json({ message: "Error", error });
    }
}));
// Login Route
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield User.findOne({ username, password });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        res.status(200).json({ message: 'Login successful', userId: user._id, username: user.username });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
app.get('/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User.find({});
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Error" });
    }
}));
//Backend for quizzes
//1. according to username/userid we have to push the quiz details i.e. title, description, date ->  Quiz
//2. I have to enable the edit and delete functionality
//Delete
app.delete("/user/quiz", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quizId = req.headers.quizid;
        // Validate ObjectId format
        if (!quizId || !mongoose_1.default.isValidObjectId(quizId)) {
            res.status(400).json({ message: "Invalid or missing quiz ID" });
            return;
        }
        // Attempt to delete the quiz directly
        const deletedQuiz = yield Quiz.findByIdAndDelete(quizId);
        if (!deletedQuiz) {
            res.status(404).json({ message: "Quiz not found" });
            return;
        }
        res.status(200).json({ message: "Quiz deleted successfully", deletedQuiz });
    }
    catch (err) {
        console.error("Error deleting quiz:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
app.put('/user/quiz', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Received Headers:", req.headers); // Log headers
        const quizId = req.headers.quizid;
        if (!quizId || !mongoose_1.default.isValidObjectId(quizId)) {
            res.status(400).json({ message: "Invalid or missing quiz ID" });
            return;
        }
        const { title, description, date } = req.body;
        const updatedQuiz = yield Quiz.findByIdAndUpdate(quizId, { title, description, date }, { new: true });
        if (!updatedQuiz) {
            res.status(404).json({ message: "Quiz not found" });
            return;
        }
        res.status(200).json({ message: "Quiz updated successfully", updatedQuiz });
    }
    catch (err) {
        console.error("Error updating quiz:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
app.get("/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield User.findById(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
//This is the route that will be used to push the quiz details for that particular user
app.post('/user/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield User.findById(id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const { title, description, date } = req.body;
        const newQuiz = new Quiz({ title, description, date });
        yield newQuiz.save();
        user.quizzes.push(newQuiz._id.toString());
        yield user.save();
        res.status(200).json({ message: "Quiz added successfully" });
    }
    catch (err) {
        console.log("Error", err);
    }
}));
//Fetch the list of quizzes
app.get('/user/:id/quizzes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield User.findById(id).populate("quizzes");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user.quizzes);
    }
    catch (err) {
        console.log(err);
    }
}));
// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
