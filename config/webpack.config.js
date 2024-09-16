// webpack.config.js
import path from 'path';

module.exports = {
    mode: 'development',
    entry: './src/frontend/index.html', // Update this to your main frontend entry file
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'src/frontend/dist'),
    },
    devServer: {
        contentBase: path.join(__dirname, 'src/frontend'),
        compress: true,
        port: 8080,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'], // Adjust based on your needs
                    },
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
};
