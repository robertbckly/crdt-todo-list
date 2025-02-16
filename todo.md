# To-do

- ~~status updating~~
- ~~order updating & persistence~~
- continue drag updates out of list's bounds (body?)
- delay before drag start via touch
- auto-scroll on drag
- truncation via dialog: "item view"
- multiline support
- markdown support?
- multiple lists
  - within single CRDT; use list ID

---

- session management
- design
- animations
- a11y
- dark mode toggle
- motion toggle
- efficiency review
  - maybe commute changes; merge on server; compare hashes to know if to pull
  - could use IndexedDB API?
- max item size enforced before merge & server-side
- local pagination
- encryption
- automatic session refreshing
- graceful logout on invalid session
- TODOs in code: i.e. remote CRDT errors
