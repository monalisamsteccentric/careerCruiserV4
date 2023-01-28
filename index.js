import fs from 'fs'
import express from 'express'
import User from './models/user.js';
import Jobposting from './models/jobposting.js'
import Message from './models/message.js'
import bodyParser from 'body-parser';
import multer from 'multer';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import exportedObjects from './passport.js';
const { passport, LocalStrategy } = exportedObjects;
import session from 'express-session';
import path from 'path'
import * as dotenv from 'dotenv' 
dotenv.config()
const app = express()
app.use(passport.initialize());
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }))
app.use(passport.session());
app.use(express.json())
app.use(cors());
const currentModuleUrl = new URL(import.meta.url);
const currentModulePath = currentModuleUrl.pathname;

app.use(express.static(path.join(currentModulePath, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(currentModulePath, '../client/build/index.html'));
});

app.use(express.urlencoded({ extended: true }))

mongoose.set('strictQuery', false)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ dest: "./uploads" }).single("resume"));




mongoose.connect(process.env.mongodb_url, (err) => {
  if (err) {
    console.log(err.meassage)
  } else {
    console.log('db connected')
  }
})

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const secret = 'your_jwt_secret'




app.post('/messages', (req, res) => {
 
  const newMessage = new Message({
    sender: req.body.sender,
    receiver: req.body.receiver,
    message: req.body.message,
    subject: req.body.subject
  });

  newMessage.save((err) => {
    if (err) {
      res.status(500).json({ message: 'Error saving message' });
    } else {
      res.json({ message: 'Message saved successfully' });
    }
  });
});




app.put('/jobposting', (req, res) => {
  Jobposting.find({ Title: 'Software Engineer' }, (err, jobpostings) => {
    if (err) {
      console.log(err);
    } else {
      res.json(jobpostings);
    }
  });
});



app.post('/submit-job-form', async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, secret);
  req.user = decoded;

  const userId = req.user.email;
  const { experience, education, skills } = req.body;
  try {

    const user = await User.findOne({ email: `${userId}` });

    user.details = { experience, education, skills };
    await user.save();
    res.status(200).send('Form submitted successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error submitting form.');
  }
});



app.post('/register', async (req, res) => {

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(req.body.password, saltRounds);

  const newUser = new User({
    email: req.body.email,
    password: passwordHash,
    name: req.body.name,
    location: req.body.location
  });
  newUser.save()
    .then(() => res.json('User added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

app.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: 'Something is not right',
        user: user
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      // generate a signed json web token with the contents of user object and return it in the response
      const token = jwt.sign(user.toJSON(), 'your_jwt_secret');
      return res.json({ user, token });
    });
  })(req, res);
});


app.put('/user', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token)
    return res.status(401).send('Access denied. No token provided.');
  try {
    req.user = jwt.verify(token, secret);
    next();
  } catch (err) {
    res.status(400).send('Invalid token.');
  }
}

app.post("/upload", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, secret);
  req.user = decoded;

  const userId = req.user.email;

  try {
    const user = await User.findOne({ email: `${userId}` });
    const file = fs.readFileSync(req.file.path);
    user.pdf = file;
    await user.save();
    res.status(200).send('PDF uploaded successfully');
  } catch (error) {
    console.log(error)
    res.status(500).send(error);
  }
});







app.listen(process.env.PORT, () => {
  console.log(`Server is running on port: ${process.env.PORT}`);
});

