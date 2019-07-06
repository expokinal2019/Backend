'user strict'

var Label= require('../models/label');

function createLabel(req,res) {
    var params=req.body;
    var label= new Label();
    if(params.name){
        label.name = params.name;
        label.color = params.color;
        label.save((err,labelCreated)=>{
            if(err) return res.status(500).send({message:'Error en la peticion'});
            if(!labelCreated) return res.status(404).send({message:'No se ha podido crear la etiqueta'});
            return res.status(200).send({label:labelCreated});
        })
    }
}

function editLabel(req,res) {
    var labelId=req.params.id;
    var params= req.body;
    Label.findByIdAndUpdate(labelId,params,{new:true},(err,labelUpdated)=>{
        if(err) return res.status(500).send({message:'Error en la peticion'});
        if(!labelUpdated) return res.status(404).send({message:'No se ha podido actualizar la etiqueta'});
        return res.status(200).send({label:labelUpdated});
    })
}

function deleteLabel(req,res) {
    var labelId=req.params.id;
    Label.findByIdAndRemove(labelId,(err,labelDeleted)=>{
        if(err) return res.status(500).send({message:'Error en la peticion'});
        if(!labelDeleted) return res.status(404).send({message:'No se ha podido eliminar la etiqueta'});
        if (labelDeleted) {
            return res.status(200).send({message:'Etiqueta eliminada correctamente'});
        }
    }) 
}

function getLabels(req,res) {
    Label.find((err,labels)=>{
        if(err) return res.status(500).send({message:'Error en la peticion'});
        if(!labels) return res.status(404).send({message:'No se han podido obtener las etiquetas'});
        return res.status(200).send({labels:labels})
    })
}


module.exports={
    createLabel,
    editLabel,
    deleteLabel,
    getLabels
}