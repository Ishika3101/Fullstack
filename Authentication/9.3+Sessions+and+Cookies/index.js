import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";//to allow us to set up a new session to start saving user login sessions
import passport from "passport";
import {Strategy} from "passport-local";

const app = express();
const port = 3000;
const saltRounds = 10;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
//we will use this as a middleware
app.use(session({ //we will pass options
  secret:"TOPSECRET",
  resave:false, //whether we want to force a session to be saved into the store basically to pair with postgres
  saveUninitialized:true,//to store into our memory
  cookie:{
    maxAge:1000*60*60*24 //if we take 1000ms(1s)*60 (1min)*60(1hr)*24(1 day)
  }
}));
//its really imp that passport module goes after session initialisation
app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "123456",
  port: 5432,
});
db.connect();

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});
//if there is an active session saved in our cookie then we directly show them this page otherwise not
app.get("/secrets",(req,res)=>{
  //console.log(req.user);
  //something that saves into the request which is called isAuthenticated and it comes from passport and it allows us to check is the current user who is logged in in the current session is authenticated already?

  if(req.isAuthenticated()){
    res.render("secrets.ejs");
  }else{
    res.redirect("/login");
  }
})

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      //hashing the password and saving it in the database
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          console.log("Hashed Password:", hash);
          const result=await db.query( //to hold of the user through result of this query and it comes back because we are using returning *
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, hash]
          );
          const user=result.rows[0];
          req.login(user,(err)=>{
            console.log(err);
            res.redirect("/secrets")
          })
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login",passport.authenticate("local",{
  successRedirect:"/secrets",
  failureRedirect:"/login"
}));

passport.use(new Strategy(async function verify(username,password,cb){
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      username,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHashedPassword = user.password;
      bcrypt.compare(password, storedHashedPassword, (err, result) => {
        if (err) {
          return cb(err);
        } else {
          if (result) {
            return cb(null,user) //null as no error
          } else {
            return cb(null,false) //its an user error so we set it to false
          }
        }
      });
    } else {
      return cb("User not found");
    }
  } catch (err) {
    return cb(err);
  }
}))

passport.serializeUser((user,cb)=>{
  cb(null,user); //we can use callback to pass any of the details of the user
})
passport.deserializeUser((user,cb)=>{
  cb(null,user);
})
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
