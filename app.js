// -------------------------
// Includes and Requires
// -------------------------

var express = require('express');
var app = require('express').createServer();
var mongoose = require('mongoose');
var ejs = require('ejs');

// -------------------------
// Bootstraping application
// -------------------------
app.set('view engine', 'ejs');
app.set("view options", { layout: false });
app.use(express.bodyParser());

// -------------------------
// Schema config
// -------------------------
mongoose.connect('mongodb://localhost/lab');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var PostSchema = new Schema({
  ref     : ObjectId,
  author    : String,
  title     : String,
  body      : String
});

var Post = mongoose.model('Post', PostSchema);

// -------------------------
// Application Routes
// -------------------------

// -- Posts List

app.get('/', function(req,res) {
	existedPosts = false;
	Post.find({}, function (err, rs) {

	  totalPosts = rs.length;
	  if(totalPosts)
	  	existedPosts = true;

      console.log("Opening posts list.");
	  res.render('list.ejs',{existedPosts: existedPosts, posts: rs});
	});
});

// -- New post form

app.get('/newpost', function(req,res) {
	console.log("Opening Input Form.");
	res.render('new.ejs');
});

// -- New posts callback

app.post('/newpost', function(req,res) {
	post = new Post();
	post.author = req.body.author;
	post.title = req.body.title;
	post.body = req.body.body;
	post.save(function(err) {
		console.log("New Post successfully inputed");
		res.redirect('/');
	});
});

// -- Post editing Form

app.get('/editpost/:id', function(req, res) {
	Post.find({_id: req.params.id}, function(err, docs) {
		console.log("Opening post editing form: "+req.params.id);
		res.render('edit.ejs', {posts: docs[0]});
	});
});

// -- Existing post edit

app.post('/editpost', function(req, res) {
	Post.find({_id: req.body.objid}, function(err, docs) {
		docs[0].author = req.body.author;
		docs[0].title = req.body.title;
		docs[0].body = req.body.body;
		docs[0].save(function(err) {
			console.log("Post successfully updated");
			res.redirect('/');
		});
	});
});

// -- Post removal ObjectId

app.get('/deletepost/:id', function(req, res) {
	Post.find({_id: req.params.id}, function(err, docs) {
		docs[0].remove(function() {
			console.log("Post successfully removed");
			res.redirect('/');
		});
	});
});

// -------------------------
// Dispatching application
// -------------------------

app.listen(3000);
console.log("Server running at 127.0.0.1:3000");
