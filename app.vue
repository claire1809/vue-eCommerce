<template>
    <div class="container">
        <div class="nav">
            <router-link to="/index"><span>电商网站示例</span></router-link>
            <span class="cart">购物车({{inCart}})</span>
        </div>
        <router-view></router-view>

        <!-- <div class="filter-section">
            品牌：
            <ul>
                <li v-for="(brand,index) in brands" :key="index" 
                    @click="brandFilter(index)" :class="{active:brand.isActive}">
                    {{brand.name}}
                </li>
            </ul><br>
            颜色：
            <ul>
                <li v-for="(color,index) in colors" :key="index" 
                    @click="colorFilter(index)" :class="{active:color.isActive}">
                    {{color.name}}
                </li>
            </ul><br>
            排序：
            <ul>
                <li v-for="(order,index) in orders" :key="index"
                    @click="inOrders(index)" :class="{active:order.isActive}">
                    {{order.name}}
                    <span v-show="order.name === '销量' && order.isActive">↓</span>
                    <span v-show="order.name === '价格' && order.isActive && order.current === 'desc'">↓</span>
                    <span v-show="order.name === '价格' && order.isActive && order.current === 'asc'">↑</span>

                </li>
            </ul><br>
        </div>
        <div class="goods">
            <product v-for="product in products" :key="product.id" :value="product" :colorInfo="colorsTo"
                     @tocart="addToCart"></product>
            
            <div v-for="product in products" :key="product.id" class="good-container" >
                <img :src="product.image" /><br>
                <b>{{product.name}}</b><br>
                <span class="show-color" :style={backgroundColor:colorsTo[product.color]}></span><br>
                <span>¥{{product.cost}}</span><br>
                <span class="to-cart" @click="addToCart(product)">加入购物车</span>
            </div>
        </div> -->
    </div>
</template>
<script>
    import product from './components/product.vue';

    import axios from 'axios';
    export default {
        components: {
            product
        },
        data() {
            return {
                orgProducts: [],
                products: [],
                cart: [],
                inCart: 0,
                brands: [
                    {
                        name: 'Apple',
                        isActive: false
                    },{
                        name: 'Beats',
                        isActive: false
                    },{
                        name: 'Sonos',
                        isActive: false
                    },{
                        name: 'B&O',
                        isActive: false
                    }, {
                        name: 'Bose',
                        isActive: false
                    }
                ],
                colors: [
                    {
                        name: '白色',
                        isActive: false
                    },{
                        name: '金色',
                        isActive: false
                    },{
                        name: '红色',
                        isActive: false
                    },{
                        name: '蓝色',
                        isActive: false
                    },
                ],
                orders: [
                    {
                        name: '默认',
                        isActive: true,
                        order: 'default'
                    },{
                        name: '销量',
                        isActive: false,
                        order: 'sales'
                    },{
                        name: '价格',
                        isActive: false,
                        order: 'cost',
                        current: 'desc'
                    }
                ],
                colorsTo: {
                    "白色": "#fff",
                    "金色": "rgb(218, 194, 114)",
                    "红色": "#f00",
                    "蓝色": "#00f"
                }
            }
        },
        methods: {
            getProducts: function() {
                axios.get('/static/products.json').then(res => {
                    this.orgProducts = res.data;
                    this.products = clone(res.data);
                });
            },
            handleHover: function(good) {
                good.selected = true;
            },
            handleOut: function(good) {
                good.selected = false;
            },
            addToCart(product) {
                let isExist = false;
                if(this.cart.length === 0) {
                    this.cart.push({
                        'id': product.id,
                        'count': 1
                    });
                } else {
                    for(let p in this.cart) {
                        if(this.cart[p].id === product.id) {
                            isExist = true;
                            this.cart[p].count += 1;
                        }
                    }
                    if(!isExist) {
                        this.cart.push({
                            'id': product.id,
                            'count': 1
                        });
                    }
                }
                this.inCart += 1;
            },
            brandFilter: function(index) {
                if(this.brands[index].isActive) {
                    this.brands[index].isActive = false;
                    this.products = [];
                    this.products = clone(this.orgProducts);
                } else {
                    for(let b in this.brands) {
                        this.brands[b].isActive = false;
                    }
                    this.brands[index].isActive = true;
                    let filter = this.brands[index].name;
                    this.products = [];
                    this.products = this.orgProducts.filter(m => {
                        return m.brand === filter;
                    });
                }
                this.colorFilterNow();
                this.inOrdersNow();
            },
            brandFilterNow: function() {
                for(let i in this.brands) {
                    if(this.brands[i].isActive) {
                        this.products = this.products.filter(m => {
                            return m.brand === this.brands[i].name;
                        });
                    }
                }
            },
            colorFilterNow: function() {
                for(let i in this.colors) {
                    if(this.colors[i].isActive) {
                        this.products = this.products.filter(m => {
                            return m.color === this.colors[i].name;
                        });
                    }
                }
            },
            inOrdersNow: function() {
                for(let i in this.orders) {
                    if(this.orders[i].isActive) {
                        if(this.orders[i].name === '默认') {
                            this.products.sort(compareAsc('id'));
                        } else if (this.orders[i].name === '销量') {
                            this.products.sort(compareDesc('sales'));
                        } else if (this.orders[i].name === '价格') {
                            if(this.orders[i].current === 'asc') {
                                this.products.sort(compareAsc('cost'));
                            } else {
                                this.products.sort(compareDesc('cost'));
                            }
                        }
                    }
                }
            },
            colorFilter: function(index) {
                if(this.colors[index].isActive) {
                    this.colors[index].isActive = false;
                    this.products = clone(this.orgProducts);
                    this.products.sort(compareAsc('id'));
                } else {
                    for(let c in this.colors) {
                        this.colors[c].isActive = false;
                    }
                    this.colors[index].isActive = true;
                    let filter = this.colors[index].name;
                    this.products = [];
                    this.products = this.orgProducts.filter(m => {
                        return m.color === filter;
                    });
                }
                this.brandFilterNow();
                this.inOrdersNow();
            },
            inOrders: function(index) {
                this.brandFilterNow();
                this.colorFilterNow();
                if(index === 0) {
                    // this.products = [];
                    // this.products = clone(this.orgProducts);
                    for(let m in this.orders) {
                        this.orders[m].isActive = false;
                    }
                    this.orders[index].isActive = true;
                    this.products.sort(compareAsc('id'));
                } else if(index === 1) {
                    if(this.orders[index].isActive) {
                        return;
                    }
                    this.products.sort(compareDesc('sales'));
                    for(let m in this.orders) {
                        this.orders[m].isActive = false;
                    }
                    this.orders[index].isActive = true;
                } else if(index === 2) {
                    if(!this.orders[index].isActive) {
                        this.orders[index].current = 'desc';
                        for(let m in this.orders) {
                            this.orders[m].isActive = false;
                        }
                        this.orders[index].isActive = true;
                        this.products.sort(compareDesc('cost'));
                    } else {
                        if(this.orders[index].current === 'desc') {
                            this.orders[index].current = 'asc';
                            this.products.sort(compareAsc('cost'));
                        } else {
                            this.orders[index].current = 'desc';
                            this.products.sort(compareDesc('cost'));
                        }
                    }
                }


            }
        },
        mounted() {
            this.getProducts();
        }
    }

    function clone(obj) {
        let copy = [];
        for(let attr in obj) {
            copy[attr] = typeof(obj[attr]) === 'object' ? clone(obj[attr]) : obj[attr];
        }
        return copy;       
    }
    function compareDesc(p) {
        return function(m,n) {
            return n[p] - m[p];
        };
    }
    function compareAsc(p) {
        return function(m,n) {
            return m[p] - n[p];
        }
    }
