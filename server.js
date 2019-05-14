"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const mongoose = require("mongoose");
exports.UPLOAD_PATH = 'uploads';
exports.PORT = 3000;
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, exports.UPLOAD_PATH);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + ' - ' + Date.now());
    }
});
exports.upload = multer({ storage: storage });
exports.app = express();
exports.app.use(cors());
var routes = require('./routes');
let uri = 'mongodb://localhost/image_upload';
mongoose.connect(uri, (err) => {
    if (err) {
        console.log('Could not connect to MongoDB... Server is not running!');
    }
    else {
        console.log('Connected to MongoDB...');
    }
});
exports.app.listen(exports.PORT, () => {
    console.log('Listening on port: ' + exports.PORT);
});
//# sourceMappingURL=server.js.map