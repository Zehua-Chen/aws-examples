import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

const usersTable = process.env['USERS_TABLE'];
const itemsTable = process.env['ITEMS_TABLE'];
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

async function addUser(user: User) {
  const command = new PutItemCommand({
    TableName: usersTable,
    Item: {
      UserName: {
        S: user.userName,
      },
      PaymentMethod: {
        S: user.paymentMethod,
      },
    },
  });

  await client.send(command);
}

async function addItem(item: Item) {
  const command = new PutItemCommand({
    TableName: itemsTable,
    Item: {
      PurchaseID: {
        S: item.purchaseID,
      },
      UserName: {
        S: item.userName,
      },
      ItemName: {
        S: item.itemName,
      },
      Count: {
        N: `${item.count}`,
      },
    },
  });

  await client.send(command);
}

export async function handler(event: unknown) {
  await addUser({ userName: 'peter', paymentMethod: 'Paypal' });
  await addUser({ userName: 'jackson', paymentMethod: 'Visa' });

  await addItem({
    purchaseID: '0',
    userName: 'peter',
    itemName: 'Watermelon',
    count: 1,
  });

  await addItem({
    purchaseID: '1',
    userName: 'peter',
    itemName: 'Pear',
    count: 1,
  });

  await addItem({
    purchaseID: '2',
    userName: 'jackson',
    itemName: 'Pear',
    count: 1,
  });

  return {
    statusCode: '200',
  };
}
