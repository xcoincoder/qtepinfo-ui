<template>
  <nav class="navbar">
    <div class="navbar-brand is-size-4">
      <nuxt-link to="/" class="navbar-item navbar-logo">
        <span class="qtep-icon qtep-icon--qtep" /> qtep.info
      </nuxt-link>
      <button type="button" class="button navbar-burger" @click="showMenu = !showMenu">
        <span></span><span></span><span></span>
      </button>
    </div>
    <div class="navbar-menu" :class="{'is-active': showMenu}">
      <div class="navbar-start is-uppercase">
        <AttributeInjector class="navbar-item" @click.native="showMenu = !showMenu">
          <nuxt-link to="/block">{{ $tc('blockchain.block', 2) }}</nuxt-link>
          <nuxt-link to="/contract/tokens">{{ $tc('blockchain.token') }}</nuxt-link>
          <div class="has-dropdown is-hoverable">
            <nuxt-link to="/misc/charts" class="navbar-link">{{ $t('misc.misc') }}</nuxt-link>
            <div class="navbar-dropdown is-boxed">
              <nuxt-link to="/misc/charts" class="navbar-item">
                {{ $t('misc.charts_title') }}
              </nuxt-link>
              <nuxt-link to="/misc/rich-list" class="navbar-item">
                {{ $t('misc.rich_list_title') }}
              </nuxt-link>
              <nuxt-link to="/misc/biggest-miners" class="navbar-item">
                {{ $t('misc.biggest_miners_title') }}
              </nuxt-link>
              <nuxt-link to="/misc/stake-calculator" class="navbar-item">
                {{ $t('misc.stake_calculator.title') }}
              </nuxt-link>
              <nuxt-link to="/misc/raw-tx" class="navbar-item">
                Send Raw Transaction
              </nuxt-link>
            </div>
          </div>
        </AttributeInjector>
      </div>
      <form class="navbar-end" @submit.prevent="search">
        <div class="navbar-item input-item">
          <input type="text" class="input" v-model="searchString" :placeholder="$t('nav.search')">
          <button type="submit" class="button is-qtep" :class="{'is-loading': searching}">
            <Icon icon="search" />
          </button>
        </div>
      </form>
    </div>
  </nav>
</template>

<script>
  import {get as qtepinfoGet} from '@/services/qtepinfo-api'

  export default {
    data() {
      return {
        showMenu: false,
        searchString: '',
        searching: false
      }
    },
    methods: {
      async search() {
        let searchString = this.searchString.trim()
        if (!searchString || this.searching) {
          return
        }
        this.searching = true
        try {
          let {type, id, address} = await qtepinfoGet(`/search`, {params: {query: searchString}})
          switch (type) {
          case 'address':
            this.searchString = ''
            this.$router.push(`/address/${searchString}`)
            break
          case 'block':
            this.searchString = ''
            this.$router.push(`/block/${searchString}`)
            break
          case 'contract':
          case 'qrc20':
          case 'qrc721':
            this.searchString = ''
            if (address) {
              this.$router.push(`/contract/${address}`)
            } else {
              this.$router.push(`/contract/${searchString}`)
            }
            break
          case 'transaction':
            this.searchString = ''
            this.$router.push(`/tx/${searchString}`)
            break
          }
        } catch (err) {}
        this.showMenu = false
        this.searching = false
      }
    }
  }
</script>

<style lang="less" scoped>
  .navbar-logo {
    display: inline-block;
    .qtep-icon {
      vertical-align: middle;
    }
  }
  .navbar-end {
    flex: auto;
    align-items: center;
    .navbar-item {
      flex: auto;
      position: relative;
      input {
        padding-right: 3em;
      }
      button {
        position: absolute;
        top: 0.5em;
        right: 0;
      }
    }
  }
</style>
