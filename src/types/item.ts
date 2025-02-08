export type Item = {
  // Below = required for CRDT
  id: string;
  clientId: string;
  counter: number;
  // Below = arbitrary
  value: string;
  status: 'open' | 'closed';
};
