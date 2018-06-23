
var express=require('express');
var path=require('path');
var mongo=require('mongodb').MongoClient;
var bodyParser=require('body-parser');

var app=express();

var new_db="mongodb://nishant:bully1998@ds139909.mlab.com:39909/thebookbarter";

app.get('/',function(req,res){
    app.set('view engine','ejs');
    res.render('index');
});
server=app.listen(3000);

/*const io=require('socket.io')(server);

io.on('connection',(socket)=>{
    socket.username="Anonymous";

    console.log(socket.username);
    socket.on('change_username',(data)=>{
        socket.username=data.username;
    });

    socket.on('new_message',(data)=>{
        io.sockets.emit('new_message',{message : data.message, username:socket.username});
    });

    socket.on('typing',(data)=>{
        socket.broadcast.emit('typing',{username:socket.username});
    });
});*/


app.get('/signup',function(req, res){
    res.set({
        'Access-Control-Allow-Origin' : '*'
    });
    return res.redirect('/public/signup.html');
})

app.use('/public',express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.post('/signin',(req,res)=>{
    app.set('view engine','ejs');
    res.render('signin');
});

app.post('/signup',(req,res)=>{
    app.set('view engine','ejs');
    res.render('signup');
})
var user="";
app.post('/sign_in',function(req,res){
    var email=req.body.email;
    var password=req.body.password;

    var data = {
        "email" : email
    };
    mongo.connect(new_db,function(error, db){
        if (error)
        throw error;
        db.collection("customers").findOne(data, function(err,result){
            if (err)
            throw err;
            var checkpassword=result.password;
            console.log(result);
            if(checkpassword === password)
            {
                user=result.name;
     app.set('view engine','ejs');
     res.render('chatroom');
     }
        });
    });

    /*if(checkpassword === password)
    res.set({
		'Access-Control-Allow-Origin' : '*'
	});
	return res.redirect('/public/profile.html'); */
});
const io=require('socket.io')(server);

io.on('connection',(socket)=>{
    socket.username=user;
    user="";
    console.log(socket.username);
    /*socket.on('change_username',(data)=>{
        socket.username=user;
        console.log(data);
    });*/

    socket.on('new_message',(data)=>{
        io.sockets.emit('new_message',{message : data.message, username:socket.username});
        console.log(data);
    });

    socket.on('typing',(data)=>{
        socket.broadcast.emit('typing',{username:socket.username});
        console.log(data);                
    });
});

app.post('/sign_up',function(req,res){
    var name=req.body.name;
    var email=req.body.email;
    var password=req.body.password;

    var  data = {
        "name" : name,
        "email" : email,
        "password" : password
    };

    mongo.connect(new_db,function(error, db){
        if(error)
        throw error;
        db.collection("customers").insertOne(data, (err, collection) => {
            if (err)
            throw err;
        });
    });

    app.set('view engine','ejs');
    res.render('signin'); 
});


