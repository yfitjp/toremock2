/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        os: false,
        path: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
      };
    }

    // undiciモジュールをトランスパイルから除外
    config.module = {
      ...config.module,
      exprContextCritical: false,
      rules: [
        ...config.module.rules,
        {
          test: /node_modules\/@firebase\/.*\/dist\/.*\.js$/,
          use: ['next-swc-loader'],
        },
      ],
    };

    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['@firebase/storage', '@firebase/auth', 'firebase', 'firebase-admin'],
  },
};

module.exports = nextConfig; 