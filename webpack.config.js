module.exports = {
  cache: true,
  context: __dirname,
  entry: './app/main.js',
  output: {
    path: __dirname + '/dist/',
    filename: 'bundle.js',
    publicPath: "/dist/"
  },
  module: {
    loaders: [
      // the index.html file will be copied to dist/
      { test: /index\.html$/, loader: "file?name=index.html" },
      // css will be added to style tags in head
      { test: /\.css$/,    loader: 'style!css' },
      // images will be copied to the images dir
      { test: /\.png$/,    loader: 'file?prefix=images/' }
    ]
  }
};
