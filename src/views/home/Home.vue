<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
<!--   <home-swiper :banners="banners"></home-swiper>-->
      <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll" :pull-up-load="true" @pullingUp="loadMore">
        <HomeSwiper :banners="banners"></HomeSwiper>
        <RecommendView :recommends="recommends"></RecommendView>
        <feature-view></feature-view>
        <TabControl class="tab-control" :titles="['流行','新款','精选']" @tabClick="tabClick"></TabControl>
        <goods-list :goods="showGoods"></goods-list>
      </scroll>
      <BackTop @click.native="backClick" v-show="isShow"></BackTop>
  </div>
</template>

<script>
import NavBar from "../../components/common/navbar/NavBar";
import HomeSwiper from "./childComponents/HomeSwiper";
import RecommendView from "./childComponents/RecommendView";
import FeatureView from "./childComponents/FeatureView";

import TabControl from "../../components/content/tebControl/TabControl";
import GoodsList from "../../components/content/goods/GoodsList";
import BackTop from "../../components/content/backTop/BackTop";

import {getHomeMultidata,getHomeGoods} from "../../network/home";

import Scroll from "../../components/common/scroll/Scroll";

export default {
        name: "Home",
        components:{
          NavBar,
          HomeSwiper,
          RecommendView,
          FeatureView,
          TabControl,
          GoodsList,
          Scroll,
          BackTop
        },
        data(){
          return{
            banners:[],
            recommends:[],
            goods:{
              'pop':{page:0,list:[]},
              'new':{page:0,list:[]},
              'sell':{page:0,list:[]},
            },
            currentType:'pop',
            isShow:false

          }
        },
        computed:{
          showGoods(){
            return this.goods[this.currentType].list
          }
        },
        created() {
          // 请求多个数据
          this.getHomeMultidata()

          this.getHomeGoods('pop')
          this.getHomeGoods('new')
          this.getHomeGoods('sell')

        },
        methods:{
          /**
           * 事件监听相关的方法
           * */
          tabClick(index){
              switch (index){
                case 0:
                  this.currentType ='pop'
                  break
                case 1:
                  this.currentType ='new'
                  break
                case 2:
                  this.currentType ='sell'
                  break
              }
            console.log(index);

          },
          backClick(){
            this.$refs.scroll.scroll.scrollTo(0,0,500)
          },
          contentScroll(position){
            this.isShow = -position.y > 1000
            // console.log(position)
          },
          loadMore(){
            // console.log('上拉加载更多');
            this.getHomeGoods(this.currentType)
            this.$refs.scroll.scroll.refresh()
          },
          //网络请求相关
          getHomeMultidata(){
            getHomeMultidata().then(res => {
              this.banners = res.data.banner.list;
              this.recommends = res.data.recommend.list
            })
          },
          getHomeGoods(type){
            const page = this.goods[type].page + 1
            getHomeGoods(type, page).then(res => {
              this.goods[type].list.push(...res.data.list)
              this.goods[type].page += 1

              this.$refs.scroll.finishPullUp()
            })
          }
        }
}
</script>

<style scoped>
  #home{
    padding-top: 44px;
    height: 100vh;
    position: relative;
  }
  .home-nav{
      background-color: var(--color-tint);
      color: white;
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      z-index: 9;
    }
  .tab-control {
    position: sticky;
    top:44px;
    z-index: 9;
  }
  .content{
    /*height: 300px;*/
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  /*.content{*/
  /*  height: calc(100% - 49px);*/
  /*  overflow: hidden;*/
  /*}*/
</style>