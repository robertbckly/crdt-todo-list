# CRDT To-Do List App

Experimental React to-do list app with a twist:

I've implemented 'Optimised OR-Set': a Conflict-free Replicated Data Type (CRDT) described in a [research paper](https://arxiv.org/abs/1210.3368). This enables to-do lists to be replicated across devices, updated concurrently, and achieve eventual consistency without conflicts.

Similar data structures have been used in widely known applications ([reference](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type#Industry_use)):

- Apple Notes app
- TomTom inter-device navigation data synchronisation
- Redis distributed database implementations

---

I've also integrated 'Sign in with Google' and my [AuthSave](https://github.com/robertbckly/auth-save-worker) object-storage backend to persist to-do lists over time and between devices.

Icons featured in the UI are from [heroicons](https://github.com/tailwindlabs/heroicons) ([MIT licensed](https://github.com/tailwindlabs/heroicons/blob/master/LICENSE)).

Note: [src/libs](/src/libs) contains two 'libraries' that I developed with heavy use of the React context + reducer pattern. They could in theory be extracted and used in other projects:

- `data`: reducer-based CRDT for core app data (implemented as Optimised OR-Set)
- `drag`: custom drag-and-drop for lists
