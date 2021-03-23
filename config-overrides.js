module.exports = {
  webpack: function (config, env) {
    let is_prod = env === "production";
    config.output.filename = is_prod ? "[name].[contenthash:8].js" : "[name].[hash:8].js";
    return config;
  },
};
