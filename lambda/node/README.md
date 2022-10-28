# Nodejs Lambda Functions

## Configuration

### Sourcemaps

Add `NODE_OPTIONS=--enable-source-maps` environment variable to enable source
map support

## Deployment

- Install `esbuild` globally `pnpm add -g esbuild`; **dev dependencies can be
  very large. So we don't want to install all of them**
- Run `pnpm install --prod` to install dependencies; `--prod` will **cause dev
  dependencies to be ignored**
- Run `pnpm build:lambda` to compile Typescript files for the lambda function
- Run `pnpm zip:lambda` to zip compiled js and source map files to `lambda.zip`
- Configure lambda to use `handler.handler`
