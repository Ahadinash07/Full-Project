const db = require("../../Models/db");


// ===========================Add==========================Admin=============================Role==============================

const addAdminRole = (req, res) => {
    const {roleId, roleName} = req.body;
    

    const sqlQuery = 'SELECT addAdminRole(?, ?)';                                       // STORED FUNCTION

    db.query(sqlQuery, [roleId, roleName], (err, result) => {
        if(err){
            return res.json({error: err});
        }
        else{
            return res.json(result);
        }
    });
}
       

// ===========================Get==========================Admin=============================Role==============================

const getAdminRole = (req, res) => {
    const sqlQuery = 'SELECT * FROM AdminRole';

        db.query(sqlQuery, (err, result) => {
        
        if(err){
            return res.json({error: err});
        }
        else{
            return res.json(result);
        }
    });
}




const getAdminRoleNameByRoleID = (req, res) => {

    const sqlQuery = 'SELECT roleName FROM AdminRole WHERE roleId = ?';

    const roleId = req.params.roleId;

    db.query(sqlQuery, [roleId], (err, result) => {
        
        if(err){
            return res.json({error: err});
        }
        else{
            return res.json(result);
        }
    });
}


// ===========================Update==========================Admin=============================Role==============================

const updateAdminRole = (req, res) => {
    
    const { roleId, roleName } = req.body;
    
    
    

    const sqlQuery = 'CALL updateAdminRole(?, ?)';                                      // STORED PROCEDURE

    db.query(sqlQuery, [roleId, roleName], (err, result) => {
        
        if(err){
            return res.json({error: err});
        }
        else{
            return res.json(result);
        }
    });
}


// ===========================Delete==========================Admin=============================Role==============================

const deleteAdminRole = (req, res) => {
    

    const sqlQuery = 'SELECT deleteAdminRole(?)'                                        // STORED FUNCTION

    db.query(sqlQuery, [req.params.roleId], (err, result) => {
        if(err){
            return res.json({error: err});
        }
        else{
            return res.json(result);
        }
    });
}



const getUserRoles = (req, res) => {
    const userId = req.params.userId;

    const sqlQuery = 'SELECT r.roleName FROM AdminRole r JOIN AdminRoleAssign a ON r.roleId = a.roleId WHERE a.userId = ?';

    db.query(sqlQuery, [userId], (err, result) => {
        if (err) {
            return res.json({ error: err });
        } else {
            return res.json(result);
        }
    });
}


module.exports = { addAdminRole, getAdminRole, updateAdminRole, deleteAdminRole, getAdminRoleNameByRoleID, getUserRoles,  }