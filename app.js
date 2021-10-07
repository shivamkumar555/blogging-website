//jshint esversion:6
//database ka connection angela ka video
//deployment using heroku instruction

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent ="India, officially the Republic of India, is a country in South Asia. It is the seventh-largest country by area, the second-most populous country, and the most populous democracy in the world.";
const aboutContent = "Our goal is to remove any technical or financial barriers that can prevent you from making your own website. Our powerful tools empower individuals and business owners to create a website, sell online, or reach global audiences. Whether you're a beginner or website expert, we're excited to help you on your journey!";
const contact1 =  "🌐email 💨ram@gmail.com \n \r \v 📳phone 💨 +91 xxx xxx xxxx \n \r \v 🔗other email 💨 shyam@gmail.com";
const contactContent = contact1.split("\n");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true}); //when you have to store locally
mongoose.connect("mongodb+srv://admin_shivam:Test123@cluster0.6hyx3.mongodb.net/blogDB",{useNewUrlParser: true}); // when it stored in mumbai mongodb database

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});



app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/delete/:_id",(req,res)=>{
  const {_id}=req.params;
  Post.deleteOne({_id})
  .then(()=>{
    console.log("delete successfully");
    res.redirect("/");
  })
  .catch((err)=>console.log(err));
});

/*app.listen(3000, function() {
  console.log("Server started on port 3000 or successfully");
});*/
app.listen(process.env.PORT||3000, function() {
  console.log("Server started on port 3000 or successfully");
});
