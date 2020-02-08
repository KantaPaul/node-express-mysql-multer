var express = require("express");
var router = express.Router();
var db = require("../db");
var multer = require("multer");
var path = require("path");

/* GET users listing. */
router.get("/", function(req, res, next) {
  var sql = "SELECT * FROM products";
  db.query(sql, function(err, rows, fileds) {
    if (err) {
      return res.status(500).json({
        success: 0,
        message: "Something going wrong"
      });
    }
    return res.status(200).json({
      success: 1,
      data: rows
    });
  });
});

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

var upload = multer({ storage: storage }).single("product_image");

// Post new data
router.post("/create", function(req, res, next) {
  upload(req, res, function(err) {
    if (err) {
      return res.status(500).json({
        success: 0,
        message: err
      });
    }

    var name = req.body.name;
    var price = req.body.price;
    var sku = req.body.sku;
    var active = req.body.active;
    var product_image = req.file.filename;

    var sql = `INSERT INTO products (name, price, sku, active, product_image) VALUES ("${name}", "${price}", "${sku}", "${active}", "${product_image}")`;

    db.query(sql, function(err, rows, result) {
      if (err && res.status === 404) {
        return res.status(500).json({
          success: 0,
          message: "Something going wrong"
        });
      }
      return res.status(200).json({
        success: 1,
        message: "Data create successfully",
        data: rows
      });
    });
  });
});

// Get single product
router.get("/:id", function(req, res, next) {
  var id = req.params.id;
  var sql = `SELECT * FROM products WHERE id = ${id}`;
  db.query(sql, function(err, row, fileds) {
    if (err) {
      return res.status(500).json({
        success: 0,
        message: "Something going wrong"
      });
    }
    if (row == "") {
      return res.json({
        success: 0,
        message: "Data not Found"
      });
    }
    return res.status(200).json({
      success: 1,
      data: row
    });
  });
});

// Update database
router.put("/update/:id", function(req, res, next) {
  var id = req.params.id;
  upload(req, res, function(err) {
    if (err) {
      return res.status(500).json({
        success: 0,
        message: err
      });
    }
    var name = req.body.name;
    var price = req.body.price;
    var sku = req.body.sku;
    var active = req.body.active;
    var product_image = req.file.filename;

    var sql = `UPDATE products SET name="${name}", price="${price}", sku="${sku}", active="${active}", product_image="${product_image}" WHERE id=${id}`;

    db.query(sql, function(err, rows, result) {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Something going wrong"
        });
      }
      if (rows.changedRows === 0) {
        return res.json({
          success: 0,
          message: "Data not found"
        });
      }
      return res.status(200).json({
        success: 1,
        message: "Data update successfully",
        data: rows
      });
    });
  });
});

// Delete
router.delete("/delete/:id", function(req, res, next) {
  var id = req.params.id;
  var sql = `DELETE FROM products WHERE id = ${id}`;
  db.query(sql, function(err, row, fileds) {
    if (err) {
      return res.status(500).json({
        success: 0,
        message: "Something going wrong"
      });
    }
    if (row == "") {
      return res.json({
        success: 0,
        message: "Data not Found"
      });
    }
    return res.status(200).json({
      success: 1,
      message: "Data delete successfully"
    });
  });
});

module.exports = router;
