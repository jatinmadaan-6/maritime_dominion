const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const issueToken = (user) => jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

async function signup({ name, email, password }) {
  if (!name || !email || !password) throw Object.assign(new Error("All fields are required"), { status: 400 });
  if (password.length < 8) throw Object.assign(new Error("Password must be at least 8 characters"), { status: 400 });
  try {
    const normalizedEmail = email.toLowerCase();
    const role = process.env.BOOTSTRAP_ADMIN_EMAIL?.toLowerCase() === normalizedEmail ? "admin" : "officer";
    const [result] = await db.execute("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [name, normalizedEmail, await bcrypt.hash(password, 12), role]);
    const user = { id: result.insertId, name, email: normalizedEmail, role };
    return { ...user, token: issueToken(user) };
  } catch (err) { if (err.code === "ER_DUP_ENTRY") throw Object.assign(new Error("Email already registered"), { status: 409 }); throw err; }
}
async function login({ email, password }) {
  if (!email || !password) throw Object.assign(new Error("Email and password are required"), { status: 400 });
  const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email.toLowerCase()]);
  if (!users[0] || !(await bcrypt.compare(password, users[0].password))) throw Object.assign(new Error("Invalid email or password"), { status: 401 });
  const { id, name, role } = users[0]; const user = { id, name, email: email.toLowerCase(), role };
  return { ...user, token: issueToken(user) };
}
async function listUsers() {
  const [users] = await db.query("SELECT id, name, email, role, created_at FROM users ORDER BY name");
  return users;
}

async function updateRole(id, role, actorId) {
  const allowedRoles = ["admin", "officer", "viewer"];
  if (!allowedRoles.includes(role)) throw Object.assign(new Error("Role must be admin, officer, or viewer"), { status: 400 });
  if (Number(id) === Number(actorId) && role !== "admin") throw Object.assign(new Error("You cannot remove your own administrator access"), { status: 400 });
  const [result] = await db.execute("UPDATE users SET role = ? WHERE id = ?", [role, id]);
  if (!result.affectedRows) throw Object.assign(new Error("User not found"), { status: 404 });
  const [[user]] = await db.execute("SELECT id, name, email, role, created_at FROM users WHERE id = ?", [id]);
  return { ...user, message: "Access level updated. The user will receive the new permissions when they next sign in." };
}

async function ensureBootstrapAdmin() {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
  if (!email) return;
  const [result] = await db.execute("UPDATE users SET role = 'admin' WHERE email = ?", [email]);
  if (result.affectedRows) console.log(`Bootstrap administrator enabled for ${email}`);
  else console.warn(`BOOTSTRAP_ADMIN_EMAIL does not match a registered user: ${email}`);
}

module.exports = { signup, login, listUsers, updateRole, ensureBootstrapAdmin };
