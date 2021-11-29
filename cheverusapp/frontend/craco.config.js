const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#F9494F',
              '@component-background': '#efe3ce',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
