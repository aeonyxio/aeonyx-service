export async function arrayFromAsyncIterable<T>(
  asyncIterator: AsyncIterable<T>,
) {
  const arr = [];
  for await (const i of asyncIterator) arr.push(i);
  return arr;
}
