const path = require('path')

const TerserPlugin = require('terser-webpack-plugin')

const makeModule = require('./webpack.modules.config')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
    target: 'web',
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'source-map',
    entry: path.resolve('./src/script.js'),
    output: {
        filename: 'script.js',
        path: path.resolve('build'),
    },
    module: makeModule(),
    optimization: {
        moduleIds: 'deterministic',
        chunkIds: 'deterministic',
        minimize: isProduction,
        minimizer: [
        ],
    },
    plugins: [
        new TerserPlugin({
            extractComments: false,
            terserOptions: {
                compress: {
                    arguments: true,
                    // booleans_as_integers: true,
                    // drop_console: true,
                    ecma: '2015',
                    passes: 2,
                    toplevel: true,
                },
                mangle: {
                    toplevel: true,
                },
                format: {
                    comments: false,
                    ecma: '2015',
                },
                toplevel: true,
            },
        }),
    ],
}
