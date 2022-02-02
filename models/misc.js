import * as QtepinfoAPI from '@/services/qtepinfo-api'

class Misc {
  static info(options = {}) {
    return QtepinfoAPI.get('/info', options)
  }

  static dailyTransactions(options = {}) {
    return QtepinfoAPI.get('/stats/daily-transactions', options)
  }

  static blockInterval(options = {}) {
    return QtepinfoAPI.get('/stats/block-interval', options)
  }

  static coinstake(options = {}) {
    return QtepinfoAPI.get('/stats/coinstake', options)
  }

  static addressGrowth(options = {}) {
    return QtepinfoAPI.get('/stats/address-growth', options)
  }

  static richList({from, to}, options = {}) {
    return QtepinfoAPI.get(`/misc/rich-list`, {params: {page: from / (to - from), pageSize: to - from}, ...options})
  }

  static biggestMiners({from, to}, options = {}) {
    return QtepinfoAPI.get(`/misc/biggest-miners`, {params: {page: from / (to - from), pageSize: to - from}, ...options})
  }
}

export default Misc
