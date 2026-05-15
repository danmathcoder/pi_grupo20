const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "src")));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sua_senha",
  database: "seu_abnco",
});

db.connect((err) => {
  if (err) {
    console.log("Erro ao conectar:", err);
    return;
  }
  console.log("MySQL conectado!");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src/pages/index.html"));
});

app.listen(3000, () => {
  console.log("Servidor rodando em 3000");
});
