import Categories from '../models/Categories.js';

export const showAllCategories = async (req, res) => {
    try {
        const documents = await Categories.find({});
        res.json(documents);
    } catch (error) {
        console.log(error);
    }
};

export const showCategoryById = async (req, res) => {
    const document = await Categories.findById(req.params.idCategory);
    if(!document) {
        res.json({message : 'Category no exists'});
    }
    res.json(document);
};

export const searchCategoriesByName = async (req, res) => {
    try {
        const { query } = req.params;
        const documents = await Categories.find({ name: new RegExp(query, 'i') });
        res.json(documents);
    } catch (error) {
        console.log(error);
    }
};

export const newCategory = async (req, res) => {
    const document = new Categories(req.body);
    try {
        const doc = await document.save();
        res.json({ 
            error:false,
            message : 'New category was added with id:'+doc._id 
        });
    } catch (error) {
        //res.send(error);
        res.json({ 
            error:true,
            message : error
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const filter = { _id : req.body.id };
        const update =  req.body;
        const options = {new : true};
        const document = await Categories.findOneAndUpdate(filter, update, options);
        res.json({
           "message":"Category modified successfuly",
           ...document
        });
    } catch (error) {
        res.send(error);
    }
};

export const deleteCategory = async (req, res) => {
    try {
        await Categories.findByIdAndDelete({ _id : req.params.idCategory });
        res.json({message : 'Category was deleted with id:'+req.params.idCategory });
    } catch (error) {
        console.log(error);
    }
};
