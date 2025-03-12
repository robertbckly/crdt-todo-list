export type Item = {
  // Required properties for CRDT...
  id: string;
  clientId: string;
  counter: number;
  updated: Date;
  // Arbitrary properties...
  text: string;
  status: 'open' | 'closed';
  order: number;
};
