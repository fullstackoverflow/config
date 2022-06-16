import { basename, extname, resolve } from "path";
import { existsSync } from "fs";
import { Logger } from "@tosee/log";

export class Config {
    static path: string = process.env.CONFIG || "./src/config";
    private static _instance;
    private static logger = new Logger("@tosee/config");
    static get instance() {
        if (this.path === undefined) {
            throw new Error("Config path is not init, set path first");
        }
        const default_path = existsSync(resolve(Config.path, `./default.ts`)) ? resolve(Config.path, `./default.ts`) : resolve(Config.path, `./default.js`);
        const config_path = existsSync(resolve(Config.path, `./${process.env.NODE_ENV}.ts`)) ? resolve(Config.path, `./${process.env.NODE_ENV}.ts`) : resolve(Config.path, `./${process.env.NODE_ENV}.js`);;
        if (Config._instance == undefined) {
            let instance = {};
            if (existsSync(config_path)) {
                if (existsSync(default_path)) {
                    instance = require(default_path).default;
                }
                instance = Object.assign({}, instance, require(config_path).default);
                Config.logger.success(`Config file load: ${basename(config_path)}`);
            } else if (existsSync(default_path) && !existsSync(config_path)) {
                instance = require(default_path).default;
                Config.logger.success(`Config file load: ${basename(default_path)}`);
            } else {

            }
            Config._instance = instance;
        }
        return Config._instance;
    }
}

