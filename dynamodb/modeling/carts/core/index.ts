import { AttributeValue } from '@aws-sdk/client-dynamodb';

export interface User {
  userName: string;
  paymentMethod: string;
}

export interface Item {
  purchaseID: string;
  itemName: string;
  count: number;
  userName: string;
}

export type DynamoDBItem = Record<string, AttributeValue>;

export function userToDynamoDBItem(user: User): DynamoDBItem {
  return {
    UserName: {
      S: user.userName,
    },
    PaymentMethod: {
      S: user.paymentMethod,
    },
  };
}

export function itemToDynamoDBItem(item: Item): DynamoDBItem {
  return {
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
  };
}

export function dynamodbItemToItem(item: DynamoDBItem): Item {
  return {
    purchaseID: item.PurchaseID.S!,
    itemName: item.ItemName.S!,
    count: Number.parseInt(item.Count.N!),
    userName: item.UserName.S!,
  };
}
