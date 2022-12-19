module.exports = {
    entry: {
        all: "./src/all.js",
        profile: "./src/profile.js"
    },
    output: {
        filename: "[name].js",
        path: __dirname + "/dist",
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
}
