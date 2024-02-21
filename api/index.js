const express = require('express'); // OU import express from 'express'; mais dans ce cas dans package.json ajouter 'type': 'module',
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({dest: 'uploads/'})
const fs = require('fs');
const app = express();
const port = process.env.PORT || 4000;
const apiConfig = require('../client/src/apiConfig');

const salt = bcrypt.genSaltSync(10);
const secret = 'agfZF23Ffsdfsq32542';

const appURL = apiConfig.appURL;
app.use(cors({credentials: true, origin:`${appURL}`}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
require('dotenv').config();
mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log('MangoDB connected')
})
.catch(error => {
    console.log(error);
});

app.post('/register', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {username, password} = req.body;
    try {
        const userDoc = await User.create({ username, password:bcrypt.hashSync(password, salt) });
        res.json(userDoc);
    } catch(e) {
        res.status(400).json(e);
    }
})

app.post('/login', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {username, password} = req.body;
    const userDoc = await User.findOne({username});
    if (!userDoc) {
        // Aucun utilisateur correspondant n'a été trouvé
        return res.status(404).json("Utilisateur non trouvé dans la BDD");
    }
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
        jwt.sign({username, id:userDoc._id}, secret, {}, (err, token) => {
            if(err) throw err;
            res.cookie('token', token).json({
                id:userDoc._id,
                username, 
            });
        })
    } else {
        res.status(400).json('mauvais identifiants');
    }
})

app.get('/profile', (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        res.json(info);
    })
})

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
})
 
app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path+'.'+ext;
    fs.renameSync(path, newPath);

  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async (err,info) => {
    console.log('info = ' + info);
    if (err) throw err;
    const {title,summary,content} = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover:newPath,
      author:info.username,
    });
    res.json(postDoc);
  });

})

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    let newPath = null
    if (req.file) {
        const {originalname, path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path+'.'+ext;
        fs.renameSync(path, newPath);
    }
    
    const {token} = req.cookies; 
    jwt.verify(token, secret, {}, async (err,info) => {
        console.log('info = ' + info);
        if (err) throw err;
        const {id, title,summary,content} = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = postDoc.author === info.username;
        if (!isAuthor) {
            return res.status(400).json('Vous n\'êtes pas l\'auteur du post');
        }
        const updatedPost = await Post.findByIdAndUpdate(id, {
            title,
            summary,
            content,
            cover: newPath ? newPath : postDoc.cover,
        }, {new: true});

        res.json(updatedPost);
    });
    
});

app.delete('/post/:id', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
      if (err) throw err;
      const {id} = req.params;
      const postDoc = await Post.findById(id);
      const isAuthor = postDoc?.author === info.username;
      if (!isAuthor) {
        return res.status(400).json('Vous n\'êtes pas l\'auteur du post');
      }
      try {
        const deletedPost = await Post.findByIdAndDelete(id);
        return res.status(200).json(`Le post nommé : "${deletedPost.title}" a été effacé`);
      } catch(error) {
        return res.status(400).json(error);
      };

    });
});

app.get('/post', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    res.json(
        await Post.find()
        .sort({createdAt: -1})
        .limit(10)
    );
})

app.get('/post/:id', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {id} = req.params;
    const postDoc = await Post.findById(id);
    res.json(postDoc);
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

