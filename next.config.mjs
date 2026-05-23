/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { webpack }) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "react-native-fetch-blob": false,
      "react-native-fs": false,
      "react-native": false,
    };
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      fs: false,
      path: false,
      crypto: false,
      vertx: false,
      request: false,
    };
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^(react-native|react-native-fs|react-native-fetch-blob|vertx|request)$/,
      })
    );
    return config;
  },
};

export default nextConfig;
