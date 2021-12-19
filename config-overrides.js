const path = require("path");

module.exports = {
  webpack: function (config, env) {
    let is_prod = env === "production";

    config.resolve.modules = [...(config.resolve.modules || []), path.resolve(__dirname, "src")];
    config.output.filename = is_prod ? "[name].[contenthash:8].js" : "[name].[hash:8].js";
    return config;
  },
};
