# 1.0.1
* **Fixed** issue with namespace of exported `.scss` files. We were putting all the `_foo.scss` files directly into
`app/styles` instead of `app/styles/ember-frost-table` polluting the top-level styles directory for the consuming app.
That wasn't very nice of us. We don't do that anymore.


# 1.0.0
- `frost-fixed-table` and `frost-table` can now handle custom callback propagation from individual cells in the header
or body sections.
- Custom table cell renders are now given an `onCallback(action, args)` method that they can call to propagate events
or any other notification that needs to escape the table.
- Passing an `onCallback({action, args, col, row})` to the table will allow the consumer of the table to receive
these events.
- Linting warnings have been fixed, and warnings from `ocd/sort-import-declarations` are now reported as errors.
- **Breaking change**: Columns in `frost-fixed-table` sections now have globally unique column indices in their ember
hooks, rather than having each of the left/middle/right sections index from zero, so that the generic event callback
can uniquely identify table cells more easily
- **Breaking change**: `items` and `columns` arguments are now required.


# 0.3.1
* **Fixed** paths in coverage report


# 0.3.0
* **Added** support for custom renderers for cells
* **Added** codecov.io integration


# 0.2.0
 * **Added** `frost-fixed-table` component which allows for frozen left and right columns and a fixed header row,
but relies on fixed column widths/heights to work properly.
* **Updated** `ember-frost-core`
* **Updated** existing components to derive from `frost-component` now.


# 0.1.0
 * **Added** initial implementation of a simple `frost-table`

