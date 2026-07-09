
const fs = require("fs");
const path = require("path");

const regex_tpl = /<li class="post-item">[\s\S]*?<\/li>/
const regexp_date = /<(\w+)[^>]*\bid="date"[^>]*>([\s\S]*?)<\/\1>/
const regexp_title = /<(\w+)[^>]*\bid="title"[^>]*>([\s\S]*?)<\/\1>/
const regexp_description = /<(\w+)[^>]*\bid="description"[^>]*>([\s\S]*?)<\/\1>/

console.log("Building Blog Content...");
console.log(`   Current build file location: ${__dirname}`);
const dir = path.join(__dirname, "posts");

function make_li(tpl, dir, name) {
    const _paper = fs.readFileSync(path.join(dir, name), "utf8");
    const _d = regexp_date.exec(_paper)[2];
    const _t = regexp_title.exec(_paper)[2];
    const _desc = regexp_description.exec(_paper)[2];
    tpl = tpl.replaceAll("{{date}}", _d);
    tpl = tpl.replaceAll("{{url}}", name);
    tpl = tpl.replaceAll("{{title}}", _t);
    tpl = tpl.replaceAll("{{description}}", _desc);
    return tpl;
}

const html = fs.readFileSync(path.join(__dirname, "_index_"), "utf8");
const tpl = html.match(regex_tpl);
// console.log(tpl);
const entries = fs.readdirSync(dir, { withFileTypes: true });

let _content = '';
for (const entry of entries) {
    if (entry.isFile()) {
        // console.log(dir + entry.name);
        _content += make_li(String(tpl), dir, entry.name)
    }
    // console.log(_content)
}

const result = html.replace(tpl, _content);
// console.log(result);

fs.writeFileSync(path.join(__dirname, "index.html"), result);
console.log("Done!");