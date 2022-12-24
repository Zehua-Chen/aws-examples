//@ts-check
import { Construct } from 'constructs';
import {
  App,
  Stack,
  aws_dynamodb as dynamodb,
  aws_lambda as lambda,
} from 'aws-cdk-lib';
import * as path from 'path';

class ShoppingCarts extends Construct {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   */
  constructor(scope, id) {
    super(scope, id);

    const users = new dynamodb.Table(this, 'Users', {
      partitionKey: { name: 'UserName', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const items = new dynamodb.Table(this, 'Items', {
      partitionKey: { name: 'PurchaseID', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    items.addGlobalSecondaryIndex({
      indexName: 'ByUserName',
      partitionKey: {
        name: 'UserName',
        type: dynamodb.AttributeType.STRING,
      },
    });

    const populateTables = new lambda.Function(this, 'PopulateTables', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join('carts', 'populate')),
      environment: {
        USERS_TABLE: users.tableName,
        ITEMS_TABLE: items.tableName,
      },
    });

    users.grantWriteData(populateTables);
    items.grantWriteData(populateTables);

    const buy = new lambda.Function(this, 'Buy', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join('carts', 'buy')),
      environment: {
        USERS_TABLE: users.tableName,
        ITEMS_TABLE: items.tableName,
        ITEMS_BY_USERNAME_INDEX: 'ByUserName',
      },
    });

    users.grantReadData(buy);
    items.grantReadData(buy);
  }
}

export class DynamoDBNodeJSModeling extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   */
  constructor(scope, id) {
    super(scope, id);

    new ShoppingCarts(this, 'ShoppingCarts');
  }
}

const app = new App();
new DynamoDBNodeJSModeling(app, 'DynamoDBNodeJSModeling');

app.synth();
