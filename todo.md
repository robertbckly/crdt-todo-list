# To-do

- ~~status updating~~
- ~~order updating & persistence~~
- ~~continue drag updates out of list's bounds~~
- ~~add bounds to keyboard reordering~~
- ~~delay before drag start via touch~~
- auto-scroll on drag
  - \*\*\* review the mess of dragging-context props changing every render...
    - either need to memoise ahead of passing, or extract the ref/memo solution
  - dragging off viewport and entering again is unusable... can't get item 99 to 0
  - prevent cancellation outside of viewport... it's annoying!
  - fix drop line not updating when auto scrolling while cursor is still
  - make auto-scroll use a time-based increment for consistency
- review lack of use of HTML drag-and-drop API; impact on a11y, etc.
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
