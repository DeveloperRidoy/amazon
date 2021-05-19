const Order = require("../../../mongodb/models/Order");
const catchAsync = require("../../../utils/api/catchAsync");
const AppError = require("./appError");

// get all docs
exports.getDocs = (Model) => catchAsync(async (req, res) => {
    let limit = 999;
    let page = 1;
    let skip = 0;
    
    if (req.query) {
        limit = Number(req.query.limit) || limit;
        page = Number(req.query.page) || page;
        skip = limit * (page - 1);
    }
   
    const docs = await Model.find(req.body).limit(limit).skip(skip)

    return res.json({
        status: 'success',
        results: docs.length,
        page,
        data: {[Model.collection.name]: docs}
    })
})


// get a doc
exports.getDoc = (Model) => catchAsync(async (req, res, next) => {
    const docName = Model.collection.name.slice(0, Model.collection.name.length - 1);
    const doc = await Model.findById(req.params.id);

    if(doc === null) return next(new AppError(404, `${docName} not found`))
    
    return res.json({
        status: 'success',
        data: {[docName]: doc}
    })
})


// add a doc
exports.addDoc = (Model) => catchAsync(async (req, res) => {
    const docName = Model.collection.name.slice(0, Model.collection.name.length - 1);
    const newDoc = await Model.create(req.body);
    
    return res.json({
        status: 'success',
        message: `${docName} added successfully!`,
        data: {[docName]: newDoc}
    })
})

// update a doc
exports.updateDoc = (Model) => catchAsync(async (req, res) => {
    const docName = Model.collection.name.slice(0, Model.collection.name.length - 1);
   
    const updatedDoc = await Model.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true, useFindAndModify: false, context: 'query', validateModifiedOnly: true }
    );
  
    return res.json({
        status: 'success',
        message: `${docName} updated`,
        data: {[docName]: updatedDoc}
    })
    
})

// delete a doc
exports.deleteDoc = (Model) => catchAsync(async (req, res) => {
    const docName = Model.collection.name.slice(0, Model.collection.name.length - 1);
    await Model.findOneAndDelete({_id: req.params.id})
    
    return res.json({
        status: 'success',
        message: `${docName} deleted`
    })
})

// update all docs
exports.updateManyDocs = (Model) => catchAsync(async (req, res) => {
    const {query, data} = req.body
    await Model.updateMany(query, data);
    const updatedDocs = await Model.find();
    return res.json({
        status: 'success',
        message: `${Model.collection.name} updated`,
        data: {[Model.collection.name]: updatedDocs}
    })
})

// delete all docs
exports.deleteManyDocs = (Model) => catchAsync(async (req, res) => {
    await Model.deleteMany(req.body);

    return res.json({
        status: 'success',
        message: `${Model.collection.name} deleted`
    })
})

