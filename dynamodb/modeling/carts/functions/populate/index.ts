import {
  DynamoDBClient,
  BatchWriteItemCommand,
} from '@aws-sdk/client-dynamodb';
import { userToDynamoDBItem, itemToDynamoDBItem } from '../../core';

const usersTable = process.env['USERS_TABLE']!;
const itemsTable = process.env['ITEMS_TABLE']!;
const client = new DynamoDBClient({});

interface User {
  userName: string;
  paymentMethod: string;
}

interface Item {
  purchaseID: string;
  itemName: string;
  count: number;
  userName: string;
}

async function addUsers(users: User[]) {
  const command = new BatchWriteItemCommand({
    RequestItems: {
      [usersTable]: users.map((user) => ({
        PutRequest: {
          Item: userToDynamoDBItem(user),
        },
      })),
    },
  });

  await client.send(command);
}

async function addItems(items: Item[]) {
  const command = new BatchWriteItemCommand({
    RequestItems: {
      [itemsTable]: items.map((item) => ({
        PutRequest: {
          Item: itemToDynamoDBItem(item),
        },
      })),
    },
  });

  await client.send(command);
}

export async function handler(event: unknown) {
  await addUsers([
    { userName: 'jackson', paymentMethod: 'Visa' },
    { userName: 'peter', paymentMethod: 'Paypal' },
  ]);

  await addItems([
    {
      purchaseID: '0',
      userName: 'peter',
      itemName: 'Watermelon',
      count: 1,
    },
    {
      purchaseID: '1',
      userName: 'peter',
      itemName: 'Pear',
      count: 1,
    },
    {
      purchaseID: '2',
      userName: 'jackson',
      itemName: 'Pear',
      count: 1,
    },
  ]);

  return {
    statusCode: '200',
  };
}
