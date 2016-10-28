# Open Contracting Red Flags

This is the development repo for creating + testing red flag indicators for Open Contracting data based on the [OCDS Standard](http://standard.open-contracting.org/latest/).

## Codebase Structure

The folder structure for the project is as follows:

    output/
    scripts/
    src/
      flags/
      preconditions/
      schema/
      util/

The `scripts/` folder holds ad-hoc scripts which are useful mainly during development/testing of the indicators. The most important script is `scripts/run-ocvn.js` which tests the current iteration of the flags against all of the Open Contracting Vietnam dataset and writes the result into the `output/` folder. To run this, configure the MongoDB connection in `config.js` and then run:

    $ node scripts/run-ocvn.js

Individual red flag functions are stored in `src/flags`. Each flag is created using the factory function exported by `/util/create-indicator.js` module. That factory function guarantees a consistent function signature between indicator functions, type-checks the release data against the OCDS Schema (when `NODE_ENV === 'testing'` or `NODE_ENV === 'development'` only), checks for required fields, and checks for preconditions. Creating a flag works as follows:

    const { createIndicator } = require('../util');

    const testFunction = release => {
      // ... do some analysis of the release
      return true; // return a boolean
    };

    const myIndicator = createIndicator('myIndicator', testFunction, {
      requiredOCDSFields: [ 'oneOCDSField', 'another.OCDS.field' ],
      requiredCustomFields: [ 'myCustomField' ],
      preconditions: []
    });

Every indicator created with the `createIndicator` factory can be used to test an OCDS release, e.g.:

    const release = { ... };
    const result = myIndicator(release); // returns true, false, or null

Indicators created with `createIndicator` also expose a `selfDocument()` method, which returns an object describing the indicator. For instance, calling:

    myIndicator.selfDocument();

would return the following object:

    {
      id: 'myIndicator',
      requiredOCDSFields: [ 'oneOCDSField', 'another.OCDS.field' ],
      requiredCustomFields: [ 'myCustomField' ],
      preconditions: []
    }

Preconditions should be created as modules in the `preconditions/` directory, using the factory exported by `/util/create-precondition.js`. Preconditions created in this way are also self-documenting.

## Static Site Generation

The `createIndicator` and `createPrecondition` factories give us the basis for the creation of self-documenting sets of test functions. By running `node /scripts/generate-docs.js` you can see the JSON output from the current set of flags. A near-term project is to create a static site generator based on this JSON output. The idea then is that indicator documentation will always be in-sync with the actual indicator logic, and time will also be saved on maintaining docs/deliverables.

## Linting

The codebase uses a fairly standard set of `eslint` rules. To run the linter:

    $ npm run eslint

There is currently no commit hook or CI tooling in place to prevent lint errors from entering the codebase, so a little diligence here goes a long way!

## Unit Tests

Since indicator logic can get tricky, unit tests are key to making sure that we are implementing indicator logic correctly. Unit tests follow the convention of `**/test/test-*.js` and can live anywhere in the directory structure (ideally as close as possible to the code that they are testing). To run the tests:

    $ npm run test

Note that while `tap-spec` produces nices output, it currently does not pass the correct exit code on test failure, so if this ever gets hooked into CI for some reason the npm test script should be amended to remove `tap-spec`.
