DROP DATABASE IF EXISTS bamazonDB;
CREATE database bamazonDB;

USE bamazonDB;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(40) NOT NULL,
  department_name VARCHAR(40) NULL,
  price DECIMAL(10,4) NULL,
  stock_quantity INT(40) NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
    ("DW Drumset", "Musical Instruments", 1800.00, 3),
    ("Macbook Pro", "Technology", 1500.00, 10),
    ("Laptop Case", "Accessories", 10.00, 25),
    ("Vans Shoes", "Clothing", 65.00, 15),
    ("Joes Jeans, Mens", "Clothing", 95.00, 8),
    ("Iphone 11 Pro", "Technology", 1300.00, 10),
    ("Fender Stratacaster", "Musical Instruments", 1500.00, 3);
   