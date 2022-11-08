- [Architecture](#architecture)
- [Development](#development)
  - [Run Func0 Locally](#run-func0-locally)
  - [Tests](#tests)
- [Publishing](#publishing)

# Architecture

This sample project implements clean architecture for Python

- [`pylambda.core`](pylambda/core/): implement core business logic and define
  interfaces
- [`pylambda.infrastructure`](pylambda/infrastructure/): implement the
  interfaces defined in core
- [`pylambda.functions.func0`](pylambda/functions/func0/): A lambda function
- [`tests`](tests/): unit test

# Development

## Run Func0 Locally

```
python -m pylambda.functions.func0
```

## Tests

```
python -m unittest discover tests
```

# Publishing

1. Install dependencies: `pip install --target . .`
2. Create a Python lambda with handler set to
   `pylambda.functions.func0.handler.handler`
3. Zip **this entire directory** and upload it to the Lambda
