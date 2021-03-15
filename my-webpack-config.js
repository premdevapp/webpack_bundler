const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    watch: true,
    mode: "production",
    devtool: "eval-source-map",
    entry: {application:"./src/javascripts/index.js", admin: "./src/javascripts/admin.js" },
    output: {
        filename: mode === "production" ? "[name]-[contenthash].js" : "[name].js",
        path: path.resolve(__dirname, "build")
    },
    resolve: {
        alias: {
            CssFolder: path.resolve(__dirname, 'src/stylesheets/')
        },
        modules: [path.resolve(__dirname, 'src/downloaded_libs') ,'node_modules']
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            },
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                          publicPath: '/build/',
                          hmr: true,
                        },
                      },
                    {
                    loader: 'css-loader',
                    options: {
                      sourceMap: true,
                      importLoaders: 1,
                    }
                    },
                    {
                    loader: "postcss-loader",
                        options: {
                             postcssOptions: {
                                plugins: [
                                    require('autoprefixer')({
                                        overrideBrowserslist: ['last 3 versions', 'ie >9']
                                    })   
                            ]
                }
                }
                }],
            },
            {
                test: /\.s(a|c)ss$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                          publicPath: '/build/',
                          hmr: true,
                        },
                      },
                    {
                      loader: 'css-loader',
                      options: {
                        sourceMap: true,
                        importLoaders: 1,
                      }
                    },
                    {
                        loader: "postcss-loader",
                    options: {
                        postcssOptions: {
                        plugins: [
                            require('autoprefixer')({
                                overrideBrowserslist: ['last 3 versions', 'ie >9']
                            })   
                        ]
                    }
                    }
                    },
                    {
                      loader: 'sass-loader',
                      options: {
                        sourceMap: true,
                    }
                }
                  ],
            },
            {
                test: /\.(woff(2)?|ttf|eot|otf)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                      name: mode === "production" ? '[name]-[hash:7].[ext]': '[name].[ext]',
                      outputPath: 'fonts/'
                    }
                  }
                ]
              },
              {
                test: /\.(png|jpg|gif|svg)$/i,
                use: [
                  {
                    loader: 'url-loader',
                    options: {
                      limit: 8192,
                      name: mode === "production" ? '[name].[hash:7].[ext]' : '[name].[ext]'
                    }
                  }, 
                  {
                      loader: 'image-webpack-loader'
                  }
                ]
              }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/template.html'
        }),
        new WebpackManifestPlugin(),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: mode === "production" ?  '[name]-[contenthash].css' : "[name].css"
        })
    ],
    optimization: {
        minimize: true,
        minimizer: [
            '...',
            new CssMinimizerPlugin({
                minimizerOptions: {
                    preset: [
                      'default',
                      {
                        discardComments: { removeAll: true },
                      },
                    ],
                  },
                sourceMap: true,
              }),
        ]
    }, 

    devServer: {
        port: 9000,
        contentBase: path.resolve(__dirname, 'build'),
        publicPath: '/assets/',
        hot: true
    }
    
}