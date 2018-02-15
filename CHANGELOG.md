# 3.0.0 (2018-02-15)
* **Removed** hardcoded version of `ua-parser-js.js` in vendor directory
* **Added** `ua-parser-js` @ `^0.7.17`
* **Added** `broccoli-funnel` @ `^2.0.1`
* **Added** `broccoli-merge-trees` @ `^2.0.0`
* **Added** vendor shim to create es6 importable module
* **Updated** `index.js` to bring in `ua-parser-js` npm dependency
* **Updated** `ember-frost-core` to `^6.0.0`

# 2.0.0 (2018-01-12)
* **Added** `bower` @ `1.8.2`
* **Updated** `ember-frost-test` to `^4.0.0`
* **Updated** `ember-test-utils` to `^8.1.0`
* **Updated** `ember-cli-frost-blueprints` to `^5.0.1`
* **Added** ignoring of `package-lock` until we are ready to move to node 8
* **Removed** useLintTree ember-cli-mocha configuration from `ember-cli-build.js`
* **Removed** `.remarkrc` file since it is now provided by `ember-test-utils`
* **Added** `ember-browserify` @ `^1.2.0`
* **Updated** pin `ember-code-snippet` to `1.7.0`
* **Updated** `ember-cli-sass` to `7.1.1`
* **Updated** `ember-computed-decorators` to be a dependency instead of a devDependency
* **Updated** `ember-frost-core` to `^5.1.1` and moved to a dependency instead of a devDependency
* **Updated** `ember-hook` to `1.4.2` and moved to a dependency instead of a devDependency
* **Updated** `ember-prop-types` to `^6.0.1` and moved to a dependency instead of a devDependency
* **Removed** unused `ember-spread` package
* **Removed** unused `ember-truth-helpers` package
* **Removed** unused `ember-concurrency` package
* **Removed** unused `ember-elsewhere` package
* **Removed** unused `ember-inflector` package
* **Removed** unused `ember-lodash-shim` package
* **Removed** `ember-perfectscroll` package (it is being brought in via `ember-frost-core` for frost-scroll)
* **Removed** `perfect-scrollbar` bower package (it is being brought in via `ember-frost-core` for frost-scroll)
* **Removed** unused `lodash-es` package
* **Updated** `ember-frost-notifier` to `^7.0.0`
* **Updated** move code coverage config file to tests/dummy/config/ and add json-summary reporter"

# 1.5.3 (2017-11-13)
* #40 - Bind context to call of this._super.included() in index.js

# 1.5.2 (2017-11-06)
* **Updated** testing dependencies
* **Removed** unneeded testing packages from `bower.json`


# 1.5.1 (2017-08-24)
 * **Fixed** column alignment issue when new rows were added after first render 


# 1.5.0 (2017-08-21)
 * **Fixed** issue #30 by changing `frost-table` and `frost-fixed-table` components to use a flexbox approach
 * **Fixed** issue #18 by providing some meaningful tests


# 1.4.5 (2017-08-18)
 * **Fixed** issue #33


# 1.4.4 (2017-08-11)
* Upgrade ember-cli 2.12.3 inter-dependencies

# 1.4.3 (2017-07-31)
 * **Fixed** selection functionality to match `ember-frost-list`


# 1.4.2 (2017-07-26)
 * **Fixed** the shifting of table cell values when a row is selected


# 1.4.1 (2017-07-19)
 * **Fixed** issue #22


# 1.4.0 (2017-07-13)
 * **Added** functionality for grouping columns


# 1.3.1 (2017-07-12)
* Upgrade `ember-cli` to `2.12.3`

# 1.3.0 (2017-07-04)
 * **Added** functionality for selecting table rows in **frost-fixed-table**


# 1.2.2 (2017-06-09)
 * Fix mirage for Demo page
* Fix CSS for Table Selection. Fixes https://github.com/ciena-frost/ember-frost-table/issues/20



# 1.2.1 (2017-06-09)
* **Enabled** code coverage checks
* **Enabled** throwing errors when proptypes finds problems (instead of warnings)
* **Upgraded** `ember-test-utils` to `5.x`


# 1.2.0 (2017-06-02)
* **Updated** `frost-table` to use a flexbox layout instead of a fixed table layout and wrap the table body in a `frost-scroll`


# 1.1.0 (2017-06-01)
- Added a selection cell with the ability to handle range selection


# 1.0.4 (2017-05-12)
* **Updated** secure auth token
* **Updated** frost-table-header to use `css` property to set class instead of `cellCss` which was undefined and causing a test to fail.
* **Removed** `ember-cli-dependency-checker` as it was causing an `TypeError: Invalid Version *`


# 1.0.3
* **Added** a .gitkeep file to coverage directory for code coverage
* **Updated** the code coverage excludes pattern

# 1.0.2
* **Updated** to use latest pr-bumper which supports being able to set a PR to `none` when publishing a new version is not desired.

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

