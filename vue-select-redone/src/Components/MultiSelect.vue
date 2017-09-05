<template>
    <div tabindex="-1" name="multiselect-container" class="multiselect" :class="{'multiselect-opened': opened}" @focus="opened = true" @blur="opened = false" @keydown.up="keyup()" @keydown.down="keydown()">
        <div class="multiselect-box">
            <span v-for="(option, index) in selectedOptions" :key="index">{{option}}</span>
            <div name="seach" v-if="searcheable">
                <input type="text" :placeholder="placeHolder" class="multiselect-search">
            </div>
            <div name="multiselect" v-else>
                {{placeHolder}}
            </div>
        </div>
        <div name="options" class="options" v-show="opened">
            <ul>
                <li 
                v-for="(option, index) in options" 
                :id="`${selectId}-option-${index}`"
                :key="index" class="option" 
                :class="{'hovered-option': index === hoveredIndex, 'hovered-option-selected': selectedOptions.includes(option) && index === hoveredIndex}"
                @mouseover="hoverOption(index, option)"
                @mouseout="hoveredIndex = hoveredOption = null"
                @click="selectOption(hoveredOption)">
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
            hoveredOption: null,
            search: '',
            selectId: null,
            selectedOptions: []
        }
    },

    props:{
        options:{
            type: Array,
            required: true
        },
        placeHolder:{
            default: 'Select'
        },
        searcheable:{
            type: Boolean,
            default: false
        },
        multiselect:{
            type: Boolean,
            default: false
        },
        closeOnSelect:{
            type: Boolean,
            default: true
        }
    },

    methods: {
        hoverOption(index, option){
            if(this.selectedOptions.includes(option)){
                this.hoveredIndex = (index+1) * -1;
            }
            else{
                this.hoveredIndex = index;
            }
            this.hoveredOption = option;

        },
        keyup(){
            if(this.hoveredIndex == null){
                this.hoveredIndex = this.options.length - 1;
            }
            else{
                this.hoveredIndex--;
                if(this.hoveredIndex < 0){
                    this.hoveredIndex = this.options.length - 1;
                }
            }

            this.hoveredOption = this.options[this.hoveredIndex];
            let element = document.getElementById(`${this.selectId}-option-${this.hoveredIndex}`);
            if(!this.isElementVisible(element)){
                element.scrollIntoView(true)
            }
        },
        keydown(){
            if(this.hoveredIndex == null){
                this.hoveredIndex = 0;
            }
            else{
                this.hoveredIndex++;
                if(this.hoveredIndex > this.options.length - 1){
                    this.hoveredIndex = 0;
                }
            }

            this.hoveredOption = this.options[this.hoveredIndex];
            let element = document.getElementById(`${this.selectId}-option-${this.hoveredIndex}`);
            if(!this.isElementVisible(element)){
                element.scrollIntoView(true)
            }
        },
        isElementVisible(el) {
            ;
            let rect = el.getBoundingClientRect(el);
            let vWidth = window.innerWidth || doc.documentElement.clientWidth;
            let vHeight = window.innerHeight || doc.documentElement.clientHeight;
            let efp = function (x, y) { return document.elementFromPoint(x, y) };     

            // Return false if it's not in the viewport
            if (rect.right < 0 || rect.bottom < 0 || rect.left > vWidth || rect.top > vHeight)
                return false;

            // Return true if any of its four corners are visible

            return (
                el.contains(efp(rect.left,  rect.top+1))
            ||  el.contains(efp(rect.right, rect.top))
            ||  el.contains(efp(rect.right, rect.bottom))
            ||  el.contains(efp(rect.left,  rect.bottom))
            );
        },
        selectOption(option){
            if(this.multiselect){
                this.selectedOptions.push(option);
            }
            else{
                this.selectedOptions = [];
                this.selectedOptions.push(option);
            }

            if(this.closeOnSelect){
                this.opened = false;
            }

            this.$emit('input', this.selectedComputed);
        }
    },

    computed:{
        filteredList(){
            let filteredList;

            filteredList = this.options.filter((option) => {
                return option.toString().toUpperCase().includes(this.search.toUpperCase());
            });

            return filteredList;
        },
        selectedComputed(){
            if(this.multiselect){
                return this.selectedOptions;
            }
            else{
                return this.selectedOptions[0];
            }
        }
    },

    created(){
        this.selectId = 'multiselect_' + Math.random().toString(36).substr(2, 9);
    }
}
</script>

<style scoped>
    .multiselect{
        border: 1px solid lightgray;
        border-radius: 10px;
        padding: 10px 5px 10px 5px;
        position: relative;
    }

    .multiselect-opened{
        border-radius: 10px 10px 0 0;
    }

    .multiselect-box{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
    }

    .multiselect-box div{
        flex-grow: 5;
    }

    .multiselect-search{
        border: 0;
        width: 100%;
    }

    .multiselect, .multiselect-search{
        outline-color: transparent;
        outline-style: none;
    }

    .options{
        position: absolute;
        width: 100%;
        left: -1px;
        top: 100%;
        border: 1px solid lightgray;
        border-radius: 0 0 10px 10px;
        overflow: hidden;
        max-height: 100px;
        overflow-y: auto;
        z-index: 2;
        background-color: white;
    }

    .options > ul{
        list-style-type: none;
        margin: 0;
        padding: 0;
        cursor: pointer;
    }

    .option{
        padding: 10px;
    }
    .hovered-option{
        background-color: lightgray;
    }
    .hovered-option-selected{
        background-color: red;
    }
</style>

