var webpack = require('webpack');

module.exports = {
    entry: './js/app.js',
    output: {
        filename: './public/app.js'
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue',
            'vue-router': 'vue-router/dist/vue-router',
            'vue-resource': 'vue-resource/dist/vue-resource'
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            Vue: 'vue',
            VueRouter: 'vue-router',
            VueResource: 'vue-resource',
        })
    ],
    module: {
        rules: [
//            {
//                test: require.resolve('vue'),
//                use: 'imports-loader?this=>window'
//            },
            {
                test: require.resolve('vue'),
                use: 'exports-loader?Vue'
            },
            {
                test: require.resolve('vue-router'),
                use: 'exports-loader?VueRouter'
            },
            {
                test: require.resolve('vue-resource'),
                use: 'exports-loader?VueResource'
            }
        ]
    }
};