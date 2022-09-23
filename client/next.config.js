/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  // next.config.js
  images: {
    domains: [
      process.env.APP_DOMAIN,
      'www.gravatar.com',
      'res.cloudinary.com',
      'media3.giphy.com',
      'media1.giphy.com',
      'media0.giphy.com',
      'media3.giphy.com',
      'media4.giphy.com',
      'media2.giphy.com',
    ],
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: { and: [/\.(js|ts|md)x?$/] },
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            prettier: false,
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: { removeViewBox: false },
                  },
                },
              ],
            },
            titleProp: true,
          },
        },
      ],
    });
    return config;
  },
};
