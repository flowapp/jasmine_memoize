# jasmine-memoize

## Prerequirements

- jasmine 2.1 or higher

## Install

Install either by using npm or manually downloading `index.js`.

```bash
$ npm install --save-dev jasmine-memoize
```

### With package manager

Require `jasmine-memoize` and call install on the exported object.

E.g.

```js
require("jasmine-memoize").install();
````

### Without package manager

```js
jasmineMemoize.install();
```

### Installing

Install takes an option argument, `env`, it’s the environment it will be installed onto. If no environment is passed in, it will install itself globally. When passing in an environment `jasmine-memoize` won’t add `set` to the global object, instead use `env.set`.
