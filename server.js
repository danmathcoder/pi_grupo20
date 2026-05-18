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
  password: "06508",
  database: "beleza_atendimento_db",
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

app.post("/salvar", (req, res) => {
  const { nome, sobrenome, servico, data_atendimento, horario } = req.body;

  const sql = `
    INSERT INTO agendamento (nome, sobrenome, servico, data_atendimento, horario)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [nome, sobrenome, servico, data_atendimento, horario],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(`Erro ao agendar: ${err}`);
      } else {
        res.status(200).send("Agendamento Confirmado");
      }
    },
  );
});

// traz os agendamentos
app.get("/consulta-agendamentos", (req, res) => {
  const sql = `
SELECT * 
FROM agendamento
ORDER BY data_atendimento, horario
`;
  db.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erro ao consultar agendamentos");
    } else {
      res.status(200).json(results);
    }
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando em 3000");
});
