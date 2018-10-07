const path = require( 'path' )
const ExtractCSS = require( 'mini-css-extract-plugin' )

module.exports = {
	entry: './client/index.js',
	mode: 'development',
	target: 'web',
	output: {
		path: path.resolve( __dirname, 'public/dist' ),
		filename: 'bundle.js',
	},
	plugins: [
		new ExtractCSS( {
			path: path.join( __dirname, 'public', 'dist' ),
			filename: 'style.css'
		} )
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					ExtractCSS.loader,
					'css-loader',
				]
			},
			{
				test: /.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				}
			}
		],
	},
}
