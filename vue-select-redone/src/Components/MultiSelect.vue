<template>
    <div tabindex="-1" name="multiselect-container" class="multiselect" :class="{'multiselect-opened': opened}" @focus="opened = true" @blur="opened = false" @keydown.up="keyup()" @keydown.down="keydown()">
        <div name="multiselect">
            {{placeHolder}}
        </div>
        <div name="options" class="options" v-show="opened">
            <ul>
                <li v-for="(option, index) in options" :key="index" class="option" :class="{'hovered-option': index === hoveredIndex}" @mouseover="hoverOption(index, option)" @mouseout="hoveredIndex = null">
                    {{option}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            opened: false,
            hoveredIndex: null,
            hoveredOption: null
        }
    },

    props:{
        options:{
            type: Array,
            required: true
        },
        placeHolder:{
            default: 'Select'
        }
    },

    methods: {
        hoverOption(index, option){
            this.hoveredIndex = index;
            this.hoveredOption = option;
        },
        keyup(){
            if(this.hoveredIndex == null){
                this.hoveredIndex = this.options.length - 1;
            }
            else{
                if(this.hoveredIndex < 0){
                    this.hoveredIndex = this.options.length - 1;
                }
                else{
                    this.hoveredIndex--;
                }
            }
        },
        keydown(){
            if(this.hoveredIndex == null){
                this.hoveredIndex = 0;
            }
            else{
                if(this.hoveredIndex > this.options.length - 1){
                    this.hoveredIndex = 0;
                }
                else{
                    this.hoveredIndex++;
                }
            }
        }
    }
}
</script>

<style scoped>
    .multiselect{
        border: 1px solid lightgray;
        border-radius: 10px;
        padding: 10px 5px 10px 5px;
        position: relative;
        outline-color: transparent;
        outline-style: none;
    }

    .multiselect-opened{
        border-radius: 10px 10px 0 0;
    }

    .options{
        position: absolute;
        width: 100%;
        left: -1px;
        top: 100%;
        border: 1px solid lightgray;
        border-radius: 0 0 10px 10px;
        overflow: hidden;
    }

    .options > ul{
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    .option{
        padding: 10px;
    }
    .hovered-option{
        background-color: lightgray;
        cursor: pointer;
    }
</style>

