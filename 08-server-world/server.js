const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, "public");
const WORLD_PATH = path.join(__dirname, "world.json");

function ct(p) {
    const e = path.extname(p);
    if (e === ".html")
        return "text/html; charset=utf-8";

    if (e === ".js")
        return "application/javascript; charset=utf-8";

    if (e === ".css")
        return "text/css; charset=utf-8";

    if (e === ".json")
        return "application/json; charset=utf-8";
    return "application/octet-stream";
}

function sendJSON(res, obj) {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(obj));
}

function parseJSON(req) {
    return new Promise(resolve => {
        let raw = "";
        req.on("data", c => (raw += c));
        req.on("end", () => resolve(raw ? JSON.parse(raw) : {}));
    });
}

const server = http.createServer(async (req, res) => {
    const { pathname } = url.parse(req.url);

    if (req.method === "GET" && pathname === "/world") {
        const world = JSON.parse(fs.readFileSync(WORLD_PATH, "utf-8"));
        return sendJSON(res, world);
    }

    if (req.method === "POST" && pathname === "/find") {
        const body = await parseJSON(req);
        const find = (body.find || "").trim().toLowerCase();
        const world = JSON.parse(fs.readFileSync(WORLD_PATH, "utf-8"));
        const results = [];

        if (find) {
            (world.regions || []).forEach((r, ri) => {
                (r.towns || []).forEach((t, ti) => {
                    (t.notable_people || []).forEach((p, pi) => {

                        if ((p.name || "").trim().toLowerCase() === find) {
                            results.push({ ri, ti, pi, town: t.name, region: r.name, path: `${t.name} -> ${r.name}` });
                        }
                    });
                });
            });
        }
        return sendJSON(res, { results });
    }

    if (req.method === "POST" && pathname === "/replace") {
        const body = await parseJSON(req);
        const find = (body.find || "").trim().toLowerCase();
        const replace = (body.replace || "").trim();

        let changed = null;

        if (find && replace) {
            const world = JSON.parse(fs.readFileSync(WORLD_PATH, "utf-8"));
            outer:
            for (let ri = 0; ri < (world.regions || []).length; ri++) {
                const r = world.regions[ri];
                for (let ti = 0; ti < (r.towns || []).length; ti++) {
                    const t = r.towns[ti];
                    for (let pi = 0; pi < (t.notable_people || []).length; pi++) {
                        const p = t.notable_people[pi];

                        if ((p.name || "").trim().toLowerCase() === find) {
                            p.name = replace;
                            fs.writeFileSync(WORLD_PATH, JSON.stringify(world, null, 2));
                            changed = { ri, ti, pi, town: t.name, region: r.name };
                            break outer;
                        }
                    }
                }
            }
        }
        return sendJSON(res, { ok: true, changed });
    }

    const filePath = pathname === "/" ? path.join(PUBLIC_DIR, "index.html") : path.join(PUBLIC_DIR, pathname);
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { "Content-Type": ct(filePath) });

    res.end(data);
});

server.listen(PORT, () => console.log(`http://localhost:${PORT}`));
