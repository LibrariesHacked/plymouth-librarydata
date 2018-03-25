const express = require('express');
const router = express.Router();
const csv = require("csvtojson");

const libraries_path = './data/libraries.csv';

// 
router.get('/', function (req, res, next) {
	csv()
		.fromFile(libraries_path)
		.on("end_parsed", function (libraries) {
			res.send(libraries);
		})
});

module.exports = router;
