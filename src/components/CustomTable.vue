<template>
    <br><br><br>
    <button style="margin-bottom: 5px;" v-if="addButton" v-bind:class="addButton?.classComponent" v-on:click="addButton?.onClick ? addButton?.onClick(): ()=>{}">{{ addButton?.value }}</button>
    <table v-bind:class="classComponent" class="table table-hover table-bordered" style="width: 100%; overflow: auto;">
        <thead>
            <tr v-if="headerTable && headerTable?.length != 0">
                <td v-for="i in headerTable" v-bind:width="i.width">
                    <b v-bind:class="i.classHeader">{{i.label}}</b>
                </td>
            </tr>
        </thead>
        <tbody class="table-group-divider">
            <tr v-for="(i, index) in dataSource">
                <td v-for="header in headerTable">
                    <div v-if="header.isEdit">
                        <i v-if="header.onDetail" title="Detail" style="cursor: pointer;" v-on:click="header.onDetail ? header.onDetail(index): ()=>{}" class="m-1 bi bi-pencil"></i>
                        <i v-if="header.onUpdate" title="Update" style="cursor: pointer;" v-on:click="header.onUpdate ? header.onUpdate(index): ()=>{}" class="m-1 bi bi-pencil-square"></i>
                        <i v-if="header.onDelete" title="Delete" style="cursor: pointer;" v-on:click="header.onDelete ? header.onDelete(index): ()=>{}" class="m-1 bi bi-x-circle"></i>
                        
                        <input v-if="!header.onDetail 
                        && !header.onUpdate
                        && !header.onDelete
                        && header.inputType != 'select' && header.inputType != 'checkbox' && header.inputType != 'radio'" step="1" v-bind:class="header.classComponent" v-bind:type="header.inputType" v-model="i[header.name as keyof typeof i]">
                        <select v-if="!header.onDetail 
                        && !header.onUpdate
                        && !header.onDelete
                        && header.inputType == 'select'" v-bind:class="header.classComponent" v-model="i[header.name as keyof typeof i]"
                        :multiple="header.isMulti">
                            <option v-for="op in header.dataSource" :value="op.value">
                                {{ op.name }}
                            </option>
                        </select>
                        <div class="form-check"
                        v-if="!header.onDetail
                        && !header.onUpdate
                        && !header.onDelete
                        && header.inputType == 'checkbox'" v-for="ckbox in header.dataSource">
                            <input class="form-check-input" type="checkbox" v-bind:id="'checkbox_'+ckbox.value+'_'+index" :value="ckbox.value" v-model="i[header.name as keyof typeof i]" />
                            <label class="form-check-label" v-bind:for="'checkbox_'+ckbox.value+'_'+index">{{ ckbox.name }}</label>
                        </div>
                        <div class="form-check"
                        v-if="!header.onDetail 
                        && !header.onUpdate
                        && !header.onDelete
                        && header.inputType == 'radio'" v-for="rd in header.dataSource">
                            <input class="form-check-input" type="radio" v-bind:name="header.name+'_'+index" v-bind:id="'radio_'+rd.value+'_'+index" :value="rd.value" v-model="i[header.name as keyof typeof i]">
                            <label class="form-check-label" v-bind:for="'radio_'+rd.value+'_'+index">
                                {{ rd.name }}
                            </label>
                        </div>
                    </div>
                    <div v-else>
                        {{ i[header.name as keyof typeof i] }}
                    </div>
                </td>
            </tr>
        </tbody>
    </table>

</template>
<style>
    table, th, td {
    text-align: center;
    vertical-align: middle;
    padding: 5px;
    }
</style>

<script lang="ts">
import { HeaderTable } from '@/model/CommonComponent/HeaderTable.js';
import { AddButton } from '@/model/CommonComponent/AddButton.js';

export default {
  props: {
        addButton:{
            type: AddButton,
        },
        classComponent: {
            type: String,
            default: ""
        },
        dataSource: {
            type: Array<any>,
            required: true,
            default: new Array<any>()
        },
        headerTable:{
            type: Array<HeaderTable>
        }
        //dataSource: Array<Product>
        //addProductCallback: Function,
        //removeProductCallback: Function,
        //headerTable: Array<HeaderTable>
    },
  computed:{
  },
  methods: {
    // add(){
    //     if(this.addItemCallback){
    //         this.addItemCallback()
    //     }
    // },
    
    // remove(index: number){
    //     if(this.removeItemCallback){
    //         this.removeItemCallback(index)
    //     }
    // }
  },
  created() {
  },
};
</script>
