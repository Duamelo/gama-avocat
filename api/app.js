var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var  dotenv  = require("dotenv");
const mongoose = require('mongoose');
const cors = require('cors');
const { userComment } = require('./comment');
const morgan = require('morgan');

dotenv.config();

const port = process.env.PORT;


app.use(cors());
app.use('*', cors());
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res)=>{
  res.send('Hello world');
});



app.post('/send-email', function (req, res) {
    const mailgun = require("mailgun-js");
    const DOMAIN = process.env.DOMAIN;
    const api_key = process.env.api_key;
    const mg = mailgun({apiKey: api_key, domain: DOMAIN});
        console.log(DOMAIN);
        const data = {
           // name: req.body.name,
            from: req.body.name + " " + req.body.email,
            to: 'administration@gama-avocatsafrique.com',
            subject: req.body.subject,
            text: req.body.content + " " + "Téléphone :" + req.body.phone,
        };

        mg.messages().send(data, (error, body)=> {
            console.log(body);
            console.log(data);
            res.send("Votre message a été envoyé! Merci.");
        });
});
  



app.post('/send-comment/:articleid', async (req, res)=>{

    let hour = new Date();
    let data = new userComment({
        article: req.params.articleid,
        name: req.body.name,
        comment: req.body.text,
        date: hour
    });

    console.log(hour);

    data = await data.save();

    if (!data)
        return res.status(404).send('The comment cannot be created!');

        console.log;

    res.send("votre commentaire a été ajouté. Merci !");
});

app.get('/liste-comment/:articleid', async (req, res)=>{
    const userCommentList = await userComment.find({article: req.params.articleid}).select('name comment date');

    if(!userCommentList)
        res.status(500).json({success: false });

    console.log(userCommentList);
    res.send(userCommentList);
})


app.get(`/get/count/:articleid`, async (req, res)=>{
    const commentCount = await userComment.find({article: req.params.articleid}).countDocuments();

        if (! commentCount)
            res.status(500).json({success: false})

        
    res.send({
        comment: commentCount
    });
})


// Database 
mongoose.connect(process.env.CONNECTION_STRING, { 
    dbName: "gama-comment-database",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
.then(() => {
  console.log('Development database');
  console.log("Database Connection is ready...");
})
.catch((err) => {
  console.log(err);
});

app.listen(port, () => {
    console.log(`email api app listening at http://localhost:${port}`)
})
  
