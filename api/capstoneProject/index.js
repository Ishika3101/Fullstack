import express from "express";
import axios from "axios";

const app=express();
const port=3000;

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs"); //You’re telling Express:“Hey, whenever I render a page, use EJS as the template engine.”

const API_KEY="ad75f03efd03086740d7a7aa31721b3f";

app.get("/", (req, res) => {
    res.render("index");
});
app.post("/weather",async(req,res)=>{
    const city=req.body.city;
    try{
        const response=await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const weatherData = {
            city: response.data.name,
            temp: response.data.main.temp,
            description: response.data.weather[0].description,
            humidity: response.data.main.humidity
        };
        res.render("index",{weather:weatherData});
    }catch(error){
        console.log(error.message);
        res.render("index", { error: "City not found or API error" });
    }
})
app.listen(port,()=>{
    console.log(`Server is listening on ${port}`);
})