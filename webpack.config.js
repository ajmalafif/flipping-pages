'use strict'

const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const GenerateJsonPlugin = require('generate-json-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const MinifyPlugin = require('babel-minify-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const {resolve} = require('path')

const originalJson = require('./package.json')

const {scripts, devDependencies, ...buildJson} = originalJson

const externals = {}

for (const name of Object.keys(Object.assign({}, buildJson.dependencies, buildJson.peerDependencies))) {
    externals[name] = {
        commonjs: name,
        commonjs2: name,
        amd: name,
    }
}

const config = {
    mode: 'production',
    entry: './src/FlippingPages.js',
    output: {
        filename: 'FlippingPages.js',
        path: resolve(__dirname, 'build/flipping-pages'),
        library: 'flipping-pages',
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                        },
                    },
                ],
            }, {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
        ],
    },
    externals,
    optimization: {
        minimizer: [
            new OptimizeCSSAssetsPlugin(),
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['build/flipping-pages']),
        new MiniCssExtractPlugin({
            filename: 'FlippingPages.css',
        }),
        new MinifyPlugin({}, {comments: false}),
        new GenerateJsonPlugin('package.json', buildJson),
        new CopyWebpackPlugin([
            'LICENSE',
            'README.md',
        ]),
    ],
}

module.exports = config