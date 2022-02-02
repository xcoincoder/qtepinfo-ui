import * as QtepinfoAPI from '@/services/qtepinfo-api'

class Transaction {
  static get(id, options = {}) {
    if (Array.isArray(id)) {
      if (id.length === 0) {
        return []
      } else {
        return QtepinfoAPI.get('/txs/' + id.join(','), options)
      }
    } else {
      return QtepinfoAPI.get(`/tx/${id}`, options)
    }
  }

  static getBrief(id, options = {}) {
    if (Array.isArray(id)) {
      if (id.length === 0) {
        return []
      } else {
        return QtepinfoAPI.get('/txs/' + id.join(','), {params: {brief: ''}, ...options})
      }
    } else {
      return QtepinfoAPI.get(`/tx/${id}`, {params: {brief: ''}, ...options})
    }
  }

  static getRecentTransactions(options = {}) {
    return QtepinfoAPI.get('/recent-txs', options)
  }

  static sendRawTransaction(data, options = {}) {
    return QtepinfoAPI.post('/tx/send', {rawtx: data}, options)
  }
}

export default Transaction
