import { Test, Expect, TestFixture, SetupFixture, Focus, Timeout, TeardownFixture } from "alsatian";
import { Config, Value } from "../lib";
import { writeFileSync } from "fs";
import { resolve } from "path";

@TestFixture('Config')
export class TestSuit {
    @SetupFixture
    public setup() {
        writeFileSync(resolve(__dirname, 'config/test.ts'), `export default {
    test1: true,
    test2: 1 + 2
};`);
    }

    @TeardownFixture
    public teardown() {
        writeFileSync(resolve(__dirname, 'config/test.ts'), `export default {
    test1: true,
    test2: 1 + 2
};`);
    }

    @Test("value should equal")
    public async equal() {
        Expect(Config.instance.test1).toEqual(true);
    }

    @Test("static value should equal")
    public async staticValue() {
        Expect(TestSuit.test2).toEqual(Config.instance.test1);
    }

    @Test("value should support expression")
    public async Expression() {
        Expect(Config.instance.test2).toEqual(3);
    }

    @Test("if default.ts exist,value should merge default")
    public async MergeDefault() {
        Expect(Config.instance.test3).toEqual(3);
    }

    @Value("test1")
    test1: Boolean;

    @Value("test1")
    static test2: Boolean;

    @Test("value should support inject with @Value")
    public async decorator1() {
        Expect(this.test1).toEqual(true);
    }

    @Focus
    @Timeout(20000)
    @Test("watcher should work")
    public async decorator2() {
        Config.watch = true;
        Expect(Config.instance.test4).toEqual(undefined);
        writeFileSync(resolve(__dirname, 'config/test.ts'), `export default {
    test1: true,
    test2: 1 + 2,
    test4: 4
};`);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        Expect(Config.instance.test4).toEqual(4);
        writeFileSync(resolve(__dirname, 'config/test.ts'), `export default {
            test1: true,
            test2: 1 + 2,
            test4:
        };`);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        Expect(Config.instance.test4).toEqual(4);
        Config.watch = false;
        writeFileSync(resolve(__dirname, 'config/test.ts'), `export default {
            test1: true,
            test2: 1 + 2,
            test4: 100
        };`);
        Expect(Config.instance.test4).toEqual(4);
    }
}