import express, { Request, Response } from 'express';
import mongoose, { Document, Schema } from 'mongoose';

import cors from 'cors';

const app = express();
const port: number = 3000;

app.use(express.json());


app.use(cors());
// Connect to MongoDB
mongoose.connect('mongodb+srv://abhashkumardas29:Abhash29@authentication.1vp14.mongodb.net/Courses', { dbName: "Courses" })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Schema
interface USER extends Document {
    id: number,
    username: string;
    password: string;
    quizzes: string[];
}

export interface QUIZ{
    title: string,
    description: string,
    date: Date
}

const userSchema = new Schema<USER>({
    //id: {type: Number, required: true, unique: true},
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    quizzes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Quiz'}]
});

const quizSchema = new Schema<QUIZ>({
    title: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    date: {type: Date, required: true}
});

const User = mongoose.model<USER>('User', userSchema);
const Quiz = mongoose.model<QUIZ>('Quiz', quizSchema);

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('Backend for User authentication');
});

// Signup Route
app.post('/signup', async (req: Request, res: Response): Promise<void> => {
    try{
        const {username, password} = req.body;
        const user = await User.findOne({username, password});
        if(user){
            res.status(401).json({message: "User already exists"});
        }
        const newUser = new User({username, password});
        await newUser.save();
        res.status(200).json({message: "Signup successful"});
    }
    catch(error){
        res.status(500).json({message: "Error", error});
    }
})

// Login Route
app.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username, password });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        res.status(200).json({ message: 'Login successful', userId: user._id, username: user.username });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/user', async (req: Request, res: Response): Promise<void> => {
    try{
        const users = await User.find({});
        res.status(200).json(users);
    }
    catch(error){
        res.status(500).json({message: "Error"});
    }
});

//Backend for quizzes
//1. according to username/userid we have to push the quiz details i.e. title, description, date ->  Quiz
//2. I have to enable the edit and delete functionality
//Delete

app.delete("/user/quiz", async (req: Request, res: Response): Promise<void> => {
    try {
        const quizId = req.headers.quizid as string;

        // Validate ObjectId format
        if (!quizId || !mongoose.isValidObjectId(quizId)) {
            res.status(400).json({ message: "Invalid or missing quiz ID" });
            return;
        }

        // Attempt to delete the quiz directly
        const deletedQuiz = await Quiz.findByIdAndDelete(quizId);

        if (!deletedQuiz) {
            res.status(404).json({ message: "Quiz not found" });
            return;
        }

        res.status(200).json({ message: "Quiz deleted successfully", deletedQuiz });
    } catch (err) {
        console.error("Error deleting quiz:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


app.put('/user/quiz', async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("Received Headers:", req.headers); // Log headers
        const quizId = req.headers.quizid as string;

        if (!quizId || !mongoose.isValidObjectId(quizId)) {
            res.status(400).json({ message: "Invalid or missing quiz ID" });
            return;
        }

        const { title, description, date } = req.body;
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            quizId,
            { title, description, date },
            { new: true }
        );

        if (!updatedQuiz) {
            res.status(404).json({ message: "Quiz not found" });
            return;
        }

        res.status(200).json({ message: "Quiz updated successfully", updatedQuiz });
    } catch (err) {
        console.error("Error updating quiz:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});




app.get("/user/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json(user);
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

//This is the route that will be used to push the quiz details for that particular user
app.post('/user/:id', async (req: Request, res: Response) => {
    try{
        const {id} = req.params;
        const user = await User.findById(id);
        if(!user){
            res.status(404).json({message: 'User not found'});
            return;
        }
        const {title, description, date} = req.body;
        const newQuiz = new Quiz({title, description, date});
        await newQuiz.save();
        user.quizzes.push(newQuiz._id.toString());
        await user.save();
        res.status(200).json({message: "Quiz added successfully"});
    }
    catch(err){
        console.log("Error", err);
    }
});

//Fetch the list of quizzes
app.get('/user/:id/quizzes', async (req: Request, res: Response): Promise<void> => {
    try{
        const {id} = req.params;
        const user = await User.findById(id).populate("quizzes");
        if(!user){
            res.status(404).json({message: "User not found"});
            return;
        }
        res.status(200).json(user.quizzes);
    }
    catch(err){
        console.log(err);
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
