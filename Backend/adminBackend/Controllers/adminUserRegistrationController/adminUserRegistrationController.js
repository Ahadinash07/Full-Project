const db = require("../../Models/db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('dotenv');

env.config();


// ===========================Admin==========================User=============================Registration==============================


const adminUserRegistration = (req, res) => {
    const { userId, userName, email, password } = req.body;

    const sqlQuery = 'SELECT CheckAdminUserExists(?)';                                      // STORED FUNCTION
    const sqlQuery1 = 'SELECT RegisterAdminUser(?, ?, ?, ?)';                               // STORED FUNCTION

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.json({ message: "Error hashing password" });
        }

        db.query(sqlQuery, [email], (err, result) => {
            if (err) {
                return res.json({ error: err });
            }

            if (result[0]['CheckAdminUserExists'] > 0) {
                return res.json({ message: `User already exists` });
            }

            db.query(sqlQuery1, [userId, userName, email, hashedPassword], (err, result) => {
                // console.log(result);
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.json({ message: `User already exists with this ${email}` });
                    }
                    return res.json({ error: err });
                }

                return res.json({ message: "User registered successfully" });
            });
        });
    });
};


// ===========================Admin==========================User=============================Login==============================


const adminUserLogin = (req, res) => {
    const { email, password } = req.body;

    const sqlQuery = 'CALL LoginAdminUser(?)';                                                  // STORED PROCEDURE

    db.query(sqlQuery, [email], async (err, result) => {
    

        if (err || !result[0][0].user) return res.json({ error: "Invalid credentials" });

        const user = result[0][0].user;

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
};



// ===========================Admin==========================User=============================Logout==============================

const adminUserLogout = (req, res) => {
    const {userId} = req.body;
    

    const sqlQuery = 'SELECT LogoutAdminUserStatus(?)';                                         // STORED FUNCTION

    db.query(sqlQuery, [userId], (err, result) => {
        if (err) {
            return res.json({ error: err.message || 'Internal Error' });
        }
        return res.json("Logout Successfully");
    });
};


// ===========================Admin==========================User=============================Update==============================


const adminUserUpdate = (req, res) => {
  const { userId, userName, email, password } = req.body;

  const sqlQuery= 'UPDATE AdminUserRegistration SET userName = ?, email = ?, password = ? WHERE userId = ?';

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if(err){
        return res.json({message: "Error hashing password"});
    }

        db.query(sqlQuery, [userName, email, hashedPassword, userId], (err, result) => {
            if(err){
                return res.json({error: err});
            }
            else{
                return res.json({message: "User updated successfully"});
            }
        });
  });
}


  
// ===========================Admin==========================User=============================Update==============================Password==============

  
const updateUserPassword = (req, res) => {
    const {email, password} = req.body;

    const sqlQuery = 'SELECT UpdateAdminUserPasswordByEmail(?, ?)';                                 // STORED FUNCTION

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if(err){
            return res.json({message: "Error hashing password"});
        }

        db.query(sqlQuery, [email, hashedPassword], (err, result) => {
            if(err){
                return res.json({error: err});
            }
            else{
                return res.json({message: "Password Updated Successfully"});
            }
        });
    });
};


// ===========================Admin==========================User=============================Update==============================Status==============

const updateUserAdminStatus = (req, res) => {
    const { userId, status } = req.body;

    const sqlQuery = 'UPDATE AdminUserRegistration SET status = ? WHERE userId = ?';

    if (!userId || !status) {
      return res.json({ error: "Missing userId or status" });
    }

    db.query(sqlQuery, [status, userId], (err, result) => {
      if (err) {
        return res.json({ error: "Failed to update status" });
      }

      if (result.affectedRows > 0) {
        res.json({ message: 'User status updated successfully' });
      } else {
        res.json({ error: 'User not found' });
      }
    });
  }


// ===========================Admin==========================User=============================Get==============================

const getAdminUser = (req, res) => {

    const sqlQuery = 'CALL GetAdminUserRegistration()';                                     // STORED PROCEDURE
    
    db.query(sqlQuery, (err, result) => {
        if(err){
            return res.json({error: err});
        }
        else{
            return res.json(result);
        }
    });
};


// ===========================Admin==========================User=============================Get==============================ById=============

const getAdminUserById = (req, res) => {

    const sqlQuery = 'SELECT GetAdminUserById(?)';                                           // STORED FUNCTION

    db.query(sqlQuery, [req.params.userId], (err, result) => {
        if(err){
            return res.json({error: err});
        }
        else{
            return res.json(result);
        }
    });
};


// ===========================Admin==========================User=============================Delete==============================ById=============

const deleteAdminUser = (req, res) => {

    const sqlQuery = 'SELECT DeleteAdminUser(?)';                                           // STORED FUNCTION

    db.query(sqlQuery,[req.params.userId], (err, result) => {
        if(err){
            return res.json({error: err});
        }
        else{
            return res.json(result)
        }
    });
};


// ===========================Admin==========================User=============================Delete==============================ById=============

module.exports = { adminUserRegistration, adminUserLogin, adminUserUpdate, updateUserPassword, getAdminUser, deleteAdminUser, getAdminUserById, adminUserLogout, updateUserAdminStatus }