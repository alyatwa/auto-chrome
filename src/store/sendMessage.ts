export interface Message<T> {
  type: string;
  subtype: string;
  data: any;
}

export interface Response<V> {
  status: number;
  data: V;
}

export function sendMessage<T, V>(message: Message<T>) {
  return new Promise<any>((resolve, reject) => {
    try {
      chrome.runtime.sendMessage(message, (response: Response<V>) => {
        console.log("received user data", response);
        if (!chrome.runtime.lastError) {
          resolve(response);
        } else {
          reject(response);
        }
      });
    } catch (error) {
      // Error must match V type
      reject(error);
    }
  });
}
// Example using numbers
//const responseDataNumber = await sendMessage<number, number>({ type: "hello", subtype: "world", data: 1})
