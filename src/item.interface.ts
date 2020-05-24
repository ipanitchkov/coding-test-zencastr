export interface Item {
  data: any;
  meta: {
    timestamp: number;
    expire?: number;
  };
}
