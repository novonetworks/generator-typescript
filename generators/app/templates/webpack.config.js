const path = require('path')
const fs = require('fs')
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const nodeExternals = require('webpack-node-externals')

// Paths
const appBuild = resolveApp('dist')
const appTsConfig = resolveApp('tsconfig.json')
const appTsLint = resolveApp('tslint.json')
const appIndexJs = resolveApp('src/index.ts')
const appSrc = resolveApp('src')

module.exports = {
    mode: 'production',
    target: 'node',
    externals: [nodeExternals()],
    entry: [appIndexJs],
    output: {
        path: appBuild,
        filename: 'index.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx'],
        plugins: [new TsconfigPathsPlugin({ configFile: appTsConfig })]
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                include: appSrc,
                use: [
                    {
                        loader: require.resolve('ts-loader'),
                        options: {
                            // disable type checker - we will use it in fork plugin
                            transpileOnly: true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            async: false,
            watch: appSrc,
            tsconfig: appTsConfig,
            tslint: appTsLint
        })
    ]
}
