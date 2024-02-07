let collection = require('../models/event');

const postEvent = (req,res) => {
    let event = req.body;
    collection.postEvent(event, (err,result) => {
        if (!err) {
            res.json({statusCode:201,data:result,message:'success'});
        }
    });
}

// const getAllCats = (req,res) => {
//     collection.getAllCats((error,result)=>{
//         if (!error) {
//             res.json({statusCode:200,data:result,message:'success'});
//         }
//     });
// }

// const deleteCat = (req,res) => {
//     let cat = req.body;
//     collection.deleteOne(cat, (err,result) => {
//         if (!err) {
//             res.json({statusCode:201,data:result,message:'success'});
//         }
//     });
// }

module.exports = postEvent;