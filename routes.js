"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const image_1 = require("./image");
const path = require("path");
const fs = require("fs");
const del = require("del");
server_1.app.post('/images', server_1.upload.single('image'), (req, res, next) => {
    let newImage = new image_1.Image();
    newImage.filename = req.file.filename;
    newImage.originalName = req.file.originalname;
    newImage.desc = req.body.desc;
    newImage.save(err => {
        if (err) {
            return res.sendStatus(400);
        }
        res.status(201).json(newImage);
    });
});
server_1.app.get('/images', (req, res, next) => {
    image_1.Image.find({}, '-__v').lean().exec((err, images) => {
        if (err) {
            return res.sendStatus(400);
        }
        for (let i = 0; i < images.length; i++) {
            var img = images[i];
            img.url = req.protocol + '://' + req.get('host') + '/images/' + img._id;
        }
        res.json(images);
    });
});
server_1.app.get('/images/:id', (req, res, next) => {
    let imgId = req.params.id;
    image_1.Image.findById(imgId, (err, image) => {
        if (err) {
            return res.sendStatus(400);
        }
        res.setHeader('Content-Type', 'image/jpeg');
        fs.createReadStream(path.join(server_1.UPLOAD_PATH, image.filename)).pipe(res);
    });
});
server_1.app.delete('/images/:id', (req, res, next) => {
    let imgId = req.params.id;
    image_1.Image.findByIdAndRemove(imgId, (err, image) => {
        if (err) {
            return res.sendStatus(400);
        }
        del([path.join(server_1.UPLOAD_PATH, image.filename)]).then(deleted => {
            res.sendStatus(200);
            console.log('Deleted!');
        });
    });
});
//# sourceMappingURL=routes.js.map