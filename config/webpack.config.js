const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const makeModule = require('./webpack.modules.config')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
    target: 'node16',
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'source-map',
    entry: path.resolve('./src/index.js'),
    output: {
        filename: 'index.js',
        path: path.resolve('build'),
        library: {
            type: 'commonjs2',
        },
        clean: {
            keep: /script\.js(\.map)?$/
        }
    },
    module: makeModule(),
    optimization: {
        moduleIds: 'deterministic',
        chunkIds: 'deterministic',
        minimize: isProduction,
        minimizer: [
            new TerserPlugin(),
            new CssMinimizerPlugin({
                minimizerOptions: [{
                    level: {
                        1: {
                            roundingPrecision: 'all=3',
                        },
                    },
                }, {
                    preset: [
                        'advanced', {
                            discardUnused: true,
                            mergeIdents: true,
                            reduceIdents: true,
                            zindex: false
                        }]
                }, {},],
                minify: [
                    CssMinimizerPlugin.cleanCssMinify,
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
