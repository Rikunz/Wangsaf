const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

function syncWriteFile(filename, data) {
    writeFileSync(join(__dirname, filename), JSON.stringify(data, null, 4), {
        flag: 'w',
    });
}
function readDataJSON(json) {
    return JSON.parse(readFileSync(join(__dirname, json), 'utf-8'));
}

function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
};

module.exports = {
    syncWriteFile,
    readDataJSON,
    wait
}