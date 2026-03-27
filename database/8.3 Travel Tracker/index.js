import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db=new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"world",
  password:"Ishika3101*",
  port:5432
});
db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


//Get home page
app.get("/", async (req, res) => {
  //Write your code here.
  const result=await db.query("SELECT country_code FROM visited_countries");
  let countries=[];
  result.rows.forEach((country)=>{
    countries.push(country.country_code);
  });
  console.log(result.rows);
  res.render("index.ejs", { countries: countries, total: countries.length });
  db.end();
});
 //post method for adding country that are visited
app.post("/add",async(req,res)=>{
  const input=req.body["country"]; //where user types country in the name =country
  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE "%"||$1||"%";",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code) VALUES ($1)",
        [countryCode]
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
      const countries = await checkVisisted();
      res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        error: "Country has already been added, try again.",
      });
    }
  } catch (err) {  //checks error when country name is not there
    console.log(err);
    const countries = await checkVisisted();
    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      error: "Country name does not exist, try again.",
    });
  }
});
  
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
