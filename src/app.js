import express from "express";
import cors from "cors";
import router from "./routes/index.Routes.js";
import env from 'dotenv'


env.config()
const app = express();

app.use(cors());
app.use(express.json());
app.use(router);


const port = process.env.PORT
app.listen(port, () =>
  console.log(`Tudo certo! Servidor rodando na porta ${port} :D`)
);
