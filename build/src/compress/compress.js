"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var child_process_1 = require("child_process");
var spawn = require("child_process").spawn;
var readline = require("readline");
var CompressImage = /** @class */ (function () {
    function CompressImage(input, output, commands) {
        this.input = input;
        this.output = output;
        this.commands = commands;
        this.calculateTotalSize = this.calculateTotalSize.bind(this);
        this.compressFile = this.compressFile.bind(this);
        this.fileHandler = this.fileHandler.bind(this);
        this.getFiles = this.getFiles.bind(this);
        this.clearDir = this.clearDir.bind(this);
        this.compressAllFiles = this.compressAllFiles.bind(this);
        this.defineInputFileExtension = this.defineInputFileExtension.bind(this);
        this.ffmpegExec = this.ffmpegExec.bind(this);
    }
    CompressImage.prototype.getFiles = function (callback) {
        var _this = this;
        fs.readdir(this.input, function (err, files) {
            if (err) {
                return callback(err);
            }
            var _files = files.filter(function (file) {
                return _this.defineSupportedFileExtensions().includes(path.extname(file).toLowerCase());
            });
            console.log("support:", _this.defineSupportedFileExtensions());
            console.log("\u041D\u0430\u0439\u0434\u0435\u043D\u043E \u0444\u0430\u0439\u043B\u043E\u0432: ".concat(_files.length));
            callback(null, _files);
        });
    };
    CompressImage.prototype.calculateTotalSize = function (_a, callback_1) {
        return __awaiter(this, arguments, void 0, function (_b, callback) {
            function getFileSize(file) {
                return new Promise(function (resolve) {
                    fs.stat(file, function (err, stats) {
                        if (err) {
                            return callback({}, err);
                        }
                        resolve(stats.size);
                    });
                });
            }
            var inputFileSize, outputFileSize, error_1;
            var inputFile = _b.inputFile, outputFile = _b.outputFile;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getFileSize(inputFile)];
                    case 1:
                        inputFileSize = _c.sent();
                        return [4 /*yield*/, getFileSize(outputFile)];
                    case 2:
                        outputFileSize = _c.sent();
                        callback({
                            inputSize: inputFileSize,
                            outputSize: outputFileSize,
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _c.sent();
                        console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0432\u044B\u0447\u0438\u0441\u043B\u0435\u043D\u0438\u0438 \u0440\u0430\u0437\u043C\u0435\u0440\u0430 \u0444\u0430\u0439\u043B\u0430: ".concat(error_1.message));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CompressImage.prototype.ffmpegExec = function (inputPath, outputPath, callback) {
        var fileExtension = this.defineInputFileExtension(inputPath);
        var command = this.commands(inputPath, outputPath)[fileExtension];
        var ffmpeg = spawn("ffmpeg", command);
        // Интерфейс для построчного чтения stderr
        var rl = readline.createInterface({
            input: ffmpeg.stderr,
            output: process.stdout,
            terminal: false,
        });
        // Регулярное выражение для поиска времени из вывода ffmpeg
        var timePattern = /time=(\d{2}):(\d{2}):(\d{2})\.(\d{2})/;
        rl.on("line", function (line) {
            // Найти время в строке
            var match = timePattern.exec(line);
            if (match) {
                var hours = parseInt(match[1], 10);
                var minutes = parseInt(match[2], 10);
                var seconds = parseInt(match[3], 10);
                var totalSeconds = hours * 3600 + minutes * 60 + seconds;
                console.log("Progress: ".concat(totalSeconds, " seconds"));
                callback(null);
            }
        });
        ffmpeg.on("close", function (code) {
            console.log("ffmpeg process exited with code ".concat(code));
        });
    };
    CompressImage.prototype.compressFile = function (inputPath, outputPath, callback) {
        // const command = `ffmpeg -i "${inputPath}" -compression_level 100 "${outputPath}"`;
        // const downScale = `ffmpeg -i "${inputPath}" -vf "scale=iw/4:ih/4,format=rgba"  "${outputPath}"`;
        var fileExtension = this.defineInputFileExtension(inputPath);
        var command = this.commands(inputPath, outputPath)[fileExtension];
        (0, child_process_1.exec)(command, function (error, stdout, stderr) {
            var props = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                props[_i - 3] = arguments[_i];
            }
            if (error) {
                console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0441\u0436\u0430\u0442\u0438\u0438 \u0444\u0430\u0439\u043B\u0430: ".concat(error.message));
                return callback(error);
            }
            if (stderr) {
                console.error("FFmpeg stderr: ".concat(stderr));
            }
            callback(null);
        });
    };
    CompressImage.prototype.fileHandler = function (err, files) {
        var _this = this;
        var filesQuantity = 0;
        var totalSizeAfterCompress = 0;
        var totalSizeBeforeCompress = 0;
        if (err) {
            return console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0447\u0442\u0435\u043D\u0438\u0438 \u0434\u0438\u0440\u0435\u043A\u0442\u043E\u0440\u0438\u0438: ".concat(err.message));
        }
        if (files.length === 0) {
            return console.log("Нет файлов для сжатия.");
        }
        files.forEach(function (file) { return __awaiter(_this, void 0, void 0, function () {
            var inputPath, outputPath;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inputPath = path.join(this.input, file);
                        outputPath = path.join(this.output, "".concat(file));
                        return [4 /*yield*/, new Promise(function (resolve) {
                                return _this.ffmpegExec(inputPath, outputPath, function (err) {
                                    _this.calculateTotalSize({ inputFile: inputPath, outputFile: outputPath }, function (_a) {
                                        var inputSize = _a.inputSize, outputSize = _a.outputSize;
                                        totalSizeBeforeCompress += inputSize;
                                        totalSizeAfterCompress += outputSize;
                                        filesQuantity++;
                                        if (files.length === filesQuantity) {
                                            return resolve({ message: "done" });
                                        }
                                    });
                                    if (err) {
                                        console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0441\u0436\u0430\u0442\u0438\u0438 \u0444\u0430\u0439\u043B\u0430 ".concat(file, ": ").concat(err.message));
                                    }
                                });
                            })];
                    case 1:
                        _a.sent();
                        console.log("Total size before compress ".concat(Math.round(totalSizeBeforeCompress / 1024), "\u043A\u0431,"));
                        console.log("Total size after compress ".concat(Math.round(totalSizeAfterCompress / 1024), "\u043A\u0431"));
                        console.log("Total files ".concat(filesQuantity));
                        return [2 /*return*/];
                }
            });
        }); });
    };
    CompressImage.prototype.clearDir = function () {
        var _this = this;
        fs.readdir(this.output, function (err, files) {
            if (err) {
                return console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043E\u0447\u0438\u0441\u0442\u043A\u0435 \u0434\u0438\u0440\u0435\u043A\u0442\u043E\u0440\u0438\u0438: ".concat(err.message));
            }
            for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                var file = files_1[_i];
                fs.unlink(path.join(_this.output, file), function (err) {
                    if (err)
                        throw err;
                });
            }
        });
    };
    CompressImage.prototype.compressAllFiles = function () {
        this.clearDir();
        this.getFiles(this.fileHandler);
    };
    CompressImage.prototype.defineInputFileExtension = function (file) {
        return path.extname(file).toLowerCase();
    };
    CompressImage.prototype.defineSupportedFileExtensions = function () {
        return Object.keys(this.commands(this.input, this.output));
    };
    CompressImage.prototype.start = function () {
        this.compressAllFiles();
    };
    return CompressImage;
}());
exports.default = CompressImage;
