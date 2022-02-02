import * as QtepinfoAPI from '@/services/qtepinfo-api'

class Address {
  static get(id, options = {}) {
    return QtepinfoAPI.get(`/address/${id}`, options)
  }

  static getBalance(id, options = {}) {
    return QtepinfoAPI.get(`/address/${id}/balance`, options)
  }

  static getUtxo(id, options = {}) {
    return QtepinfoAPI.get(`/address/${id}/utxo`, options)
  }

  static getTransactions(id, {page, pageSize}, options = {}) {
    return QtepinfoAPI.get(`/address/${id}/txs`, {params: {page, pageSize}, ...options})
  }

  static getBalanceTransactions(id, {page, pageSize}, options = {}) {
    return QtepinfoAPI.get(`/address/${id}/balance-history`, {params: {page, pageSize}, ...options})
  }

  static getTokenBalanceTransactions(id, {token, page, pageSize}, options = {}) {
    if (token) {
      return QtepinfoAPI.get(`/address/${id}/qrc20-balance-history/${token}`, {params: {page, pageSize}, ...options})
    } else {
      return QtepinfoAPI.get(`/address/${id}/qrc20-balance-history`, {params: {page, pageSize}, ...options})
    }
  }
}

export default Address
