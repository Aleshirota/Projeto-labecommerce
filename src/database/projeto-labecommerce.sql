-- Active: 1674684971134@@127.0.0.1@3306
 CREATE TABLE users (
  id TEXT PRIMARY KEY UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (DATETIME())
);

CREATE TABLE products (
  id TEXT PRIMARY KEY UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL
);

CREATE TABLE purchases (
  id TEXT PRIMARY KEY UNIQUE NOT NULL,
  buyer_id TEXT NOT NULL ,
  total_price REAL NOT NULL,
  created_at TEXT NOT NULL DEFAULT (DATETIME()),
  paid INTEGER NOT NULL DEFAULT (0),
  FOREIGN KEY (buyer_id) REFERENCES users(id)
);

CREATE TABLE purchases_products (
  purchase_id TEXT NOT NULL ,
  product_id TEXT NOT NULL ,
  quantity INTEGER NOT NULL DEFAULT (1),
  FOREIGN KEY (purchase_id) REFERENCES purchases(id),
	FOREIGN KEY (product_id) REFERENCES products(id)

);

INSERT INTO users (id, name, email, password, created_at)
VALUES
("u001","Fulano","fulano@email.com","fulano123","2023-01-15 09:12:42"),
("u002","Cristina","cristina@email.com","cristina23","2023-01-15 09:12:45"),
("u003","Ciclana", "ciclana@email.com", "ciclana99", "2023-01-17 12:35:28");

INSERT INTO Products (id,name,price,description,image_url)
VALUES
("prod001","Mouse gamer", 250,"Melhor mouse do mercado!","https://picsum.photos/seed/Mouse%20gamer/400"),
( "prod002","Monitor",900, "Monitor LED Full HD 24 polegadas", "https://picsum.photos/seed/Monitor/400"),
( "prod003", "Teclado gamer",200,"Teclado mecânico com numpad","https://picsum.photos/seed/Teclado%20gamer/400");
INSERT INTO purchases ( id,buyer_id,total_price,paid)
VALUES
("pu01","u001", 121,0),
("pu02","u002", 141,0);

INSERT INTO purchases_products ( purchase_id, product_id, quantity)
VALUES
("pu01","prod001",2),
("pu02","prod002",4);


SELECT * FROM users;
SELECT * FROM products;
SELECT * FROM purchases;
SELECT * FROM  purchases_products;
DROP TABLE users;
DROP TABLE products;
DROP TABLE purchases;
DROP TABLE  purchases_products;

SELECT *
     FROM purchases_products
    INNER JOIN purchases
    ON purchases_products.purchase_id = purchases.id
     INNER JOIN products
    ON purchases_products.product_id = products.id;