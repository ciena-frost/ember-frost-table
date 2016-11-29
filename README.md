[ci-img]: https://img.shields.io/travis/ciena-frost/ember-frost-table.svg "Travis CI Build Status"
[ci-url]: https://travis-ci.org/ciena-frost/ember-frost-table

[cov-img]: https://img.shields.io/coveralls/ciena-frost/ember-frost-table.svg "Coveralls Code Coverage"
[cov-url]: https://coveralls.io/github/ciena-frost/ember-frost-table

[npm-img]: https://img.shields.io/npm/v/ember-frost-table.svg "NPM Version"
[npm-url]: https://www.npmjs.com/package/ember-frost-table

[eo]: http://emberobserver.com/badges/ember-frost-table.svg "Ember Observer score"
[eo-url]: http://emberobserver.com/addons/ember-frost-table

[ember-img]: https://img.shields.io/badge/ember-2.3+-orange.svg "Ember 2.3+"

[bh-img]: https://www.bithound.io/github/ciena-frost/ember-frost-table/badges/score.svg "bitHound"
[bh-url]: https://www.bithound.io/github/ciena-frost/ember-frost-table

# ember-frost-table

| Dependencies | Health | Security | Observer |
| ------------ | ------ | -------- | -------- |
| ![Ember][ember-img] | [![Travis][ci-img]][ci-url] | [![bitHound][bh-img]][bh-url] | [![EmberObserver][eo]][eo-url] |
| [![NPM][npm-img]][npm-url] | [![Coveralls][cov-img]][cov-url] | | |


## Installation

```js
ember install ember-frost-table
```

## API and Examples
Detailed API and example usage can be found in the sample application in `tests/dummy`,
which is also running at http://ciena-frost.github.io/ember-frost-table

## Testing with ember-hook
This addon has been optimized for use with [ember-hook](https://github.com/Ticketfly/ember-hook).
You can set a `hook` name on your table template. This will allow you to access the internal table content for testing.

## Development
### Setup
[Fork](https://github.com/ciena-frost/ember-frost-table#fork-destination-box) the repo.

Then clone from your fork.

```
git clone git@github.com:<your-account-name-here>/ember-frost-table.git
cd ember-frost-table
```

Add a remote for the upstream repo.
```
git remote add upstream git@github.com:ciena-frost/ember-frost-table.git
```

Create a branch for your work
```
git checkout -b my-awesome-feature
```

Install deps

```
npm install && bower install
```

### Coding
A dummy application for development is available under `ember-frost-table/tests/dummy`.
To run the server run `ember server` (or `npm start`) from the root of the repository and
visit the app at http://localhost:4200.

Then, write some code

```
<code> the awesome feature </code>
```

Save your work (early and often)

```
git add <the files you touched>
git commit
```

Push your changes to your fork (early and often)

```
git push origin my-awesome-branch
```

### Testing
Run `npm test` from the root of the project to run linting checks as well as execute the test suite
and output code coverage. This will make sure you didn't break anything else.

Now, **don't forget** to add tests for the new feature/bugfix you just added.

```
<code> tests for the awesome feature </code>
```

You can also run tests as you code and as you write more tests by running the development server in test mode
`ember s -e test` and then visiting http://localhost:4200/tests.


### Contributing
Once you're all done, [submit a pull request](https://github.com/ciena-frost/ember-frost-table/compare).
Thanks for the contribution :smile:
