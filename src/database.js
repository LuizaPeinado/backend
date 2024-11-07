const sqlite3 = require("sqlite3");

const DBSRC = "db.sqlite";

const db = new sqlite3.Database(DBSRC, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log("SQLITE DB CONNECTED");
    db.run(
      `CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, password TEXT)`,
      (err) => {
        if (err) {
          console.log("Table USERS already exists");
        }
      }
    );
    db.run(
      `CREATE TABLE hotel (id INTEGER PRIMARY KEY AUTOINCREMENT, local TEXT, url TEXT, status TEXT, preco INTEGER, stars INTEGER, quantidade INTEGER)`,
      (err) => {
        if (err) {
          console.log("Table HOTEL already exists");
        }
      }
    );
    db.run(
      `CREATE TABLE reservas (id INTEGER PRIMARY KEY AUTOINCREMENT, idUser INTEGER, idHotel INTEGER, date TEXT, FOREIGN KEY (idUser) REFERENCES users(id), FOREIGN KEY (idHotel) REFERENCES hotel(id))`,
      (err) => {
        if (err) {
          console.log("Table RESERVAS already exists");
        }
      }
    );
    db.run(
      `INSERT INTO hotel ( local, url, status, preco, stars, quantidade) VALUES 
('Bahea', 'https://cdn.pixabay.com/photo/2023/10/25/19/25/blue-8341156_960_720.jpg', 'Disponivel', 22, 4, 3),
('Nanuque', 'https://static.todamateria.com.br/upload/pa/is/paisagem-natural-og.jpg', 'Disponivel', 42, 5, 3),
('Sumare', 'https://46781.cdn.simplo7.net/static/46781/sku/quadros-por-tema-paisagens-e-natureza-quadro-retangular-paisagem-litoranea-ao-anoitecer--p-1633033574294.jpg', 'Disponivel', 80, 3, 3);
`,
      (err) => {
        if (err) {
          console.log("Insert hotel err");
        }
      }
    );
  }
});

module.exports = db;
