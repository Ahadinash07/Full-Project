const express = require('express');
const { addAdminRole, getAdminRole, updateAdminRole, deleteAdminRole, getAdminRoleNameByRoleID, getUserRoles,  } = require('../../Controllers/AdminRoleController/AdminRoleController');
const { addAdminRoleValidation, updateAdminRoleValidation } = require('../../Controllers/AdminRoleController/AdminRoleValidaton');

const AdminRoleRoute = express.Router();

AdminRoleRoute.post('/add_admin_role', addAdminRoleValidation, addAdminRole);

AdminRoleRoute.get('/get_admin_role', getAdminRole);

AdminRoleRoute.get('/get_admin_role/:roleId', getAdminRoleNameByRoleID);

AdminRoleRoute.put('/update_admin_role', updateAdminRoleValidation, updateAdminRole);

AdminRoleRoute.delete('/delete_admin_role/:roleId', deleteAdminRole);

AdminRoleRoute.get('/get_user_roles/:userId', getUserRoles);

module.exports = AdminRoleRoute;