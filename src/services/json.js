import fs from "fs"

const jsonPath = 'src/data.json'

export function getJSON() {
  return JSON.parse(fs.readFileSync(jsonPath, "utf8"));
}

export function setJSON(dados) {
  fs.writeFileSync(jsonPath, JSON.stringify(dados, null, 2));
}