</script>

<style>
    div, span, ul, li {
        padding:0;
        margin:0;
    }
    ul, li {
        list-style: none;
    }
    .cart {
        display: block;
        float:right;
    }
    .nav {
        height: 50px;
        line-height: 50px;
        background-color: #ff8800;
        padding: 0px 20px;
    }
    .container {
        background-color: #cee;
    }
    .filter-section {
        padding:10px;
        background-color: #fff;
        border-radius: 5px;
        margin: 20px 10px 30px 20px;
    }
    .filter-section li {
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-left: 10px;
        margin-top:10px;
        cursor: pointer;
    }
    .filter-section li.active {
        background-color: #f00;
        color: #fff;
    }
    .filter-section ul,li {
        display: inline-block;
    }
    .goods {
        margin: 0px 10px 20px 20px;
        background-color: #cee;
        overflow: auto;
        clear:both;
    }
    .goods div {
        width:300px;
        height:300px;
        border:1px solid #ccc;
        border-radius: 5px;
        background-color: #fff;
        float: left;
        text-align: center;
        margin-right:20px;
        margin-top:20px;
        position:relative;
        cursor: pointer;
    }
    .goods img {
        width: 200px;
        height: 200px;
    }
    .goods .show-color {
        display:inline-block;
        width:10px;
        height:10px;
        border: 1px solid black;
        border-radius: 50%;
    }
    .to-cart {
        position:absolute;
        top:0px;
        right:0px;
        /* border:1px solid black; */
        border-radius: 5px;
        background-color:#2d8cf0;
        color:#fff;
        padding:5px;
        font-size:14px;
        display:none;
    }

    .good-container:hover .to-cart{
        display:block;
    }
    
    .product-detail div {
        float:left;
    }
    .product-detail .img {
        width:50%;
        height:500px;
        padding-left: 200px;
    }
    .product-detail .info {
        text-align: center;
        padding-top: 120px;

    }
    .product-detail .name {
        font-size:30px;
        font-weight: bold;
    }
    .product-detail .price {
        color: #f00;
    }
    .product-detail .btn {
        display: block;
        width:200px;
        height:30px;
        border:1px solid #2d8cf0;
        border-radius: 3px;
        background-color: #2d8cf0;
        line-height: 30px;
        color: #fff;
    }
</style>>
