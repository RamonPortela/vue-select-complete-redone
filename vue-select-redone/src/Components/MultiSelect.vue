<template>
    <div tabindex="-1" name="multiselect-container" class="multiselect" :class="{'multiselect-opened': opened}" @focus="focusSelect()" @blur="blurSelect($event)" @keydown.up.prevent="keyup()" @keydown.down.prevent="keydown()" @keydown.enter.prevent="selectOption(hoveredOption)" @keydown.esc.prevent="blurInput($event)">
        <div class="multiselect-box">
            <span v-for="(option, index) in selectedOptions" :key="index" :class="{tag: multiselect, 'no-tag': !multiselect}">{{option[label] || option}} <span class="tag-close" @click="selectOption(option)" v-if="multiselect">x</span></span>
            <div name="search" v-if="showInput">
                <input type="text" 
                :id="`${selectId}-search`"
                v-model="search" 
                :placeholder="placeHolder" 
                class="multiselect-search" 
                @focus="opened = true" 
                @blur="blurInput($event)">
            </div>
            <div name="multiselect" v-else>
                <span v-if="selectedOptions.length == 0">{{placeHolder}}</span>     
            </div>
        </div>
        <div name="options" class="options" v-show="opened">
            <ul v-if="filteredList.length > 0">
                <li 
                v-for="(option, index) in filteredList" 
                :id="`${selectId}-option-${index}`"
                :key="index" class="option"
                :class="{'hovered-option': index === hoveredIndex, 'hovered-option-selected': selectedOptions.includes(option) && index === hoveredIndex}"
                @mouseover.self="hoverOption(index, option)"
                @mouseout.self.stop="mouseOutOption($event)"
                @click="selectOption(option)">
                    <span v-if="selectedOptions.includes(option) && index === hoveredIndex && removeSelection" class="hovered-option-selected-remove">Remove</span>
                    <slot name="option-slot" :option="option">{{option[label] || option}}</slot>
                </li>
            </ul>
            <div class="option" v-else>
                {{emptyMessage}}
            </div>
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
        },
        removeSelection:{
            type: Boolean,
            default: false
        },
        hideSelected:{
            type: Boolean,
            default: false
        },
        emptyMessage:{
            type: String,
            default: 'The list is empty'
        },
        label:{
            type: String,
            default: null
        },
        clearSearchOnSelect:{
            type: Boolean,
            default: true
        }
    },

    methods: {
        hoverOption(index, option){
            this.hoveredIndex = index;
            this.hoveredOption = option;
        },
        keyup(){
            if(this.hoveredIndex == null){
                this.hoveredIndex = this.filteredList.length - 1;
            }
            else{
                this.hoveredIndex--;
                if(this.hoveredIndex < 0){
                    this.hoveredIndex = this.filteredList.length - 1;
                }
            }

            this.hoveredOption = this.filteredList[this.hoveredIndex];
            let element = document.getElementById(`${this.selectId}-option-${this.hoveredIndex}`);
            if(!this.isElementVisible(element, false)){
                element.parentElement.parentElement.scrollTop = element.offsetTop;
            }
        },
        keydown(){
            if(this.hoveredIndex == null){
                this.hoveredIndex = 0;
            }
            else{
                this.hoveredIndex++;
                if(this.hoveredIndex > this.filteredList.length - 1){
                    this.hoveredIndex = 0;
                }
            }

            this.hoveredOption = this.filteredList[this.hoveredIndex];
            let element = document.getElementById(`${this.selectId}-option-${this.hoveredIndex}`);
            if(!this.isElementVisible(element, true)){
                var rect = element.getBoundingClientRect();
                var rectOptions = element.parentElement.parentElement.getBoundingClientRect();
                var elementHeight = rect.bottom-rect.top;
                var optionsHeight = rectOptions.bottom-rectOptions.top;

                element.parentElement.parentElement.scrollTop = (Number(elementHeight) * this.hoveredIndex) - Number(optionsHeight) + Number(elementHeight);
            }
        },
        isElementVisible(el, down) {
            let elementRect = el.getBoundingClientRect();
            let elementHeight = elementRect.bottom-elementRect.top;
            let elementPosition = el.offsetTop + Number(elementHeight);

            let parentRect = el.parentElement.parentElement.getBoundingClientRect();
            let parentHeight = parentRect.bottom-parentRect.top;

            let visiblePosition;

            if(down){
                if(this.hoveredIndex == 0){
                    return false;
                }

                visiblePosition = parentHeight + el.parentElement.parentElement.scrollTop;

                if(elementPosition < visiblePosition){
                    return true;
                }
                else{
                    return false;
                }
            }
            else{
                if(this.hoveredIndex == this.options.length-1)
                {
                    return false;
                }

                visiblePosition = parentHeight + el.parentElement.parentElement.scrollTop + elementHeight;
                
                if(elementPosition > (Number(visiblePosition) - Number(el.parentElement.parentElement.clientHeight))){
                    return true;
                }
                else{
                    return false;
                }
            }
        },
        focusSelect(){
            this.opened = true;
            this.$nextTick(() => {
                if(this.searcheable){
                    let input = document.getElementById(`${this.selectId}-search`);
                    input.focus();            
                }
            });
        },
        blurSelect(event){
            if(!this.searcheable){
                this.opened = false;
                return;
            }
            let input = document.getElementById(`${this.selectId}-search`);
            if(input === event.relatedTarget){
                this.opened = true;
                input.focus();
            }
            else{
                this.hoveredIndex = null;
                this.hoveredOption = null;
                this.opened = false;
            }
        },
        blurInput(event){
            var clickTarget = event.relatedTarget;
            if(clickTarget != event.path[3]){
                this.hoveredIndex = null;
                this.hoveredOption = null;
                this.opened = false;
                this.search = '';
            }
            event.srcElement.blur();
        },
        mouseOutOption(event)
        {
            this.hoveredIndex = null;
            this.hoveredOption = null;
        },
        selectOption(option){
            if(option == null){
                return;
            }

            if(this.selectedOptions.includes(option)){
                if(this.removeSelection){
                    for(let i = 0; i < this.selectedOptions.length; i++){
                        if(this.label){
                            if(option[this.label] === this.selectedOptions[i][this.label]){
                                this.selectedOptions.splice(i, 1);
                                return;
                            }                            
                        }
                        else{
                            if(option === this.selectedOptions[i]){
                                this.selectedOptions = this.selectedOptions.splice(i, 1);
                                return;
                            }
                        }
                    }
                }
                else{
                    return;
                }
            }

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

            if(this.clearSearchOnSelect){
                this.search = '';
            }

            this.hoveredOption = this.filteredList[this.hoveredIndex];

            this.$emit('input', this.selectedComputed);
        }
    },

    computed:{
        filteredList(){
            let filteredList;
            filteredList = this.options.filter((option) => {
                let searchedTerm = option[this.label] || option


                if(this.hideSelected){
                    if(this.selectedOptions.includes(option))
                    {
                        return false;
                    }
                    else{
                        return searchedTerm.toString().toUpperCase().includes(this.search.toUpperCase());
                    }
                }
                else{
                    return searchedTerm.toString().toUpperCase().includes(this.search.toUpperCase());
                }
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
        },
        showInput(){
            if(!this.searcheable)
                return false;

            if(this.selectedOptions.length == 0){
                return true;
            }

            if(this.selectedOptions.length > 0 && this.opened){
                return true;
            }

            return false;
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

    .multiselect * {
        box-sizing: border-box;
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
        height: 100%;
        font-size: medium;
    }

    .multiselect, .multiselect-search{
        outline-color: transparent;
        outline-style: none;
    }

    .options{
        position: absolute;
        width: calc(100% + 1.5px);
        left: -1px;
        top: 100%;
        border: 1px solid lightgray;
        border-radius: 0 0 10px 10px;
        overflow: hidden;
        max-height: 300px;
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
        position: relative;
        padding: 10px;
    }

    .option *{
        pointer-events: none;
    }

    .hovered-option, option:hover{
        background-color: lightgray;
    }
    .hovered-option-selected{
        background-color: red;
    }
    .hovered-option-selected-remove{
        position: absolute;
        width: 95%;
        text-align: right;
    }
    .no-tag{
        margin-right: 5px;
    }
    .tag{
        border-radius: 10px;
        background-color: lightgray;
        padding: 5px;
        margin: 0 5px 5px 0;
    }
    .tag-close{
        color: #afafaf;
        cursor: pointer;
    }
</style>

