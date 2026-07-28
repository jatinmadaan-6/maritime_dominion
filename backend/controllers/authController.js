const auth = require("../services/authService");
exports.signup = async (req, res, next) => { try { res.status(201).json(await auth.signup(req.body)); } catch (err) { next(err); } };
exports.login = async (req, res, next) => { try { res.json(await auth.login(req.body)); } catch (err) { next(err); } };
exports.listUsers = async (req, res, next) => { try { res.json(await auth.listUsers()); } catch (err) { next(err); } };
exports.updateRole = async (req, res, next) => { try { res.json(await auth.updateRole(req.params.id, req.body.role, req.user.id)); } catch (err) { next(err); } };
