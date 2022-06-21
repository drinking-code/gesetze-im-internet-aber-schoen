const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const makeModule = require('./webpack.modules.config')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
    target: 'node16',
    mode: isProduction ? 'production' : 'development',
    devtool: 'source-map',
    entry: path.resolve('./src/index.js'),
    output: {
        filename: 'index.js',
        path: path.resolve('build'),
        library: {
            // note there's no `name` here
            type: 'commonjs2',
        },
        clean: {
            keep: /loadable-stats\.json/,
        },
    },
    module: makeModule(),
    optimization: {
        moduleIds: 'deterministic',
        chunkIds: 'deterministic',
        minimize: isProduction,
        minimizer: [
            new CssMinimizerPlugin({
                minimizerOptions: [{
                    preset: [
                        "advanced", {
                            discardUnused: true,
                            mergeIdents: true,
                            reduceIdents: true,
                            zindex: false
                        }]
                }, {},],
                minify: [
                    CssMinimizerPlugin.cssnanoMinify,
                    CssMinimizerPlugin.cssoMinify,
                ],
            }),
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.css',
        }),
    ],
}
