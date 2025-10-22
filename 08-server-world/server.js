import express from "express";
app.use(express.json());


const WORLD_PATH = path.join(__dirname, "world.json");


function readWorld() {
    const text = fs.readFileSync(WORLD_PATH, "utf-8");
    return JSON.parse(text);
}


function writeWorld(worldObj) {
    fs.writeFileSync(WORLD_PATH, JSON.stringify(worldObj, null, 2));
}


// GET /world — return the whole world.json
app.get("/world", (req, res) => {
    try {
        const world = readWorld();
        res.json(world);
    } catch (err) {
        res.status(500).json({ error: "Failed to read world.json", detail: String(err) });
    }
});


// POST /update — rename a notable person by indices
// Body: { regionIndex, townIndex, personIndex, newName }
app.post("/update", (req, res) => {
    try {
        const { regionIndex, townIndex, personIndex, newName } = req.body || {};


        if ([regionIndex, townIndex, personIndex].some(v => typeof v !== "number")) {
            return res.status(400).json({ error: "Indices must be numbers" });
        }
        if (typeof newName !== "string" || newName.trim() === "") {
            return res.status(400).json({ error: "newName must be a non-empty string" });
        }


        const world = readWorld();
        const r = world.regions?.[regionIndex];
        const t = r?.towns?.[townIndex];
        const p = t?.notable_people?.[personIndex];


        if (!p) {
            return res.status(404).json({ error: "Person not found with given indices" });
        }


        p.name = newName.trim();
        writeWorld(world);


        res.json({ ok: true, world });
    } catch (err) {
        res.status(500).json({ error: "Update failed", detail: String(err) });
    }
});