import { add } from './math.js';
import axios from 'axios';

interface Event {}
interface Context {}

export async function handler(event: Event, context: Context): Promise<any> {
  console.log(`1 + 2 = ${add(1, 2)}`);

  const response = await axios.get('https://www.google.com/');
  console.log(`www.google.com returns ${response.status}`);

  // this will throw error to test if sourcemap support is available
  console.log(null.age);

  return 'hello world';
}
