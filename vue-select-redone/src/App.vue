<template>
    <div id="app">
        <multi-select 
        :options="optionStrings"
        :closeOnSelect="false"
        v-model="selectedString"
        ></multi-select>
        <pre style="background-color: lightgrey">{{selectedString}}</pre>

        <multi-select 
        :options="optionObjects"
        :searcheable="true"
        :placeHolder="'Click to Select!'"
        :multiselect="true"
        v-model="selectedObject"
        ></multi-select>
        <pre style="background-color: lightgrey">{{selectedObject}}</pre>
    </div>
</template>

<script>
import MultiSelect from './Components/MultiSelect.vue';

export default {
    name: 'app',
    data () {
        return {
            optionObjects: null,
            optionNumbers: null,
            optionStrings: null,
            selectedString: null,
            selectedObject: null
        }
    },
    components:{
        MultiSelect
    },
    created(){
        this.jsonp("http://api.londrinaweb.com.br/PUC/Paisesv2/0/1000", null, (err, data) => {
            if (err) {
                console.error(err.message);
            } else {
                this.optionObjects = data;
                this.optionNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10.9];
                this.optionStrings = ["apple", "banana", "orange", "pineaple", "peach"];
            }
        });
    }
}
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
