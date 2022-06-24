// gpr-hack.js
import { writeFileSync, readFileSync } from "fs";

const file = readFileSync("./package.json", {
  encoding: "utf-8",
});

const json = JSON.parse(file);

json.name = "@relewise/uniform-canvas";

writeFileSync("./package.json", JSON.stringify(json, undefined, 2));