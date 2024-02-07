const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const multer = require('multer');
const fs = require('fs');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const gfs = new Grid(mongoose.connection.db, mongoose.mongo);
        const writeStream = gfs.createWriteStream({
            filename: req.file.originalname,
            mode: 'w',
            content_type: req.file.mimetype,
        });
        fs.createReadStream(req.file.path).pipe(writeStream);
        writeStream.on('close', (file) => {
            fs.unlink(req.file.path, (err) => {
                if (err) throw err;
                return res.json({ 
                filename: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
                 });
            });
        });
    } catch (err) {
        return res.status(400).json({ message: 'Error uploading file', error: err });
    }
});

module.exports = router;
