import path from 'path';

import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import { WDS_PORT, IS_PROD, SCRIPT_PATH } from './config';

const plugins = [];
let cssConfig = [
    {
        loader: 'style-loader',
        options: {
            sourceMap: true
        }
    },
    {
        loader: 'css-loader',
        options: {
            sourceMap: true,
            importLoaders: 1
        }
    },
    {
        loader: 'postcss-loader',
        options: {
            sourceMap: true
        }
    }
];

if (IS_PROD) {
    const extractCss = new ExtractTextPlugin('./css/style.css');

    plugins.push(
        extractCss,
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(
                process.env.NODE_ENV || 'production'
            )
        })
    );

    cssConfig = extractCss.extract({
        use: [
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 1
                }
            },
            { loader: 'postcss-loader' }
        ]
    });
} else {
    plugins.push(new webpack.HotModuleReplacementPlugin(), new webpack.NamedModulesPlugin());
}

module.exports = {
    entry: {
        main: './client/js/main.js'
    },
    output: {
        filename: './js/[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: IS_PROD ? '/static/' : SCRIPT_PATH
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: [
                        [
                            'env',
                            {
                                targets: {
                                    browsers: ['last 2 versions']
                                },
                                modules: false,
                                loose: true
                            }
                        ],
                        'react'
                    ]
                }
            },
            {
                test: /\.css$/,
                use: cssConfig
            },
            {
                test: /\.(otf|svg|woff|woff2|ttf|eot)(\?.*$|$)/,
                include: path.resolve(
                    __dirname,
                    'node_modules/font-awesome/fonts'
                ),
                use: {
                    loader: 'file-loader',
                    query: {
                        outputPath: 'fonts/',
                        publicPath: IS_PROD ? '/dist/' : SCRIPT_PATH
                    }
                }
            }
        ]
    },
    devtool: IS_PROD ? false : 'source-map',
    devServer: {
        host: '0.0.0.0',
        disableHostCheck: true,
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: WDS_PORT,
        hot: true,
        headers: { 'Access-Control-Allow-Origin': '*' }
    },
    plugins
};
