<script setup lang="ts">
import { Order } from '@/model/Order';
import CustomTable from '../components/CustomTable.vue'
import { Product } from '@/model/Product';
import { HeaderTable } from '@/model/CommonComponent/HeaderTable';
import { AddButton } from '@/model/CommonComponent/AddButton';
</script>
<template>
    <main>
        <div><b>id:</b> {{item.id}}</div>
        <div><b>Date:</b> {{item.createdDate}}</div>
        <br>
        <!-- <table class="table table-hover table-bordered" style="width: 100%;">
            <thead>
                <tr>
                    <th style="width:5%"><button type="button" class="btn btn-success btn-sm" v-on:click="addProduct()">+</button></th>
                    <th style="width:10%">Index</th>
                    <th style="width:28%">Name</th>
                    <th style="width:28%">Price</th>
                    <th style="width:28%">Quantity</th>
                </tr>
            </thead>
            <tbody class="table-group-divider">
                <tr v-for="(i, index) in item.listProduct">
                    <td><button type="button" class="btn btn-danger btn-sm" v-on:click="removeProduct(index)">-</button></td>
                    <td>{{index + 1}}</td>
                    <td><input type="text" class="form-control" v-model="i.name"></td>
                    <td><input type="number" class="form-control" v-model="i.price"></td>
                    <td><input type="number" class="form-control" v-model="i.quantity"></td>
                </tr>
            </tbody>
        </table> -->
        <!-- <CustomTable :dataSource="item.listProduct" :addProductCallback="()=>{}" :removeProductCallback="()=>{}" >

        </CustomTable> -->
        <CustomTable :classComponent="''" :dataSource="item.listProduct"
        :headerTable="headerTable" :addButton="addButton">

        </CustomTable>
        <button type="button" class="btn btn-success" v-on:click="submit()">Submit ({{ countProduct }} products)</button>
    </main>
</template>
<style>
    table, th, td {
    text-align: center;
    vertical-align: middle;
    padding: 5px;
    }
</style>
<script lang="ts">

export default {
  data() {
    return {item: new Order()}
  },
  computed:{
    countProduct(){
        return this.item.listProduct.length
    },
    getData(){
        return this.item
    },
    headerTable(){
        var headers: Array<HeaderTable> = [
            {
                label: "Action", 
                name: "", 
                isEdit: true, 
                dataType: "", 
                inputType:"",

                onDetail: ()=>{},
                onUpdate: ()=>{},
                onDelete: this.removeProduct,
                width: '10%'
            },
            {
                label: "Product Name", 
                name: "name", 
                isEdit: true, 
                dataType: "string", 
                inputType:"text",
                classComponent:"form-control",
                width: '20%'
            },
            {
                label: "Price", 
                name: "price", 
                isEdit: true, 
                dataType: "number", 
                inputType:"number",
                classComponent:"form-control",
                width: '10%'
            },
            {
                label: "Quantity", 
                name: "quantity", 
                isEdit: true, 
                dataType: "number", 
                inputType:"number",
                classComponent:"form-control",
                width: '10%'
            },
            {
                label: "Category", 
                name: "category", 
                isEdit: true, 
                dataType: "string", 
                inputType:"checkbox",
                classComponent:"form-control",
                dataSource: [
                    {name: "cate 1", value: "cate_1"},
                    {name: "cate 2", value: "cate_2"},
                    {name: "cate 3", value: "cate_3"},
                    {name: "cate 4", value: "cate_4"},
                    {name: "cate 5", value: "cate_5"}
                ],
                isMulti: true,
                width: '10%'
            },
            {
                label: "Status", 
                name: "status", 
                isEdit: true, 
                dataType: "string", 
                inputType:"radio",
                classComponent:"form-control",
                dataSource: [
                    {name: "Status 1", value: "stt_1"},
                    {name: "Status 2", value: "stt_2"},
                    {name: "Status 3", value: "stt_3"},
                    {name: "Status 4", value: "stt_4"},
                    {name: "Status 5", value: "stt_5"}
                ],
                isMulti: true,
                width: '10%'
            },
            {
                label: "Select", 
                name: "select", 
                isEdit: true, 
                dataType: "string",
                inputType:"select",
                classComponent:"form-control",
                dataSource: [
                    {name: "Select 1", value: "select_1"},
                    {name: "Select 2", value: "select_2"},
                    {name: "Select 3", value: "select_3"},
                    {name: "Select 4", value: "select_4"},
                    {name: "Select 5", value: "select_5"}
                ],
                isMulti: true,
                width: '10%'
            },
            {
                label: "Datetime", 
                name: "datetime", 
                isEdit: true, 
                dataType: "datetime", 
                inputType:"datetime-local", //date
                classComponent:"form-control",
                width: '10%',
            }
        ];
        return headers
    },
    addButton(){
        let val= new AddButton()
        val.onClick = this.addProduct
        return val
    }

  },
  methods: {
    makeProduct(){
        return new Product()
    },
    addProduct(){
        var obj = this.makeProduct()
        this.item.listProduct.push(obj)
        console.log(this.item.listProduct)
    },
    removeProduct(index: number){
        this.item.listProduct.splice(index, 1)
        console.log(this.item.listProduct)
    },
    submit(){
        console.log(this.item)
    }
  },
  created() {
  },
};
</script>