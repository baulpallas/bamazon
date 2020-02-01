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
          addToInv();
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
          " || Product Sales: " +
          results[i].product_sales
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
        "Item ID: " +
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

function addToInv() {
  let DBarray = [];
  let newItem;
  con.query("SELECT * FROM products;", function(error, results, fields) {
    if (error) throw error;
    for (let i = 0; i < results.length; i++) {
      newItem =
        "Item ID: " +
        results[i].item_id +
        " || Product Name: " +
        results[i].product_name +
        " || Price: " +
        results[i].price +
        " || Stock Quantity: " +
        results[i].stock_quantity;
      +" || Product Sales: " + results[i].product_sales;
      DBarray.push(newItem);
    }
    inquirer
      .prompt([
        {
          name: "product",
          type: "list",
          message: "What product would you like to add inventory to?",
          choices: DBarray
        },
        {
          name: "addedInv",
          type: "input",
          message: "What would you like to set the inventory to?"
        }
      ])
      .then(answers => {
        for (let i = 0; i < DBarray.length; i++) {
          switch (answers.product) {
            case DBarray[i]:
              let query = `UPDATE products SET stock_quantity = ${answers.addedInv} WHERE item_id = ${results[i].item_id}`;
              con.query(query, function(error, results, fields) {
                if (error) throw error;
                managerPrompts();
              });
              break;
          }
        }
      });
  });
}

function addNewProducts() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What would you like to add?"
      },
      {
        name: "category",
        type: "input",
        message: "What category?"
      },
      {
        name: "price",
        type: "input",
        message: "What would you like to charge?"
      },
      {
        name: "quantity",
        type: "input",
        message: "How many would you like to stock?"
      }
    ])
    .then(answers => {
      let query = `INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)`;
      con.query(
        query,
        [answers.newProduct, answers.category, answers.price, answers.quantity],
        function(error, results, fields) {
          if (error) throw error;
          managerPrompts();
        }
      );
    });
}

managerPrompts();
