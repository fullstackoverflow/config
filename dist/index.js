"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const chokidar_1 = require("chokidar");
const fs_1 = require("fs");
const chalk_1 = __importDefault(require("chalk"));
const moment_1 = __importDefault(require("moment"));
class Logger {
    info(...args) {
        console.log(chalk_1.default.yellow(`[${moment_1.default().format('YYYY-MM-DD')}] [${moment_1.default().format('HH:mm:ss')}] `), ...args);
    }
    success(...args) {
        console.log(chalk_1.default.green(`[${moment_1.default().format('YYYY-MM-DD')}] [${moment_1.default().format('HH:mm:ss')}] `), ...args);
    }
    error(...args) {
        console.log(chalk_1.default.red(`[${moment_1.default().format('YYYY-MM-DD')}] [${moment_1.default().format('HH:mm:ss')}] `), ...args);
    }
}
const logger = new Logger();
class Config {
    static get instance() {
        if (this.path === undefined) {
            throw new Error("Config path is not init, set path first");
        }
        let env = ".ts";
        if (fs_1.existsSync(path_1.resolve(this.path, `./${process.env.NODE_ENV}.js`)) || fs_1.existsSync(path_1.resolve(this.path, "./default.js"))) {
            env = ".js";
        }
        const config_path = path_1.resolve(this.path, `./${process.env.NODE_ENV}${env}`);
        const default_path = path_1.resolve(this.path, `./default${env}`);
        if (this._instance == undefined) {
            if (fs_1.existsSync(default_path) && fs_1.existsSync(config_path)) {
                this._instance = Object.assign({}, require(default_path).default, require(config_path).default);
                logger.success(`Config file load: ${process.env.NODE_ENV}${env}(merged default${env})`);
            }
            else if (fs_1.existsSync(config_path)) {
                this._instance = require(config_path).default;
                logger.success(`Config file load: ${process.env.NODE_ENV}${env}`);
            }
            else {
                throw new Error(`Config file ${config_path} load failed, file not exist`);
            }
            chokidar_1.watch(this.path, {
                ignored: /(^|[\/\\])\../,
                persistent: true
            }).on("change", () => {
                delete require.cache[config_path];
                if (fs_1.existsSync(default_path)) {
                    delete require.cache[default_path];
                    this._instance = Object.assign({}, require(default_path).default, require(config_path).default);
                    logger.success(`Config file load: ${process.env.NODE_ENV}${env}(merged default${env})`);
                }
                else {
                    this._instance = require(config_path).default;
                    logger.success("Config file reload:", `${process.env.NODE_ENV}${env}`);
                }
            });
        }
        return this._instance;
    }
}
exports.Config = Config;
//# sourceMappingURL=index.js.map