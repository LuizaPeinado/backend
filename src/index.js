const express = require("express");
const app = express();
const db = require("./database.js");
const bodyParser = require("body-parser");
const cors = require("cors");
const md5 = require("md5");
const https = require('https');
const fs = require('fs');

const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res, next) => {
  res.json({ msg: "Server Working!" });
});

app.get("/hotel", (req, res, next) => {
  const sql = "select * from hotel";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

app.get("/reservas", (req, res, next) => {
  const sql = "select * from reservas";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

app.post("/reservas", (req, res, next) => {
  const data = {
    idUser: req.body.idUser,
    idHotel: req.body.idHotel,
    date: req.body.date,
  };
  const sql = "INSERT INTO reservas (idUser, idHotel, date) VALUES (?,?,?)";
  const params = [data.idUser, data.idHotel, data.date];

  db.all(sql, params, (err, response) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: response,
    });
  });
});

app.put("/reservas/:id", (req, res) => {
  const { id } = req.params;
  const { idUser, idHotel, date } = req.body;

  // Verifica se os campos necessários foram fornecidos
  if (!idUser || !idHotel || !date) {
    return res.status(400).json({
      error: "Todos os campos são obrigatórios: idUser, idHotel, date",
    });
  }

  const sql = `UPDATE reservas SET idUser = ?, idHotel = ?, date = ? WHERE id = ?`;
  const params = [idUser, idHotel, date, id];

  db.run(sql, params, function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Erro ao atualizar a reserva" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Reserva não encontrada" });
    }

    res.json({
      message: "Reserva atualizada com sucesso",
      data: { id, idUser, idHotel, date },
    });
  });
});

app.get("/users", (req, res, next) => {
  const sql = "select * from users";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});
app.post("/users", (req, res, next) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  const sql = "INSERT INTO users (name, email, password) VALUES (?,?,?)";
  const params = [data.name, data.email, data.password];

  db.all(sql, params, (err, response) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: response,
    });
  });
});

const options = {
  key: fs.readFileSync('key.pem'), // substitua pelo caminho do arquivo key.pem
  cert: fs.readFileSync('cert.pem') // substitua pelo caminho do arquivo cert.pem
};

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});

// const server = https.createServer(options, (req, res) => {
//   res.writeHead(200);
//   res.end('Servidor HTTPS com IP especificado!');
// });
// const port = 3000;        // Porta HTTPS padrão
// const ip = '192.168.56.1';

// server.listen(port, ip, () => {
//   console.log(`Servidor HTTPS rodando em https://${ip}:${port}`);
// });