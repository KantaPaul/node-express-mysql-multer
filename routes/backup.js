// Get single product
// router.get("/:id", function(req, res, next) {
//   var id = req.params.id;
//   var sql = `SELECT * FROM products WHERE id = ${id}`;
//   db.query(sql, function(err, row, fileds) {
//     if (err) {
//       return res.status(500).json({
//         success: 0,
//         message: "Something going wrong"
//       });
//     }
//     if (row == "") {
//       return res.json({
//         success: 0,
//         message: "Data not Found"
//       });
//     }
//     return res.status(200).json({
//       success: 1,
//       data: row
//     });
//   });
// });

// Update database
// router.put("/update/:id", function(req, res, next) {
//   var id = req.params.id;
//   upload(req, res, function(err) {
//     if (err) {
//       return res.status(500).json({
//         success: 0,
//         message: err
//       });
//     }
//     var name = req.body.name;
//     var price = req.body.price;
//     var sku = req.body.sku;
//     var active = req.body.active;
//     var product_image = req.file.filename;

//     var sql = `UPDATE products SET name="${name}", price="${price}", sku="${sku}", active="${active}", product_image="${product_image}" WHERE id=${id}`;

//     db.query(sql, function(err, rows, result) {
//       if (err) {
//         return res.status(500).json({
//           success: 0,
//           message: "Something going wrong"
//         });
//       }
//       if (rows.changedRows === 0) {
//         return res.json({
//           success: 0,
//           message: "Data not found"
//         });
//       }
//       return res.status(200).json({
//         success: 1,
//         message: "Data update successfully",
//         data: rows
//       });
//     });
//   });
// });

// Delete
// router.delete("/delete/:id", function(req, res, next) {
//   var id = req.params.id;
//   var sql = `DELETE FROM products WHERE id = ${id}`;
//   db.query(sql, function(err, row, fileds) {
//     if (err) {
//       return res.status(500).json({
//         success: 0,
//         message: "Something going wrong"
//       });
//     }
//     if (row == "") {
//       return res.json({
//         success: 0,
//         message: "Data not Found"
//       });
//     }
//     return res.status(200).json({
//       success: 1,
//       message: "Data delete successfully"
//     });
//   });
// });
