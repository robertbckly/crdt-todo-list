# CRDT To-Do List

Simple React to-do list app with a twist:

I implemented my interpretation of 'Optimised OR-Set': a data structured described in [this research paper](https://arxiv.org/abs/1210.3368). It's a form of 'conflict-free replicated data type' (CRDT) that, in this case, allows to-do lists to be replicated across devices, updated concurrently and achieve eventual consistency without conflicts.

I've integrated 'Sign in with Google' and my [AuthSave](https://github.com/robertbckly/auth-save-worker) object-storage backend to persist to-do lists over time and between devices.

Icons featured in the UI are from [heroicons](https://github.com/tailwindlabs/heroicons) ([MIT licensed](https://github.com/tailwindlabs/heroicons/blob/master/LICENSE)).

Note: [src/libs](/src/libs) contains two 'libraries' that I developed with heavy use of the React context + reducer pattern. They could in theory be extracted and used in other projects:

- `data`: CRDT for core app data, implemented as Optimised OR-Set (as mentioned)
- `drag`: custom drag-and-drop for lists
