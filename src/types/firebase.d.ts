export type FCMMessagePayloadType = {
  notification: {
    title: string;
    body?: string;
    [key: string]: unknown;
  };
  data?: {
    [key: string]: string;
  };
  [key: string]: unknown;
};
