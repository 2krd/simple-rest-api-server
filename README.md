Simple REST API server boilerplate
==================================

This provides a very basic boilerplate to get started with building one's own REST API server with NodeJS and its related libraries. The stack includes a minimal-enough HTTP node server (`restify`), an accompanying NoSQL driver (`rethinkdb`), an accompanying CDN-enabling component (`aws-sdk`), and an environment variable helper (`figaro`).

Of course you're not bound to using the bundled features. For example you may need MongoDB or another NoSQL. The same goes for Express vs. Restify, or you'd rather not use figaro at all. In those cases, this boilerplate may not be the best starting ground for you, but may still act as a decent reference point.

### Bundled features:

- restify
- rethinkdb
- aws-sdk
- figaro

### Getting Started

1. `npm install`
2. create a `figaro.json` file in the top level directory, providing the necessary parameter values specificed in the `config.js` file. Please refer to the [figaro node package](https://www.npmjs.com/package/figaro) for more details.
3. `nodemon`

#### Minor tips:
- `npm install -g nodemon` first if you haven't got nodemon on your dev machine, or
- `npm start` or `node bootstrap.js` if you absolutely don't like to use nodemon (though we may not understand why)
- example content for the `figaro.json` file is provided below:

    ```
    {
      "AWS_ACCESS_KEY_ID"       : <YOUR_AWS_ACCESS_KEY_ID>,
      "AWS_SECRET_ACCESS_KEY"   : <YOUR_AWS_SECRET_ACCESS_KEY>,
      "AWS_BUCKET_NAME"         : <YOUR_AWS_S3_BUCKET_NAME>,
      "AWS_REGION"              : <YOUR_AWS_S3_REGION>,
      
      "APP_PORT"                : <SOME_PORT_NUMBER>,
      "DB_HOST"                 : <YOUR_RETHINKDB_HOSTNAME>,
      "DB_PORT"                 : <YOUR_RETHINKDB_PORT>
    }
    ```

### TODOs:

- More verbose README
- Bundle and use the `debug` package