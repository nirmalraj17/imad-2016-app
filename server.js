var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
const crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');


var config = {
   user: "nirmalraj17",
   database: "nirmalraj17",
   host: "db.imad.hasura-app.io",
   port: "5432",
   password: process.env.DB_PASSWORD
   
};
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue',
    ccookie: { maxAge: 1000 * 60 * 60 * 24 * 30}
}));


var articles = {
    'article-one': {
        title: 'Article One | Nirmal Raj',
        heading: 'Article One',
        date: 'September 10',
        content: `
        <p>
            This is my first paragrah. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. First paragraph ends here. 
        </p>
        <p>
            This is my second paragrah. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. Second paragraph ends here.
        </p>
        <p>
            This is my third paragrah. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. Third paragraph ends here.
        </p>`
    },
    'article-two': {
        title: 'Article Two | Nirmal Raj',
        heading: 'Article Two',
        date: 'September 15',
        content: `
        <p>
            This is my first paragrah. This is the content for my second article. This is the content for my second article. This is the content for my second article. This is the content for my second article. This is the content for my second article. This is the content for my second article. paragraph ends here
        </p>`
    },
    'article-three': {
        title: 'Article Three | Nirmal Raj',
        heading: 'Article Three',
        date: 'September 19',
        content: `
        <p>
            This is my first paragrah. This is the content for my third article. 
        </p>`
    }
};

function createTemplate(data){
    var title = data.title;
    var heading = data.heading;
    var date = data.date;    
    var content = data.content;
    
    var htmlTemplate = `
    <html>
        <head>
            <title>
                ${title}
            </title>    
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link href="/ui/style.css" rel="stylesheet" />
        </head>    
        <body>
            <div class="container">
                <div>
                    <a href="/">Home</a>
                </div>    
                <hr/>
                <h3>
                    ${heading}
                </h3>
                <div>
                    ${date.toDateString()}
                </div>
                <div>
                    ${content}
                </div>
            </div>
        </body>    
    </html>
    `;
    return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash (input, salt){
    var hashed = crypto.pbkdf2Sync(input, salt,10000, 512, 'sha512');
    return ["pbkdf2Sync", "10000", salt, hashed.toString('hex')].join('$');
}

app.get('/hash/:input', function(req, res) {
   var hashedString = hash(req.params.input, `this-is-some-random-string`);
   res.send(hashedString);
});

app.post('/create-user', function(req,res) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var salt = crypto.randomBytes(128).toString('hex');
    var dbString = hash(password, salt);
    pool.query('INSERT INTO "user" (username, email, password) VALUES ($1,$2,$3)', [username,email,dbString], function(err, result){
       if (err){
           res.status(500).send(err.toString()); 
       } else 
            res.send('User created successfully' + username);
     });
});

app.post('/login', function(req,res) {
    var username = req.body.username;
    var password = req.body.password;
    
    pool.query('SELECT * FROM "user" where username = $1', [username], function(err, result){
       if (err){
           res.status(500).send(err.toString()); 
       } else {
            if (result.rows.length ===0)
                res.send(403).send('username or password is invalid');
            else {
                var dbString = result.rows[0].password;
                var salt = dbString.split('$')[2];
                var hashedPassoword = hash(password, salt);
                    if (hashedPassoword ===dbString){
                        req.session.auth  = {userId: result.rows[0].id};
                        res.send('credentials correct');
                    } else {
                        res.send(403).send('username or password invalid');
                    }
                }   
       
       }
     });
});

app.get('/check-login', function (req,res){
   if (req.session && req.session.auth && req.session.auth.userId) {
       res.send('You are logged in '+ req.session.auth.userId.toString());
   } else {
       res.send('You are not logged in');
   }
});

app.get('/logout', function (req, res){
   delete req.session.auth;
   res.send('Logged out');
});

var pool = new Pool(config);
app.get('/article', function (req,res) {
    pool.query("select * from article", function (err, result){
       if (err){
           res.status(500).send(err.toString());
       } else {
           res.send(JSON.stringify(result.rows));
       }
    });
});




var counter = 0;
app.get('/counter', function(req,res){
  counter = counter + 1;
  res.send(counter.toString());
});

app.post('/create-article', function(req,res) {
    var title = req.body.title;
    var heading = req.body.heading;
    var date = req.body.date;
    var content = req.body.content;
    var id = req.session.auth.userId;
    pool.query('INSERT INTO "article" (title, heading, date, content, id) VALUES ($1,$2,$3,$4,$5)', [title,heading,date,content,id], function(err, result){
       if (err){
           res.status(500).send(err.toString()); 
       } else 
            res.send('Article created successfully' + title);
     });
});

app.get('/articles/:articleName', function(req,res){
 
  pool.query("select * from article where title = $1", [req.params.articleName] , function (err, result){
       if (err){
           res.status(500).send(err.toString());
       } else {
           if (result.rows.length === 0) {
               res.status(404).send('Article not found');
           } else {
                var articleData = result.rows[0];
                res.send(createTemplate(articleData));
           }
       }
    });
});


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/scripts.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'scripts.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});