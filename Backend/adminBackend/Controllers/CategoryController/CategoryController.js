const db = require('../../Models/db');


const GetCategories = (req, res) => {
    const sqlQuery = 'CALL GetAllCategory()';
    db.query(sqlQuery, (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
}

const GetCategoriesByCatId = (req, res) => {
    const sqlQuery = 'CALL GetCategoryByID(?)';
    const catId = req.params.catId;
    db.query(sqlQuery, catId, (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
}

const AddCategory = (req, res) => {     
    const { catId, catName } = req.body;
    const sqlQuery = 'CALL AddCategory(?)';
    db.query(sqlQuery, [catName], (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
}

const UpdateCategory = (req, res) => {
    const { catId, catName } = req.body;
    db.query(sqlQuery, [catName, catId], (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
}

const DeleteCategory = (req, res) => {
    const catId = req.params.catId;
    const sqlQuery = 'DELETE FROM category WHERE catId = ?';
    db.query(sqlQuery, catId, (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
}

module.exports = { GetCategories, GetCategoriesByCatId, AddCategory, UpdateCategory, DeleteCategory }