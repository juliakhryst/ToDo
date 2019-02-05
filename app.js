var express = require("express");
var app = express();
var bodyParse = require("body-parser");
var mongoose = require("mongoose");

//mongodb connection
mongoose.connect("mongodb://localhost/todo", { useNewUrlParser: true });

//view engine for ejs file
app.set("view engine", "ejs");

app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParse.json());

//authorization
app.use((req, res, next) => {
    if (req.method !== 'GET') {
        if (req.headers.authorization === 'Bearer blablatoken') {
            console.log('Auth passed!')
            next();
        } else {
            console.log('Auth failed');
            next({
                status: 403,
                error: 'You are not authorized!'
            });
        }
    } else {
        next();
    }
});

//mogoose schema
var todoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isDone: {
        type: Boolean,
        default: false,
    }
});

var todo = mongoose.model("Todo", todoSchema);

//======Express routes ============//

app.get("/", function(req, res) {
    todo.find({}, function(err, todoList) {
        if(err) console.log(err);
        else {
            res.render("index.ejs", {todoList: todoList});
        }
    });
});

//add new todo item to the list
app.post("/newtodo", function(req, res) {
    console.log(req.body);
    var newTodo = new todo({
        name: req.body.item
    });
    todo.create(newTodo, function(err, todo) {
        if(err) console.log(err);
        else {
            console.log("Insert: " + newTodo);
        }
    });
    res.status(200).send('Ok');
});

//mark item as done/undone
app.post("/todo/:id/completed", function(req, res) {
    let todoId = req.params.id;
    console.log(req.params.id);
    todo.findById(todoId).exec().then(function(result) {
        result.isDone = !result.isDone;
        return result.save();
    })
    .then(function(result){
        res.status(200).send('Ok');
    });
});

//delete item
app.delete("/todo/:id", function(req, res) {
    let query = {_id: req.params.id};
    console.log(req.headers.authorization);
    todo.deleteOne(query,function(err) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        } else {
            console.log(`deleted`, query);
            res.status(200).send('Ok');
        }
    });
});

//catch all other routes
app.get("*", function(req, res) {
    res.send("all others /*");
});

//express server
app.listen(3000, function() {
    console.log("Server started port 3000");
});
