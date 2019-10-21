const Note = require('../models/note.model.js');

// exports.create = (req, res) => {

// };

// exports.findAll = (req, res) => {

// };

// exports.findone = (req, res) => {

// };

// exports.update = (req, res) => {

// };

// exports.delete = (req, res) => {

// };

exports.create = (req, res) => {
    console.log('inside post request');
    if (!req.body.content) {
        return res.status(400).send({ message: "Note content cannot be empty" });
    }
    const note = new Note({
        title: req.body.title || "Untitled note",
        content: req.body.content
     });
     note.save().then(data=>{
         console.log('------data--------',data);
         res.send(data);
         
     }).catch(err=> {
        res.status(500).send({
         message: err.message || "Some error occured while creating the Note."
        });
     });
};


exports.findAll = (req,res) =>{
    Note.find().then(notes =>{
        console.log('inside get all request')
        res.send(notes);
    }).catch(err=>{
        res.status(500).send({
            message: err.message || "Some error occured while retreiving notes."
        });
    });
};

exports.findOne = (req,res) =>{
    console.log('inside getbyid request');
    Note.findById(req.params.noteId).then(note=>{
        if(!note){
            return res.status(404).send({message:"Note not found with id" +req.params.noteId})
        }
        res.send(note);
    }).catch(err=>{
        if(err.kind === 'ObjectId'){
            return res.status(404).send({
                message: "Note not found with id"+req.params.noteId
            });
        }
        return res.status(500).send({message: "error retreiving note with id" + req.params.noteId});
    });
};

exports.update = (req,res) =>{
    console.log('inside update request');
    if(!req.body.content){
        return res.status(400).send({message: "Note content cannot be empty"});
    }
    Note.findByIdAndUpdate(req.params.noteId, {
        title: req.body.title || "Untitled Note",
        content: req.body.content
    },{new: true}).then(note=>{
        if(!note){
            return res.status(404).send({
                message: "Note not found with id" + req.params.noteId
            });
        }
        res.send(note);
    }).catch(err=>{
        if(err.kind === 'ObjectId'){
            return res.status(404).send({message: "Note not found with id"+req.params.noteId});
        }
        return res.status(500).send({message: "Error updating note with id" + req.params.noteid});
    });
};

exports.delete = (req,res) =>{
    console.log('inside delete request');
    Note.findByIdAndRemove(req.params.noteId).then(data=>{
        if(!note){
            return res.status(404).send({message: "Note not found with id"+ req.params.noteid});
        }
        res.send({message: "Note deleted successfully"});
    }).catch(err=>{
        if(err.kind === 'ObjectId' || err.name === 'NotFound'){
            return res.status(404).send({message: "Note not found with id" + req.params.noteid});
        }
        console.log('err',err);
        return res.status(500).send({message: "Could not delete note with id"+ req.params.noteid});
    });
};