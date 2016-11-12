'use strict';

let build = require('@microsoft/web-library-build');
let gulp = require('gulp');
let fs = require('fs');

let isProduction = process.argv.indexOf( '--production' ) >= 0;
let isNuke = process.argv.indexOf( 'nuke' ) >= 0;
console.log(`isProduction? (${isProduction})`);

/** @todo: disable lint config. */
build.tslint.setConfig({ lintConfig: require('./tslint.json') });

/* Configure TypeScript 2.0. */
build.typescript.setConfig({ typescript: require('typescript') });

build.postCopy.setConfig({
  copyTo: {
    'dist': [
      'src/**/*.png',
      'node_modules/react/dist/react.js',
      'node_modules/react-dom/dist/react-dom.js'
    ]
  }
});

build.postCopy.setConfig({
  copyTo: {
    'dist/sass': [
      'node_modules/office-ui-fabric-react/dist/sass/*.*'
    ],
    'dist/css': [
      'node_modules/office-ui-fabric-react/dist/css/*.*',
      'node_modules/draft-js/dist/*.css'
    ]
  }
});

// process *.Example.tsx as text.
build.text.setConfig({ textMatch: ['src/**/*.txt', 'src/**/*.Example.tsx', 'src/**/*.Props.ts'] });

if (isProduction || isNuke) {
  build.setConfig({
    libAMDFolder: 'lib-amd'
  });
}

build.sass.setConfig({
  useCSSModules: true,
  dropCssFiles: true
});

build.task('tslint', build.tslint);
build.tslint.setConfig({
  rulesDirectory: 'node_modules/tslint-microsoft-contrib'
})

// initialize tasks.
build.initialize(gulp);
