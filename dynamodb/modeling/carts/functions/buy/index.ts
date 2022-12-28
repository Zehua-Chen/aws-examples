import {
  DynamoDBClient,
  GetItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { dynamodbItemToItem } from 'carts/core';

const usersTable = process.env['USERS_TABLE'];
const itemsTable = process.env['ITEMS_TABLE'];
const itemsByUserName = process.env['ITEMS_BY_USERNAME_INDEX'];
const client = new DynamoDBClient({});

export async function handler(event: Record<string, string>) {
  const { userName = 'peter' } = event;

  const queryByUserName = new QueryCommand({
    TableName: itemsTable,
    IndexName: itemsByUserName,
    KeyConditionExpression: 'UserName = :v_username',
    ExpressionAttributeValues: {
      ':v_username': { S: userName },
    },
  });

  const queryByUserNameResponse = await client.send(queryByUserName);

  const getUser = new GetItemCommand({
    TableName: usersTable,
    Key: {
      UserName: {
        S: userName,
      },
    },
  });

  const getUserResponse = await client.send(getUser);

  if (!queryByUserNameResponse.Items) {
    return;
  }

  const items = queryByUserNameResponse.Items.map(dynamodbItemToItem);

  return {
    userName,
    items,
    paymentMethod: getUserResponse.Item?.PaymentMethod.S ?? '?',
  };
}
