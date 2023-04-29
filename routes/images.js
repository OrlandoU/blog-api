var express = require('express')
var router = express.Router()
var fs = require('fs')

router.get('/:id', (req, res, next)=>{
    const filepath = req.params.id
    const path = './uploads/' + filepath
    fs.readFile(path, (err, data)=>{
        if(err){
            console.error(err);
            res.status(500).send('Error reading image file');
        } else{
            res.writeHead(200, { 'Content-Type': 'image/jpeg' });
            res.end(data);
        }
    })
})

module.exports = router