var gutil = require('gulp-util');

var DEV = 1;
var PROD = 2;

var env = ((gutil.env.mode && gutil.env.mode.indexOf('prod') > -1) ? PROD : DEV);

function isDev() {
    return env !== PROD;
}

function isProd() {
    return env === PROD;
}

var pkg = require('../../package.json');
var banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @author v<%= pkg.author %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''
].join('\n');

module.exports = {
    env: ((gutil.env.mode && gutil.env.mode.indexOf('prod') > -1) ? PROD : DEV),
    dev: DEV,
    prod: PROD,
    src: '../src/public/',
    dest: '../dist/',
    isDev: isDev,
    isProd: isProd,
    assetSrc: '../src/public/assets/',
    assetDest: '../dist/',
    allinoneFile: '../src/public/scripts/main.js',
    allinone: 'main',
    banner: banner,
    pkg: pkg
};
