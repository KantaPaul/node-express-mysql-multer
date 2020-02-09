var express = require("express");
var router = express.Router();
var db = require("../db");
var multer = require("multer");
var path = require("path");

/* GET users listing. */
router.get("/", function(req, res, next) {
  var sql = "SELECT * FROM products ORDER BY products.created_at DESC";
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
    cb(null, process.env.PRODUCT_IMAGE_UPLOAD_DIR);
  },
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

var upload = multer({
  storage: storage,
  fileFilter: multerFilter
}).single("product_image");

// Post new data
router.post("/create", function(req, res, next) {
  upload(req, res, function(err) {
    if (
      req.body !== "" &&
      req.file !== undefined &&
      !req.file.mimetype.startsWith("image")
    ) {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Something Goning Wrong"
        });
      }

      let name = req.body.name,
        price = req.body.price,
        active = req.body.active,
        product_image = req.file.filename,
        regular_price = req.body.regular_price,
        product_code = req.body.product_code,
        sql = `INSERT INTO products (name, price, regular_price, active, product_image, product_code) VALUES ("${name}", "${price}", "${regular_price}", "${active}", "${product_image}", ${product_code})`;

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
    }
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
    if (req.body !== "" && req.file !== undefined) {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: err
        });
      }
      let name = req.body.name,
        price = req.body.price,
        active = req.body.active,
        product_image = req.file.filename,
        regular_price = req.body.regular_price,
        product_code = req.body.product_code,
        sql = `UPDATE products SET name="${name}", price="${price}", regular_price="${regular_price}", active="${active}", product_image="${product_image}", product_code="${product_code}" WHERE id=${id}`;

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
    }
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

// Search
router.get("/search/:name", function(req, res, next) {
  var name = req.params.name;
  var sql = `SELECT * FROM products WHERE name LIKE '%${name}%' ORDER BY name ASC`;
  db.query(sql, function(err, row, fileds) {
    if (err) {
      return res.status(500).json({
        success: 0,
        message: err
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

module.exports = router;
