<template>
  <div ref="list">
    <Pagination v-if="pages > 1" :pages="pages" :currentPage="currentPage" :getLink="getLink" />
    <table class="table is-fullwidth is-bordered is-striped">
      <thead>
        <tr v-if="responsive.isTablet">
          <th>{{ $t('address.timestamp') }}</th>
          <th>{{ $t('address.transaction_id') }}</th>
          <th>{{ $t('address.balance') }}</th>
          <th>{{ $t('address.changes') }}</th>
        </tr>
        <template v-else>
          <tr>
            <th>{{ $t('address.timestamp') }}</th>
            <th>{{ $t('address.transaction_id') }}</th>
          </tr>
          <tr>
            <th>{{ $t('address.balance') }}</th>
            <th>{{ $t('address.changes') }}</th>
          </tr>
        </template>
      </thead>
      <tbody>
        <template v-for="{id, blockHeight, timestamp, balance, amount} in transactions">
          <tr v-if="responsive.isTablet">
            <td v-if="timestamp">{{ timestamp | timestamp }}</td>
            <td v-else>{{ $t('transaction.mempool') }}</td>
            <td>
              <TransactionLink :transaction="id" />
            </td>
            <td class="monospace">{{ balance | qtep(8) }} QTEP</td>
            <td class="monospace">
              <span v-if="amount > 0">+</span>
              <span v-else-if="amount < 0">-</span>
              <span v-else>&nbsp;</span>
              {{ Math.abs(amount) | qtep(8) }} QTEP
            </td>
          </tr>
          <template v-else>
            <tr>
              <td v-if="timestamp">{{ timestamp | timestamp }}</td>
              <td v-else>{{ $t('transaction.mempool') }}</td>
              <td>
                <TransactionLink :transaction="id" />
              </td>
            </tr>
            <tr>
              <td class="monospace">{{ balance | qtep(8) }} QTEP</td>
              <td class="monospace">
                <span v-if="amount > 0">+</span>
                <span v-else-if="amount < 0">-</span>
                <span v-else>&nbsp;</span>
                {{ Math.abs(amount) | qtep(8) }} QTEP
              </td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
    <Pagination v-if="pages > 1" :pages="pages" :currentPage="currentPage" :getLink="getLink" />
  </div>
</template>

<script>
  import Vue from 'vue'
  import {Responsive} from '@/plugins/mixins'
  import Address from '@/models/address'
  import {RequestError} from '@/services/qtepinfo-api'
  import {scrollIntoView} from '@/utils/dom'

  export default {
    mixins: [Responsive],
    data() {
      return {
        totalCount: 0,
        transactions: [],
        currentPage: Number(this.$route.query.page || 1)
      }
    },
    props: {
      tokens: {type: Array, required: true}
    },
    async asyncData({req, params, query, redirect, error}) {
      try {
        if (query.page && !/^[1-9]\d*$/.test(query.page)) {
          redirect(`/address/${params.id}/balance`)
        }
        let page = Number(query.page || 1)
        let {totalCount, transactions} = await Address.getBalanceTransactions(
          params.id,
          {page: page - 1, pageSize: 100},
          {ip: req && req.ip}
        )
        if (page > 1 && totalCount <= (page - 1) * 100) {
          redirect(`/address/${params.id}/balance`, {page: Math.ceil(totalCount / 100)})
        }
        return {totalCount, transactions}
      } catch (err) {
        if (err instanceof RequestError) {
          error({statusCode: err.code, message: err.message})
        } else {
          error({statusCode: 500, message: err.message})
        }
      }
    },
    computed: {
      id() {
        return this.$route.params.id
      },
      pages() {
        return Math.ceil(this.totalCount / 100)
      }
    },
    methods: {
      getLink(page) {
        return {name: 'address-id-balance', params: {id: this.id}, query: {page}}
      }
    },
    async beforeRouteUpdate(to, from, next) {
      let page = Number(to.query.page || 1)
      let {totalCount, transactions} = await Address.getBalanceTransactions(
        this.id,
        {page: page - 1, pageSize: 100}
      )
      this.totalCount = totalCount
      if (page > this.pages && this.pages > 1) {
        this.$router.push({
          name: 'address-id-balance',
          params: {id: this.id},
          query: {page: Math.ceil(totalCount / 100)}
        })
        return
      }
      this.transactions = transactions
      this.currentPage = page
      next()
      scrollIntoView(this.$refs.list)
    },
    scrollToTop: true
  }
</script>

<style lang="less" scoped>
  .pagination {
    padding: 1em;
  }
</style>
