import { basename, extname, join, resolve } from "path";
import { existsSync, readFileSync } from "fs";
import { Logger } from "@tosee/log";
import { FSWatcher, watch } from 'chokidar';

export class Config {
    static path: string = process.env.CONFIG || "./src/config";
    private static _instance;
    private static logger = new Logger("@tosee/config");
    private static target_files: string[] = [];
    private static _watcher: FSWatcher;

    private static loadconfig(path: string) {
        try {
            delete require.cache[path];
            return require(path);
        } catch (e) {
            Config.logger.error(`Config file load error: ${basename(path)}`, e);
            throw e;
        }
    }

    public static set watch(flag: boolean) {
        if (flag === true) {
            if (!Config._watcher) {
                Config._watcher = watch(Config.path, {
                    persistent: false
                });
                Config._watcher.on('all', (path) => {
                    if (Config._watcher) {
                        Config.reload();
                    }
                });
            }
        } else {
            if (Config._watcher) {
                Config._watcher.close();
                Config._watcher = undefined;
            }
        }
    }

    public static reload() {
        if (Config.path === undefined) {
            throw new Error("Config path is not init, set path first");
        }
        try {
            const default_path = existsSync(resolve(Config.path, `./default.ts`)) ? resolve(Config.path, `./default.ts`) : resolve(Config.path, `./default.js`);
            const config_path = existsSync(resolve(Config.path, `./${process.env.NODE_ENV}.ts`)) ? resolve(Config.path, `./${process.env.NODE_ENV}.ts`) : resolve(Config.path, `./${process.env.NODE_ENV}.js`);
            let instance = {};
            if (existsSync(config_path)) {
                if (existsSync(default_path)) {
                    instance = Config.loadconfig(default_path).default;
                }
                instance = Object.assign({}, instance, Config.loadconfig(config_path).default);
                Config.logger.success(`Config file load: ${basename(config_path)}`);
            } else if (existsSync(default_path) && !existsSync(config_path)) {
                instance = Config.loadconfig(default_path).default;
                Config.logger.success(`Config file load: ${basename(default_path)}`);
            } else {

            }
            Config._instance = instance;
        } catch (e) {
            Config.logger.error(`Config file load error: ${Config.path}`, e);
        }
    }

    static get instance() {
        if (Config._instance == undefined) {
            Config.reload();
        }
        return Config._instance;
    }
}

