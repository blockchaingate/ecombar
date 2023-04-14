
// Fix: Module not found: Error: Can't resolve 'crypto'
//      Module not found: Error: Can't resolve 'assert'
//      Module not found: Error: Can't resolve 'stream'
//      Module not found: Error: Can't resolve 'querystring'

// 下述似乎没什么作用，改为编辑 package.json 增加
// "browser": {
//   "crypto": false,
//   "assert": false,
//   "stream": false,
//   "querystring": false
// }
// 告诉 webpack 在打包过程中忽略 crypto, assert, stream, querystring 模块


// const path = require('path');

// module.exports = {
//   entry: './src/index.js',
//   output: {
//     filename: 'bundle.js',
//     path: path.resolve(__dirname, 'dist'),
//   },
//   resolve: {
//     fallback: {
//       "crypto": require.resolve("crypto-browserify")
//     }
//   },
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         exclude: /node_modules/,
//         use: {
//           loader: 'babel-loader',
//           options: {
//             presets: ['@babel/preset-env']
//           }
//         }
//       }
//     ]
//   }
// };
