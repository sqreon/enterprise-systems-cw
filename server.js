// load express package
var express = require('express');
var app     = express();
const PORT = process.env.PORT || 8080;
// set the port based on environment
var port    = PORT;
const PASS = process.env.DBPASS
var mdbpass = PASS
// set public directory location for loading images later
var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

// set up mongodb connection string
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://adminDBuser:password1235321@cluster0.jgigv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

//function to handle recording user responses on AB test
app.route('/response')
    .get(function(req, res) {       ;
      var input_ab = req.query['input_ab'];

     console.log('Writing to database');

     MongoClient.connect(uri, function (err, db) {
            if(err) throw err;
            var myobj = { AB_Response: input_ab};
            dbo.collection("responses").insertOne(myobj, function(err, res) {
              if (err) throw err;
              console.log("response recorded");
              db.close();
            });
            console.log('Finished');
     });

   })
  // process the form (POST http://localhost:PORT/response)
    .post(function(req, res) { console.log('processing');
    res.send('processing AB test metrics gathering!');
  });


// send user to home page
app.get('/', function(req, res) {
     res.sendFile(__dirname + '/index.html');
});


///////////////////////////////////////////////////////////////////
var adminRouter = express.Router(); 
  adminRouter.use(function(req, res, next) {
    // log each request to the console
    console.log(req.method, req.url);
    next(); });
///////////////////////////////////////////////////////////////////


// admin main page. the dashboard (http://localhost:PORT/admin) 
adminRouter.get('/', function(req, res) {
  var output = " "

//finds number of clicks button A received
  MongoClient.connect(uri, function (err, db) {
         if(err) throw err;
         console.log('open database');
         var dbo = db.db("mydb");
         var query  = { AB_Response: "a"};
         dbo.collection("responses").find(query).toArray(function(err, result) {
           if (err) throw err;
           console.log("Number of clicks for button A: " + result.length);
           output += ("Number of clicks for button A: " + result.length + ' | ');
           db.close();
         });
         console.log('end read database');
  });

//finds number of clicks button B received
  MongoClient.connect(uri, function (err, db) {
         if(err) throw err;
         console.log('open database');
         var dbo = db.db("mydb");
         var query  = { AB_Response: "b"};
         dbo.collection("responses").find(query).toArray(function(err, result) {
           if (err) throw err;
           console.log("Number of clicks for button B: " + result.length);
           output += ("Number of clicks for button B: " + result.length);
           db.close();
           res.send(output);
         });
         console.log('end read database');

  });

});

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
