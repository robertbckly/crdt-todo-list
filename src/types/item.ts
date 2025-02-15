export type Item = {
  // Required properties for CRDT...
  id: string;
  clientId: string;
  counter: number;
  // Arbitrary properties...
  text: string;
  status: 'open' | 'closed';
};
