const autoprefixer = require('autoprefixer')
const sass = require('sass')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const generateClassName = require('../helpers/generate-class-name')

const isProduction = process.env.NODE_ENV === 'production'

const postcssAndSass = [{
    loader: 'postcss-loader',
    options: {
        sourceMap: true,
        postcssOptions: {
            plugins: [autoprefixer],
        },
    }
}, {
    loader: 'resolve-url-loader',
    options: {
        sourceMap: true,
    }
}, {
    loader: 'sass-loader',
    options: {
        sourceMap: true,
        sassOptions: {
            functions: {
                'generate-class-name($class)': function (className) {
                    className = className.getValue()
                    const prefix = 'global_'
                    if (!className.startsWith(prefix))
                        className = prefix + className
                    return new sass.SassString(generateClassName(className))
                }
            },
        },
    }
},]

const makeModule = (noCss) => {
    return {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/env', {
                            targets: {
                                node: process.versions.node
                            }
                        }],
                        ['@babel/react', {
                            runtime: 'automatic',
                            development: !isProduction,
                        }],
                    ],
                }
            }
        }, {
            test: /\.s?[ac]ss$/i,
            exclude: /\.module\.s?[ac]ss$/i,
            use: [{
                loader: MiniCssExtractPlugin.loader,
                options: {
                    emit: !noCss,
                },
            }, {
                loader: 'css-loader',
                options: {
                    importLoaders: 2,
                    sourceMap: true,
                }
            }, ...postcssAndSass]
        }, {
            test: /\.module\.s?[ac]ss$/i,
            use: [{
                loader: MiniCssExtractPlugin.loader,
                options: {
                    emit: !noCss,
                },
            }, {
                loader: 'css-loader',
                options: {
                    importLoaders: 1,
                    sourceMap: true,
                    modules: {
                        mode: 'local',
                        getLocalIdent: (context, localIdentName, localName) =>
                            generateClassName(localName, context.resourcePath),
                    },
                }
            }, ...postcssAndSass]
        }, {
            test: /\.svg$/i,
            type: 'asset/inline',
        }, {
            test: /\.png$/i,
            type: 'asset/resource',
        }, {
            test: /\.(ttf|woff2?)$/i,
            type: 'asset/resource',
        }],
    }
}

module.exports = makeModule
