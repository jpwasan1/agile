const express = require("express");
const socketIO = require("socket.io");
const mongoose = require('mongoose');
const app = express();
const server = app.listen(9000,()=>{
    console.log('Server is listening on port 9000');
});
const io = socketIO(server);
const path = require("path");



mongoose.Promise = global.Promise;
var connectionString = 'mongodb://jpwasan1:wasan13181@ds261616.mlab.com:61616/mongodb_crud';
mongoose.connect(connectionString,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log('MongoDB Connected')
}).catch(err=>{
    console.log('could not connect to the database',err);
    process.exit();
})

var users = {};
var name = '';

app.get('/:name', function(req, res){
    name = req.params.name;
    res.sendFile(path.join(__dirname, "/index.html"));
});

app.get('/', (req, res) => {
    res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});

require('./app/routes/note.routes.js')(app);

// socket
io.sockets.on("connection", function(socket){
    users[socket.id] = name;
    // node
    socket.on("nRoom", function(room){
        socket.join(room);
        socket.broadcast.in(room).emit("node new user", users[socket.id] + " new user has joined");
    });

    socket.on("node new message", function(data){
        io.sockets.in("nRoom").emit('node news', users[socket.id] + ": "+ data);
    });

    // python
    socket.on("pRoom", function(room){
        socket.join(room);
        socket.broadcast.in(room).emit("python new user", users[socket.id] + " new user has joined");
    });

    socket.on("python new message", function(data){
        io.sockets.in("pRoom").emit('python news', users[socket.id] + ": "+ data);
    });
});
