const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const issueToken = (user) => jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

async function signup({ name, email, password }) {
  if (!name || !email || !password) throw Object.assign(new Error("All fields are required"), { status: 400 });
  if (password.length < 8) throw Object.assign(new Error("Password must be at least 8 characters"), { status: 400 });
  try {
    const [result] = await db.execute("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'officer')", [name, email.toLowerCase(), await bcrypt.hash(password, 12)]);
    const user = { id: result.insertId, name, email: email.toLowerCase(), role: "officer" };
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
module.exports = { signup, login };
