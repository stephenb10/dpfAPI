'use strict';
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');

exports.get_all_photoIDs = function(req, res) {
    // Loop through all photos saved to device and append the resource name to the response
    
    let files = fs.readdirSync('./photos/'); 
    if (files.length > 0)
    {
        var fileNames = [];
        files.forEach((file) => {
            fileNames.push(file);
        });
        res.status(200).json({photos: fileNames});
    }
    else {
        res.status(204).send();
    }
};


exports.get_photo = function(req, res )
{
    var id = req.params.photoID;
    var path = './photos/' + id;
    
    try {
        if (fs.existsSync(path)) {
            console.log(path + ' exist');
            res.sendFile(id, {root: './photos'});
        }
        else
        {
            console.log(path + ' doesnt exist');
            res.status(404).send();
            return
        }
    } catch(err) {
        console.error(err);
    }

};

exports.new_photo = function(req, res )
{
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send();
    } 
    else 
    {
        var imageData = req.body.imageData

        if (!imageData) {
            res.status(400).send();
            return;
        }

        var datab64 = Buffer.from(imageData, 'base64');
        var fileName = uuidv4() + ".jpg";
        fs.writeFile('./photos/' + fileName, datab64, 'base64', function(err) {
            console.log(err);
            res.status(500).send();
            return;
        });

        res.status(201).json({photoID : fileName});
    }
};

exports.update_photo = function(req, res )
{
    
};

exports.delete_photo = function(req, res )
{
    var id = req.params.photoID;
    var path = './photos/' + id;

    fs.unlink(path, (err => { 
        if (err)  {
            console.log(err);
            res.status(404).send();

        }
        else { 
          console.log("\nDeleted: " + path); 
          res.status(204).send();
        } 
      })); 

};


exports.get_photo_frame = function(req, res ) {
    res.sendFile("frame.html", {root: './frame'});
}