declare function fbq(command: string, event: string, params?: object, options?: object): void;

interface Window {
  fbq: typeof fbq;
}
