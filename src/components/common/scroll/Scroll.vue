<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

  export default {
    name: "Scroll",
    props:{
      probeType:{
        type:Number,
        default: 0
      },
      pullUpLoad:{
        type:Boolean,
        default: false
      }
    },
    data(){
      return {
        scroll: null
      }
    },
    mounted() {
      this.scroll = new BScroll(this.$refs.wrapper,{
            probeType:this.probeType,
            click:true,
            observeDOM:true,
            pullUpLoad:this.pullUpLoad
      })

      this.scroll.on('scroll',(position) =>{
          this.$emit('scroll',position)
      })

      //监听上拉事件
      this.scroll.on('pullingUp',() => {
        this.$emit('pullingUp')
        console.log('jianting')
      })
    },
    methods:{
      scrollTo(x,y,time=300){
          this.scroll && this.scroll.scrollTo(x,y,time)
      },
      finishPullUp(){
        this.scroll.finishPullUp()
      },
      refresh(){
        // console.log('---');
       this.scroll && this.scroll.refresh()
      },
      getScrollY(){
        return this.scroll ? this.scroll.y : 0
      }
    }
  }
</script>

<style scoped>

</style>