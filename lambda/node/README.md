# Nodejs Lambda Functions

## Configuration

### Sourcemaps

Add `NODE_OPTIONS=--enable-source-maps` environment variable to enable source
map support

## Deployment

- Run `pnpm build` to compile Typescript files for the lambda function
- Run `pnpm zip` to zip compiled js and source map files to `lambda.zip`
- Configure lambda to use `index.handler`
