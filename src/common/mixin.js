import {debounce} from "./utils";

export const itemListenerMixin = {
  data(){
    return{
      itemImgListener : null
    }
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh)
    this.itemImgListener = () => {
      refresh()
    }
    this.$bus.$on('itemImageLoad',this.itemImgListener)
  }
}