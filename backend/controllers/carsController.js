import Cars from '../models/Cars.js';

export const showAllCars = async (req, res) => {
    try {
        const documents = await Cars.find({}).populate("marca");
        res.json(documents);
    } catch (error) {
        console.log(error);
    }
};

export const searchCarsByName = async (req, res) => {
    try {
        const { query } = req.params;
        const documents = await Cars.find({ nombre: new RegExp(query, 'i') });
        res.json(documents);
    } catch (error) {
        console.log(error);
    }
};

export const searchCarsByCategory = async (req, res) => {
    try {
        const { query } = req.params;
        const documents = await Cars.find({ category:ObjectId(req.params.idCategory) })
                                .populate("marca");
        res.json(documents);
    } catch (error) {
        console.log(error);
    }
};

export const searchCarsByPrice = async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.params;
        const documents = await Cars.find({
            $and:
                [
                    { price: { $gte: minPrice } },
                    { price: { $lte: maxPrice } },
                ]
        });
        res.json(documents);
    } catch (error) {
        console.log(error);
    }
};

export const showCarById = async (req, res) => {
    const document = await Cars.findById(req.params.idCar);
    if (!document) {
        res.json({ message: 'This car doesn\'t exist' });
    }
    res.json(document);
};

export const newCar = async (req, res) => {
    const document = new Cars(req.body);
    try {
    
        const doc = await document.save();
        res.json({ message: 'New car was added with id:'+doc._id });
    } catch (error) {
        res.send(error);
    }
};

export const updateCar = async (req, res) => {
    try {
        const filter = { _id: req.body.id };
        const update = req.body;
        const options = { new: true };
        const document = await Cars.findOneAndUpdate(filter, update, options);
        res.json({
            "message":"Car updated successfuly",
            ...document
        });
    } catch (error) {
        res.send(error);
    }
};

export const deleteCar = async (req, res) => {
    try {
        await Cars.findByIdAndDelete({ _id: req.params.idCar });
        res.json({ message: 'The car was deleted with id:'+req.params.idCar });
    } catch (error) {
        console.log(error);
    }
};
