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
    username: string;
    password: string;
    quizes: string[];
}

interface QUIZ{
    title: string,
    description: string,
    date: Date
}

const userSchema = new Schema<USER>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    quizes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Quiz'}]
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
        res.status(500).json({message: "Error"});
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
        res.status(200).json({ message: 'Login successful' });
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

//Backend for quizes
//1. according to username/userid we have to push the quiz details i.e. title, description, date
//2. I have to enable the edit and delete functionality

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
        user.quizes.push(newQuiz._id.toString());
        await user.save();
        res.status(200).json({message: "Quiz added successfully"});
    }
    catch(err){
        console.log("Error", err);
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
