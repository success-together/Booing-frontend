export interface Wallet {
  _id: string;
  user_id: string;
  amount: number;
  transactions: Array<Transactions>;
  isSelledSpace: boolean;
}

export interface Transactions {
  isIncremenet: boolean;
  amount: number;
  date: Date;
}
