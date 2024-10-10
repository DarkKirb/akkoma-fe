// https://github.com/shelljs/shelljs
require("./check-versions")();
require("shelljs/global");
env.NODE_ENV = "production";

var path = require("path");
var config = require("../config");
var webpack = require("webpack");
var webpackConfig = require("./webpack.prod.conf");

console.log(
  "  Tip:\n" +
    "  Built files are meant to be served over an HTTP server.\n" +
    "  Opening index.html over file:// won't work.\n",
);

var assetsPath = path.join(
  config.build.assetsRoot,
  config.build.assetsSubDirectory,
);
rm("-rf", assetsPath);
mkdir("-p", assetsPath);
cp("-R", "static/*", assetsPath);

sed('-i', /'jxl_dec.js/, "'/node_modules/jxl.js/jxl_dec.js", 'node_modules/jxl.js/jxl.js')
sed('-i', /"jxl_dec.wasm/, '"/node_modules/jxl.js/jxl_dec.wasm', 'node_modules/jxl.js/jxl_dec.js')

webpack(webpackConfig, function (err, stats) {
  if (err) throw err;
  process.stdout.write(
    stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
    }) + "\n",
  );
});
