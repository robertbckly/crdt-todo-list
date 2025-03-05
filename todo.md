# To-do

- ~~status updating~~
- ~~order updating & persistence~~
- ~~continue drag updates out of list's bounds~~
- ~~add bounds to keyboard reordering~~
- ~~delay before drag start via touch~~
- refactor data layer to use reducer + context pattern, like drag lib
- dnd
  - ignore non-primary pointers when dragging (to allow simultaneous manual scroll on mobile)
  - improve auto-scroll (ux; keyboard scroll; use a time-based loop)
  - dragging off viewport and entering again is unusable... can't get item 99 to 0
  - fix drop line not updating when auto scrolling while cursor is still
  - review a11y usage
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
