<template>
    <div id="app">
        <multi-select v-if="optionStrings != null"
        :options="optionStrings"
        :closeOnSelect="false"
        :hideSelected="true"
        :searcheable="true"
        :label = "'fdsfdsa'"
       
        v-model="selectedString"
        ></multi-select>
        <pre style="background-color: lightgrey">{{selectedString}}</pre>

        <multi-select v-if="optionObjects != null"
        :options="optionObjects"
        :searcheable="true"
        :placeHolder="'Search!'"
        :multiselect="true"
        :closeOnSelect="false"
        :label = "'Pais'"
        :removeSelection="true"
        :clearSearchOnSelect="false"
        v-model="selectedObject"
        ></multi-select>
        <pre style="background-color: lightgrey">{{selectedObject}}</pre>


        <multi-select v-if="optionPokemon != null"
        :options="optionPokemon"
        :searcheable="true"
        :placeHolder="'Search!'"
        :multiselect="true"
        :closeOnSelect="false"
        :label = "'nome'"
        :removeSelection="true"
        :clearSearchOnSelect="false"
        v-model="selectedPokemon"
        >
            <template slot="option-slot" scope="props">
                <div>
                    <img :src="props.option.foto">
                    <div style="inline-block;">
                        {{props.option.nome}}
                        <hr>
                        <span v-for="(tipo, index) in props.option.tipo" :key="index" class="tipo-pokemon" :class="tipo">{{tipo}}</span>
                    </div>
                </div>
            </template>
        </multi-select>
        <pre style="background-color: lightgrey">{{selectedPokemon}}</pre>
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
            optionPokemon: [{nome: 'Pikachu', tipo: ['elétrico'], foto: 'https://img.pokemondb.net/sprites/omega-ruby-alpha-sapphire/dex/normal/pikachu.png'}, {nome: 'Charizard', tipo: ['fogo'], foto: 'https://img.pokemondb.net/sprites/omega-ruby-alpha-sapphire/dex/normal/charizard.png'}, {nome: 'Miau', tipo: ['normal'], foto: 'https://img.pokemondb.net/sprites/omega-ruby-alpha-sapphire/dex/normal/meowth.png'}, {nome: 'Scyther', tipo: ['inseto', 'voador'], foto: 'https://img.pokemondb.net/sprites/omega-ruby-alpha-sapphire/dex/normal/scyther.png'}],
            selectedString: null,
            selectedObject: null,
            selectedPokemon: null
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

    .tipo-pokemon{
        color: white;
        border-radius: 10px;
        padding: 5px;
        box-shadow: 2px 2px 5px #888888;
        margin-right: 5px;
    }

    .fogo{
        background-color: #f08030;
    }

    .normal{
        background-color: #a8a878
    }

    .inseto{
        background-color: #a8b820;
    }

    .voador{
        background-color: #a890f0;
    }

    .elétrico{
        background-color: #f8d030;
    }
</style>
