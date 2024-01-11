import Marcas from '../models/Marcas.js';

export const showAllMarcas = async (req, res) => {
    try {
        const documents = await Marcas.find({});
        res.json(documents);
    } catch (error) {
        console.log(error);
    }
};

export const showMarcaById = async (req, res) => {
    const document = await Marcas.findById(req.params.idMarca);
    if(!document) {
        res.json({message : 'Marca no exists'});
    }
    res.json(document);
};

export const searchMarcasByName = async (req, res) => {
    try {
        const { query } = req.params;
        const documents = await Marcas.find({ name: new RegExp(query, 'i') });
        res.json(documents);
    } catch (error) {
        console.log(error);
    }
};

export const newMarca = async (req, res) => {
    const document = new Marcas(req.body);
    try {
        const doc = await document.save();
        res.json({ 
            error:false,
            message : 'New marca was added with id:'+doc._id 
        });
    } catch (error) {
        //res.send(error);
        res.json({ 
            error:true,
            message : error
        });
    }
};

export const updateMarca = async (req, res) => {
    try {
        const filter = { _id : req.body.id };
        const update =  req.body;
        const options = {new : true};
        const document = await Marcas.findOneAndUpdate(filter, update, options);
        res.json({
           "message":"Marca modified successfuly",
           ...document
        });
    } catch (error) {
        res.send(error);
    }
};

export const deleteMarca = async (req, res) => {
    try {
        await Marcas.findByIdAndDelete({ _id : req.params.idMarca });
        res.json({message : 'Marca was deleted with id:'+req.params.idMarca });
    } catch (error) {
        console.log(error);
    }
};
