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
