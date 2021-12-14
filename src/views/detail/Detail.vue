<template>
  <div id="detail">
    <DetailNavbar @titleClick="titleClick" class="detail-nav" ref="nav"></DetailNavbar>
    <scroll style="width: 100%" class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
<!--      <ul>-->
<!--        <li v-for="item in $store.state.cartList" :key="item.index">{{item}}</li>-->
<!--      </ul>-->
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :images-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-paraminfo ref="param" :param-info="paramInfo"></detail-paraminfo>
      <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
      <goods-list ref="recommend" :goods="recommends"></goods-list>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
    <BackTop @click.native="backClick" v-show="isShowBackTop"></BackTop>
<!--    <toast :message="message" :show="show"></toast>-->
    <!--    <h2>详情页: {{iid}}</h2>-->
  </div>
</template>

<script>
    import DetailNavbar from "./childComps/DetailNavbar";
    import {getDetail, Goods, GoodsParam, Shop, getRecommend} from "../../network/detail";
    import DetailSwiper from "./childComps/DetailSwiper";
    import DetailBaseInfo from "./childComps/DetailBaseInfo";
    import DetailShopInfo from "./childComps/DetailShopInfo";
    import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
    import DetailParaminfo from "./childComps/DetailParaminfo";
    import Scroll from "../../components/common/scroll/Scroll";
    import DetailCommentInfo from "./childComps/DetailCommentInfo";
    import GoodsList from "../../components/content/goods/GoodsList";
    import DetailBottomBar from "./childComps/DetailBottomBar";
    import {itemListenerMixin} from "../../common/mixin";
    import {debounce} from "../../common/utils";
    import BackTop from "../../components/content/backTop/BackTop";
    import {mapActions} from 'vuex'
    // import Toast from "../../components/common/toast/Toast";
    export default {
      name: "detail",
      components:{
          DetailBottomBar,
          DetailNavbar,
          DetailSwiper,
          DetailBaseInfo,
          DetailShopInfo,
          Scroll,
          DetailGoodsInfo,
          DetailParaminfo,
          DetailCommentInfo,
          GoodsList,
          BackTop,
          // Toast
      },
      mixins: [itemListenerMixin],
      data(){
         return {
           iil : null,
           topImages : [],
           goods: {},
           shop:{},
           detailInfo: {},
           paramInfo:{},
           commentInfo:{},
           recommends: [],
           itemImgListener: null,
           themeTopYs: [],
           getThemeY: [],
           currentIndex: null,
           isShowBackTop : false,
           // message: '',
           // show: false
         }
      },
      methods:{
        ...mapActions(['addCart']),
        imageLoad(){
          this.$refs.scroll.refresh()
          this.getThemeY()
        },
        titleClick(index){
          // console.log(index);
          this.$refs.scroll.scrollTo(0, -this.themeTopYs[index],1000)
        },
        contentScroll(position) {
          // console.log(position);
          const positionY = -position.y

          let length = this.themeTopYs.length
          for(let i = 0;i< length;i++){
            if(this.currentIndex !== i && (i < length -1 && positionY >= this.themeTopYs[i] && positionY <
                this.themeTopYs[i+1] || (i === length -1 && positionY >= this.themeTopYs[i]))){
              this.currentIndex = i;
              console.log(this.currentIndex);
              this.$refs.nav.currentIndex = this.currentIndex
            }
          }

          // 是否显示回到顶部

          this.isShowBackTop= (-position.y) > 1000

        },
        backClick(){
          this.$refs.scroll.scrollTo(0,0,500)
        },
        addToCart() {
            // 1.获取购物车需要展示的信息
            const product = {}
            product.image = this.topImages[0];
            product.title = this.goods.title;
            product.desc = this.goods.desc;
            product.price = this.goods.realPrice;
            product.iid = this.iid;

            // 2.将商品添加到购物车里
            // this.$store.commit('addCart',product)
            this.addCart(product).then(res => {
              // this.show =true
              // this.message = res;
              //
              // setTimeout(() => {
              //   this.show =false
              //   this.message = 'res';
              // },1500)
              this.$toast.show(res,1500)
            })

            // this.$store.dispatch('addCart',product)

        }
      },
      created() {
        this.iid = this.$route.params.iid

        //根据iid请求详情数据
        getDetail(this.iid).then(res => {
          // console.log(res);
          const data = res.result
          this.topImages = data.itemInfo.topImages
          // console.log(this.topImages);

          //获取商品信息
          this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

          //创建店铺信息的对象
          this.shop = new Shop(data.shopInfo)

          //保存商品的详情数据
          this.detailInfo = data.detailInfo

          //获取参数信息
          this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

          //取出评论信息
          if(data.rate.cRate !== 0){
            this.commentInfo = data.rate.list[0]
          }


          this.$nextTick(() => {
            //根据最新的数据，对应的DOM是已经被渲染出来
            //但是图片依然是没有加载完（目前获取到offsetTop不包含其中的图片
            //offsetTop值不对的时候，都是因为图片的问题
          })
        })

        //请求推荐数据
        getRecommend().then(res => {
          this.recommends = res.data.list
        })

        this.getThemeY = debounce(() => {
          this.themeTopYs = []
          this.themeTopYs.push(0)
          this.themeTopYs.push(this.$refs.param.$el.offsetTop)
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
          // console.log(this.themeTopYs);
        },100)
      },
      mounted() {
            const refresh = debounce(this.$refs.scroll.refresh,100)
            this.itemImgListener = () => {
              refresh()
            }
            this.$bus.$on('itemImgLoad',this.itemImgListener)

      },
      updated() {

      },
      destroyed() {
        this.$bus.$off('itemImageLoad',this.itemImgListener)
      }
    }
</script>

<style scoped>
  #detail{
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
  .detail-nav{
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .content{
    height: calc(100% - 44px);
  }
</style>