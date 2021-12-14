<template>
  <div class="bottom-bar">
      <div class="check-content">
        <check-button
            :is-checked="isSelectAll"
            class="check-button" @click.native="checkClick"></check-button>
        <span>全选</span>
      </div>

    <div class="price">
      合计: {{totalPrice}}
    </div>

    <div class="calculate" @click="calcClick">
        去计算: {{checkLength}}
    </div>
  </div>
</template>

<script>
import CheckButton from "../../../components/content/checkButton/CheckButton";
  export default {
    name: "CartBottomBar",
    components:{
      CheckButton
    },
    computed:{
      totalPrice(){
        return '￥' + this.$store.state.cartList.filter( item => {
          return item.checked
            }).reduce((preValue,item) => {
              return preValue + item.price * item.count
        },0).toFixed(2)
      },
      checkLength() {
        return this.$store.state.cartList.filter(item => item.checked).length
      },
      isSelectAll(){
          if (this.$store.state.cartList.length === 0) return false
          return !(this.$store.state.cartList.filter(item => !item.checked).length)
      }
    },
    methods:{
      checkClick(){
          if (this.isSelectAll){
            this.$store.state.cartList.forEach(item => item.checked = false)
          } else {
            this.$store.state.cartList.forEach(item => item.checked = true)
          }
        // this.$store.state.cartList.forEach(item => item.checked = !this.isSelectAll)
      },
      calcClick() {
        if(!this.isSelectAll){
          this.$toast.show('请选择购买的商品',2000)
        }
      }
    }
  }
</script>

<style scoped>
  .bottom-bar{
    height: 40px;
    /*background-color: red;*/
    position: relative;
    line-height: 40px;
    display: flex;
    border-top: 1px solid #777777;
  }
  .check-content{
    display: flex;
    align-items: center;
    margin-left: 10px;
  }
  .check-button{
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }
  .price{
    margin-left: 50px;
  }

  .calculate{
    position: absolute;
    padding: 0 10px;
    right: 0px;
    /*width: 60px;*/
    background-color: red;
    color: #fff;
    text-align: center;
  }
</style>