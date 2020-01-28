const mysql = require("mysql");
const inquirer = require("inquirer");

var con = mysql.createConnection({
  host: "localhost",
  user: "paul",
  password: "password",
  database: "bamazonDB"
});

con.connect();

function managerPrompts() {
  inquirer
    .prompt([
      {
        name: "products",
        type: "list",
        message: "What would you like to do:  ",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Products",
          "exit"
        ]
      }
    ])
    .then(answers => {
      switch (answers.products) {
        case "View Products for Sale":
          viewProducts();
          managerPrompts();
          break;
        case "View Low Inventory":
          viewLowInv();
          managerPrompts();
          break;
        case "Add to Inventory":
          addtoInv();
          managerPrompts();
          break;
        case "Add New Products":
          addNewProducts();
          break;
        case "Exit":
          con.end();
          break;
      }
    });
}

function viewProducts() {
  console.log("hello!");
  con.query("SELECT * FROM products;", function(error, results, fields) {
    if (error) throw error;
    for (let i = 0; i < results.length; i++) {
      console.log(
        "\nItem ID: " +
          results[i].item_id +
          " || Product Name: " +
          results[i].product_name +
          " || Price: " +
          results[i].price +
          " || Stock Quantity: " +
          results[i].stock_quantity +
          "\n"
      );
    }
  });
}

function viewLowInv() {
  let query = "SELECT * FROM products WHERE stock_quantity < 10;";
  con.query(query, function(error, results, fields) {
    for (let i = 0; i < results.length; i++) {
      if (error) throw error;
      console.log(
        "\nItem ID: " +
          results[i].item_id +
          " || Product Name: " +
          results[i].product_name +
          " || Price: " +
          results[i].price +
          " || Stock Quantity: " +
          results[i].stock_quantity +
          "\n"
      );
    }
  });
}

function addtoInv() {
  let query = `INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)`;
  con.query(query, ["jaiwolf tickets", "events", 70.0, 7], function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
  });
}

managerPrompts();
