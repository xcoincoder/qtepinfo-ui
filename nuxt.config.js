import webpack from 'webpack'

export default {
  head: {
    titleTemplate: '%s - qtep.info',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no'}
    ]
  },
  css: [
    'bulma/css/bulma.css',
    '@fortawesome/fontawesome-free/css/all.css',
    '@/styles/common.less',
    '@/styles/card.less',
    '@/styles/info-table.less',
    '@/icons/style.css'
  ],
  render: {
    bundleRenderer: {
      shouldPreload: (file, type) => ['script', 'style', 'font'].includes(type)
    }
  },
  build: {
    extend(config, {isServer}) {
      config.module.rules.push({
        test: /\.ya?ml$/,
        type: 'json',
        use: 'yaml-loader'
      })
      config.plugins.push(new webpack.DefinePlugin({
        'process.env.qtepinfoAPIBase': JSON.stringify(process.env.QTEPINFO_API_BASE
          || process.env[isServer ? 'QTEPINFO_API_BASE_SERVER' : 'QTEPINFO_API_BASE_CLIENT']
          || 'http://localhost:7001/'),
        'process.env.qtepinfoWSBase': JSON.stringify(process.env.QTEPINFO_WS_BASE
          || process.env.QTEPINFO_API_BASE_WS
          || '//localhost:7001/'),
        'process.env.network': JSON.stringify(process.env.QTEP_NETWORK || 'mainnet')
      }))
    },
    extractCSS: true,
    postcss: {
      features: {
        customProperties: false
      }
    }
  },
  serverMiddleware: ['~/middleware/ip.js'],
  plugins: [
    '~/plugins/components.js',
    '~/plugins/i18n.js',
    '~/plugins/qtep-utils.js',
    {src: '~/plugins/websocket.js', ssr: false}
  ]
}
