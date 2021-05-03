const catchAsync = require("../../../utils/api/catchAsync");
const AppError = require("./appError");

// get all docs
exports.getDocs = (Model, query) => catchAsync(async (req, res) => {
    let limit = 999;
    let page = 1;
    let skip = 0;
    
    if (req.query) {
        limit = Number(req.query.limit) || limit;
        page = Number(req.query.page) || page;
        skip = limit * (page - 1);
    }
   
    const docs = query
        ? await Model.find(query)
        : await Model.find().limit(limit).skip(skip)

    return res.json({
        status: 'success',
        results: docs.length,
        page,
        data: {[Model.collection.name]: docs}
    })
})


// get a doc
exports.getDoc = (Model, query) => catchAsync(async (req, res, next) => {
    const docName = Model.collection.name.slice(0, Model.collection.name.length - 1);
    const doc = query
        ? await Model.findOne(query)
        : req[docName] || await Model.findById(req.params.id);

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
      { new: true, useFindAndModify: false,  runValidators: true, context: 'query' }
    );
  
    return res.json({
        status: 'success',
        message: `${docName} updated successfully`,
        data: {[docName]: updatedDoc}
    })
   
})

// delete a doc
exports.deleteDoc = (Model) => catchAsync(async (req, res) => {
    const docName = Model.collection.name.slice(0, Model.collection.name.length - 1);
    req[docName]
        ? await req[docName].remove()
        : await Model.findOneAndDelete({_id: req.params.id})
    
    return res.json({
        status: 'success',
        message: `${docName} deleted`
    })
})

