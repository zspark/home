
const fs = require("fs");
const path = require("path");

const regex_tpl = /<li class="post-item">[\s\S]*?<\/li>/
const regexp_date = /<(\w+)[^>]*\bid="date"[^>]*>([\s\S]*?)<\/\1>/
const regexp_title = /<(\w+)[^>]*\bid="title"[^>]*>([\s\S]*?)<\/\1>/
const regexp_description = /<(\w+)[^>]*\bid="description"[^>]*>([\s\S]*?)<\/\1>/

console.log("Building Blog Content...");
console.log(`   Current build file location: ${__dirname}`);
const dir = path.join(__dirname, "posts");

function make_li(tpl, proxy) {
    const _paper = fs.readFileSync(proxy.url, "utf8");
    const _d = regexp_date.exec(_paper)[2];
    const _t = regexp_title.exec(_paper)[2];
    const _desc = regexp_description.exec(_paper)[2];
    tpl = tpl.replaceAll("{{date}}", _d);
    tpl = tpl.replaceAll("{{url}}", proxy.name);
    tpl = tpl.replaceAll("{{title}}", _t);
    tpl = tpl.replaceAll("{{description}}", _desc);
    return tpl;
}


function gatherValidFiles(parentFolder) {
    const files = [];
    const entries = fs.readdirSync(parentFolder, { withFileTypes: true });
    for (const entry of entries) {
        if (!entry.isFile()) continue;

        const fileURL = path.join(parentFolder, entry.name);
        const stats = fs.statSync(fileURL);

        files.push({
            name: entry.name,
            url: fileURL,
            created: stats.birthtime,
            createdMs: stats.birthtimeMs,
            modified: stats.mtime,
            stats,
        });
    }

    // Sort by creation date (oldest first)
    files.sort((a, b) => b.createdMs - a.createdMs);

    return files;
}

const html = fs.readFileSync(path.join(__dirname, "_index_"), "utf8");
const tpl = html.match(regex_tpl);
// console.log(tpl);
const validFiles = gatherValidFiles(dir)
let _content = '';
for (const proxy of validFiles) {
    _content += make_li(String(tpl), proxy)
}

const result = html.replace(tpl, _content);
// console.log(result);

fs.writeFileSync(path.join(__dirname, "index.html"), result);
console.log("Done!");