export type Item = {
  // Required properties for CRDT...
  id: string;
  clientId: string;
  counter: number;
  updatedTimeMs: number;
  // Arbitrary properties...
  text: string;
  status: 'open' | 'closed';
  order: number;
};
