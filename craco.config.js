module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.output.filename = 'static/js/[name].js';
      return webpackConfig;
    },
  },
};
