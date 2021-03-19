
// load the express package and create our app
var express = require('express');
var app     = express();
const PORT = process.env.PORT || 8080;
// set the port based on environment (more on environments later)
var port    = PORT;
const PASS = process.env.DBPASS
var mdbpass = PASS

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://adminDBuser:password1235321@cluster0.jgigv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


//const client = new MongoClient(uri, { useNewUrlParser: true });
//client.connect(err => {
//  const collection = client.db("test").collection("devices");
//  // perform actions on the collection object
//  client.close();
//});


app.route('/login')
  // show the form (GET http://localhost:PORT/login)
    .get(function(req, res) {       var output = 'getting the login! ';
      var input1 = req.query['input1'];
      var input2 = req.query['input2'];
      if (typeof input1 != 'undefined' && typeof input2 != 'undefined') {
        output+=('There was input: ' + input1 + ' and ' + input2);
        res.send(output);
     }
     console.log('Start the database stuff');

     MongoClient.connect(uri, function (err, db) {
            if(err) throw err;
            //Write databse Insert/Update/Query code here..
            console.log('Start the database stuff');
            var dbo = db.db("mydb");
            var myobj = { firstInput: input1, secondInput: input2 };
            dbo.collection("users").insertOne(myobj, function(err, res) {
              if (err) throw err;
              console.log("1 user inserted");
              db.close();
            });
            console.log('End the database stuff');
     });

   })
  // process the form (POST http://localhost:PORT/login)
    .post(function(req, res) { console.log('processing');
    res.send('processing the login form!');
  });

// send our index.html file to the user for the home page
app.get('/', function(req, res) {
     res.sendFile(__dirname + '/userInput.html');
});

///////////////////////////////////////////////////////////////////
// create routes for the admin section
//get an instance of the router
var adminRouter = express.Router(); 
///////////////////////////////////////////////////////////////////
// route middleware that will happen on every request
  adminRouter.use(function(req, res, next) {
    // log each request to the console
    console.log(req.method, req.url);
    console.log("Its middleware!!!");
    // continue doing what we were doing and go to the route
    next(); });
///////////////////////////////////////////////////////////////////


// admin main page. the dashboard (http://localhost:PORT/admin) 
adminRouter.get('/', function(req, res) {
  res.send('I am the dashboard!');  });
// users page (http://localhost:PORT/admin/users) 
adminRouter.get('/users', function(req, res) {
  res.send('I show all the users!');  });

// route middleware to validate :name 
adminRouter.param('name', function(req, res, next, name) {   // do validation on name here   // log something so we know its working 
  console.log('doing name validations on ' + name);   // once validation is done save the new item in the req   req.name = name;   // go to the next thing    next(); 
});


// route with parameters (http://localhost:PORT/admin/users/:name)
adminRouter.get('/users/:name', function(req, res) {   res.send('hello ' + req.params.name + '!');  }); 

// posts page (http://localhost:PORT/admin/posts) 
adminRouter.get('/posts', function(req, res) {
  res.send('I show all the posts!');  });


// apply the routes to our application
app.use('/admin', adminRouter);
///////////////////////////////////////////////////////////////////


// start the server
app.listen(PORT);
console.log('Express Server running at http://127.0.0.1:'+PORT);
///////////////////////////////////////////////////////////////////
