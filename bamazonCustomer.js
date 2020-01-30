const mysql = require("mysql");
const inquirer = require("inquirer");

var con = mysql.createConnection({
  host: "localhost",
  user: "paul",
  password: "password",
  database: "bamazonDB"
});
con.connect();

let displayInv = () => {
  con.query("SELECT * FROM products;", function(error, results, fields) {
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
          " || Product Sales: " +
          results[i].product_sales
      );
    }
  });
};

displayInv();
initialPrompts();

function initialPrompts() {
  inquirer
    .prompt([
      {
        name: "id",
        type: "input",
        message: "Please enter the ID of the item you'd like to purchase:  "
      },
      {
        name: "numUnits",
        type: "input",
        message:
          "Please enter the number of unit's that you'd like to purchase:  "
      }
    ])
    .then(answers => {
      let item = answers.id;
      let quantity = answers.numUnits;
      con.query(`SELECT * FROM products WHERE item_id = ${item};`, function(
        error,
        results,
        fields
      ) {
        if (error) throw error;
        // resursive logoic if not enough inventory for sale
        if (results[0].stock_quantity < quantity) {
          console.log(
            `There are not enough ${results[0].product_name} to meet your request.  Please try again`
          );
          initialPrompts();
        }
        let newQuantity = results[0].stock_quantity - quantity;
        let totalSales = quantity * results[0].price + results[0].product_sales;

        // logic if stock quanity falls to 0 --> removes item from database
        if (newQuantity === 0) {
          con.query(`DELETE FROM products WHERE item_id = ${item};`, function(
            error,
            results,
            fields
          ) {
            if (error) throw error;
          });
          con.end();
          //logic to update DB with new quantity of item
        } else {
          let query1 = `UPDATE products SET stock_quantity = ${newQuantity} WHERE item_id = ${item};`;

          let query2 = `UPDATE products SET product_sales = ${totalSales} WHERE item_id = ${item};`;

          // let query2 = ``;
          con.query(query1, function(error, results, fields) {
            if (error) throw error;
          });
          con.query(query2, function(error, results, fields) {
            if (error) throw error;
          });
          con.end();
        }
      });
    });
}
