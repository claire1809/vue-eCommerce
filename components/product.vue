<template>
    <div :key="product.id" class="good-container" >
        <router-link :to="{name: 'details', params: {id: product.id}}">
        <img :src="product.image" /><br>
        <b>{{product.name}}</b><br>
        <span class="show-color" :style={backgroundColor:colorInfo[product.color]}></span><br>
        <span>¥{{product.cost}}</span><br><span>销量：{{product.sales}}</span>
        <span class="to-cart" @click="addToCart(product)">加入购物车</span>
        </router-link>
    </div>
</template>

<script>
    export default {
        props: [
            'value','colorInfo'
        ],
        data() {
            return {
                product: this.value
            }
        },
        methods: {
            addToCart: function(product) {
                this.$emit('tocart', product);
            }
        }
    }
</script>

<style scoped>

</style>