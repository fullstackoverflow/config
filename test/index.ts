import { Test, Expect, TestFixture, SetupFixture } from "alsatian";
import { Config, Value, Autowired } from "../lib";

class InjectClass {
    test() {
        return true;
    }
}

@TestFixture('Config')
export class TestSuit {
    @Test("value should equal")
    public async equal() {
        Expect(Config.instance.test1).toEqual(true);
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

    @Test("value should support inject with @Value")
    public async decorator1() {
        Expect(this.test1).toEqual(true);
    }

    @Autowired()
    InjectClass: InjectClass

    @Test("class should support inject with @Autowired")
    public async decorator2() {
        Expect(this.InjectClass.test()).toEqual(true);
    }
}