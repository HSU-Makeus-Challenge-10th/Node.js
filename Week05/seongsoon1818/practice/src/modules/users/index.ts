import dotenv from "dotenv";
import express, { Express, Request, Response } from "express"
import cors from "cors"

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get("/", (req: Request, res :Response) => {
    res.send("hello world!\n this is a typescript server!");
});

app.listen(port, () =>{
    console.log(port + "번 포트에서 대기중");
});