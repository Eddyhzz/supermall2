import {
  ADD_COUNTER,
  ADD_TO_CART
} from "./mutation-types";

export default {
  addCart(context, payload){
    return new Promise(((resolve, reject) => {
      let product = context.state.cartList.find(item => item.iid === payload.iid)

      if (product){
        // product.count += 1
        context.commit(ADD_COUNTER, product)
        resolve('当前的商品数量+1')
        reject('失败')
      }else{
        payload.count = 1
        // context.state.cartList.push(payload)
        context.commit(ADD_TO_CART,payload)
        resolve('添加了新的商品')
        reject('失败')
      }
    }))
    // let oldProduct = null
    // for(let item of state.cartList){
    //   if (item.iid === payload.iid){
    //     oldProduct = item;
    //   }
    // }
  }
}