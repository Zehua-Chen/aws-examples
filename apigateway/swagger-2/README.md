# API Gateway with Swagger 2.0

## Features

### Lambda Integration

```tf
templatefile(
  "swagger.template.yml",
  {
    vars = {
      region  = ...
      echo_lambda = some_arn
    }
  }
)
```

By passing `region`, `echo_lambda` the API Gateway automatically associates
`/echo` path with the Lambda represented by `some_arn`

### CORS

```yml
/echo:
  options:
    summary: CORS support
    description: |
      Enable CORS by returning correct headers
    consumes:
      - application/json
    produces:
      - application/json
    tags:
      - CORS
    x-amazon-apigateway-integration:
      type: mock
      requestTemplates:
        application/json: |
          {
            "statusCode" : 200
          }
      responses:
        "default":
          statusCode: "200"
          responseParameters:
            method.response.header.Access-Control-Allow-Headers: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key'"
            method.response.header.Access-Control-Allow-Methods: "'*'"
            method.response.header.Access-Control-Allow-Origin: "'*'"
          responseTemplates:
            application/json: |
              {}
    responses:
      200:
        description: Default response for CORS method
        headers:
          Access-Control-Allow-Headers:
            type: "string"
          Access-Control-Allow-Methods:
            type: "string"
          Access-Control-Allow-Origin:
            type: "string"
```
