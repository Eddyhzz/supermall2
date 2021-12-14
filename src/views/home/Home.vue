<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
<!--   <home-swiper :banners="banners"></home-swiper>-->
    <!-- ref 是用于定位元素和取到组件的内容，:是绑定属性 @是绑定方法-->
    <TabControl :titles="['流行','新款','精选']" @tabClick="tabClick" ref="tabControl1"
                class="tab-control" v-show="isTabFixed"></TabControl>
      <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll" :pull-up-load="true" @pullingUp="loadMore">
        <HomeSwiper :banners="banners" @swiperImageLoad="swiperImageLoad"></HomeSwiper>
        <RecommendView :recommends="recommends"></RecommendView>
        <feature-view></feature-view>
        <TabControl :titles="['流行','新款','精选']" @tabClick="tabClick" ref="tabControl2"></TabControl>
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
// import {debounce} from "../../common/utils";
import {getHomeMultidata,getHomeGoods} from "../../network/home";
import Scroll from "../../components/common/scroll/Scroll";
import {itemListenerMixin} from "../../common/mixin";

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
          BackTop,
        },
        mixins:[itemListenerMixin],
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
            isShow:false,
            tabOffsetTop:0,
            isTabFixed:false,
            saveY : 0,
          }
        },
        computed:{
          showGoods(){
            return this.goods[this.currentType].list
          }
        },
          activated(){
            this.$refs.scroll.scrollTo(0,this.saveY,0)
            this.$refs.scroll.refresh()
          },
          deactivated(){
          //保存Y值
            this.saveY = this.$refs.scroll.getScrollY()

            //取消全局事件的监听
            this.$bus.$off('itemImageLoad',this.itemImgListener)
          },
        created() {
          // 请求多个数据
          this.getHomeMultidata()

          this.getHomeGoods('pop')
          this.getHomeGoods('new')
          this.getHomeGoods('sell')

          // this.$bus.$on('itemImageLoad', () => {
          //   this.$refs.scroll.refresh()
          // })
        },
        mounted() {
         // 3.监听图片加载完成
         //  const refresh = debounce(this.$refs.scroll.refresh,100)
         //  ///对监听的时间进行保存
         //  this.itemImgListener = () => {
         //    refresh(20,30)
         //  }
         //  this.$bus.$on('itemImageLoad',this.itemImgListener)
    //        console.log(this.$refs.tabControl.$el.offsetTop);
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
              this.$refs.tabControl1.currentIndex = index
              this.$refs.tabControl2.currentIndex = index
            // console.log(index);

          },
          backClick(){
            this.$refs.scroll.scrollTo(0,0,500)
          },
          contentScroll(position){
            this.isShow = -position.y > 1000
            // console.log(position)
            this.isTabFixed = (-position.y) > this.tabOffsetTop
          },
          loadMore(){
            this.getHomeGoods(this.currentType)
          },
          swiperImageLoad(){
            this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
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
    position: relative;
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

  /*.fixed{*/
  /*  position: fixed;*/
  /*  top: 44px;*/
  /*  left: 0;*/
  /*  right: 0;*/
  /*}*/
  /*.content{*/
  /*  height: calc(100% - 49px);*/
  /*  overflow: hidden;*/
  /*}*/
</style>