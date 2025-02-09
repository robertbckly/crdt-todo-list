export type Item = {
  // Required properties for CRDT...
  id: string;
  clientId: string;
  counter: number;
  // Arbitrary properties...
  value: string;
  status: 'open' | 'closed';
};
