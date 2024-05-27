var readline = require("readline");
var fs = require("fs");
var spawn = require("child_process").spawn;
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
rl.question("Какой index.js вы хотите запустить (image или video)? ", function (answer) {
    if (answer === "image" || answer === "video") {
        var indexFile = "index-".concat(answer, ".js");
        if (fs.existsSync(indexFile)) {
            var childProcess = spawn("node", [indexFile]);
            childProcess.stdout.pipe(process.stdout);
            childProcess.stderr.pipe(process.stderr);
        }
        else {
            console.error("\u0424\u0430\u0439\u043B ".concat(indexFile, " \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D."));
        }
    }
    else {
        console.error("Пожалуйста, введите image или video.");
    }
    rl.close();
});
