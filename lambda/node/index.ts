import { add } from './math';

interface Event {}
interface Context {}

export async function handler(event: Event, context: Context): Promise<any> {
  const result = add(1, 2);
  console.log(`1 + 2 = ${result}`);
  return result;
}
