<template>
    <div class="product-detail">
        {{$route.params.id}}
        <div class="img">
            <img src="../images/1.png" >
        </div>
        <div class="info">
            <span class="name">{{product.name}}</span><br>
            <span class="price">¥{{product.cost}}</span><br>
            <span class="btn">加入购物车</span>
        </div>

    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        data() {
            return {
                products: [],
                product: []
            }
        },
        methods: {
            getProduct: function() {
                axios.get('/static/products.json').then(res => {
                    this.products = res.data;
                    console.log("res" + res.data);
                    console.log(this.products);
                    console.log(this.$route.params.id);
                    this.product = [];
                    for(let i in this.products) {
                        console.log(this.products[i])
                        if(this.products[i].id === this.$route.params.id) {
                            this.product = this.products[i];
                        }
                    }
                });
                
            }
        },
        mounted() {
            this.getProduct();
        }
    }
</script>

<style scoped>

</style>