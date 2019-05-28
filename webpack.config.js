/* eslint-disable filenames/match-exported */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

const config = {
	devtool: 'eval',
	entry: ['./src/js/application.js', './src/less/application.less'],
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'application.js',
		sourceMapFilename: 'maps/application.js.map',
		publicPath: '/public',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.less$/i,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'less-loader',
				],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'application.css',
		}),
		new HtmlWebpackPlugin({
			template: 'src/views/index.html',
		}),
		new CopyWebpackPlugin([
			{ from: 'src/images/*.png', to: 'images/[name].png' },
		]),
		new CopyWebpackPlugin([
			{ from: 'src/fonts/*.woff', to: 'fonts/[name].woff' },
		]),
		new CopyWebpackPlugin([
			{ from: 'src/fonts/*.woff2', to: 'fonts/[name].woff2' },
		]),
		new WriteFilePlugin({
			test: /\.(json|png|woff|woff2)$/,
		}),
	],
};

module.exports = config;
