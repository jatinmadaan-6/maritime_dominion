const db = require("../config/db");
const bad = (message) => Object.assign(new Error(message), { status: 400 });

async function listVessels() { const [rows] = await db.query("SELECT * FROM vessels ORDER BY name"); return rows; }
async function createVessel({ name, imo_number, flag_state, type }) {
  if (!name || !imo_number) throw bad("Name and IMO number are required");
  try {
    await db.query("CALL register_vessel_advanced(?, ?, ?, ?)", [name, imo_number, flag_state || null, type || null]);
    const [rows] = await db.execute("SELECT id FROM vessels WHERE imo_number = ?", [imo_number]);
    return { id: rows[0].id, message: "Vessel added" };
  } catch (err) { if (err.code === "ER_DUP_ENTRY") throw Object.assign(new Error("IMO number already exists"), { status: 409 }); throw err; }
}
async function passport(id) {
  const [[vessels], [captains], [logs]] = await Promise.all([
    db.execute("SELECT * FROM vessels WHERE id = ?", [id]),
    db.execute("SELECT c.*, ca.start_date, ca.end_date FROM captain_assignments ca JOIN captains c ON c.id = ca.captain_id WHERE ca.vessel_id = ? ORDER BY ca.start_date DESC", [id]),
    db.execute("SELECT * FROM logs WHERE vessel_id = ? ORDER BY timestamp DESC LIMIT 10", [id]),
  ]);
  if (!vessels[0]) throw Object.assign(new Error("Vessel not found"), { status: 404 });
  return { vessel: vessels[0], captains, logs };
}
async function listLogs() { const [rows] = await db.query("SELECT logs.*, vessels.name AS vessel_name FROM logs LEFT JOIN vessels ON vessels.id = logs.vessel_id ORDER BY logs.timestamp DESC"); return rows; }
async function addLog({ vessel_id, sulfur_level, waste_amount, port_id, voyage_id }) {
  if (!vessel_id || sulfur_level == null || waste_amount == null) throw bad("vessel_id, sulfur_level, and waste_amount are required");
  const [result] = await db.execute("INSERT INTO logs (vessel_id, sulfur_level, waste_amount, port_id, voyage_id) VALUES (?, ?, ?, ?, ?)", [vessel_id, sulfur_level, waste_amount, port_id || null, voyage_id || null]);
  return { id: result.insertId, message: "Log added" };
}
async function listCaptains() { const [rows] = await db.query("SELECT * FROM captains ORDER BY name"); return rows; }
async function addCaptain({ name, license_number, nationality }) { if (!name) throw bad("Name is required"); const [result] = await db.execute("INSERT INTO captains (name, license_number, nationality) VALUES (?, ?, ?)", [name, license_number || null, nationality || null]); return { id: result.insertId, message: "Captain added" }; }
async function assignCaptain({ captain_id, vessel_id, start_date }) {
  if (!captain_id || !vessel_id || !start_date) throw bad("captain_id, vessel_id, and start_date are required");
  const connection = await db.getConnection();
  try { await connection.beginTransaction(); await connection.execute("UPDATE captain_assignments SET end_date = ? WHERE vessel_id = ? AND end_date IS NULL", [start_date, vessel_id]); const [result] = await connection.execute("INSERT INTO captain_assignments (captain_id, vessel_id, start_date) VALUES (?, ?, ?)", [captain_id, vessel_id, start_date]); await connection.commit(); return { id: result.insertId, message: "Captain assigned" }; }
  catch (err) { await connection.rollback(); throw err; } finally { connection.release(); }
}
module.exports = { listVessels, createVessel, passport, listLogs, addLog, listCaptains, addCaptain, assignCaptain };
