[![codecov](https://codecov.io/gh/fullstackoverflow/config/branch/master/graph/badge.svg)](https://codecov.io/gh/fullstackoverflow/config)
[![NPM version](https://img.shields.io/npm/v/@tosee/config.svg)](https://www.npmjs.com/@tosee/config)
![CI](https://github.com/fullstackoverflow/config/workflows/CI/badge.svg)

# 介绍

配置文件加载,根据NODE_ENV环境变量在配置的CONFIG环境变量路径中查找对应的ts或js文件,加载的值可以通过@Value装饰器注入

# 快速开始

```
export CONFIG=./src/config
export NODE_ENV=test
```

src/config/default.ts
```
export default {
    test1: false,
    test3: 1 + 2
};
```

src/config/test.ts
```
export default {
	test1: true,
	test2: 1 + 2
};
```

```
import { Config } from '@tosee/config'
class TestSuit {
    @Value("test1")
    test1: Boolean;

    test(){
        console.log(Config.instance.test1);
        console.log(Config.instance.test2);
        console.log(Config.instance.test3);
        console.log(this.test1);
    }
}
new TestSuit().test();
```
```
true
3
3
true
```