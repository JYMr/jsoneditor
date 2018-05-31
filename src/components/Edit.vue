<template>
    <div>
        <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item :title="'/'+item.name" name="1" v-for="(item, index) of list" :key="index" :name="item.id">
                <codemirror v-model="item.value" :options="mode" class="code" @changes="yourCodeChangeMethod"></codemirror>
                <el-button type="primary" @click="save(item.id)">保存</el-button>
            </el-collapse-item>

        </el-collapse>
    </div>
</template>

<script type="text/javascript">
import { codemirror } from "vue-codemirror-lite";
require("codemirror/mode/javascript/javascript");
require("codemirror/addon/hint/javascript-hint.js");
export default {
    data() {
        return {
            list: [],
            activeNames: [],
            mode: {
                mode: { name: "javascript", json: true },
                indentUnit: 4,
                indentWithTabs: true,
                indentWithTabs: 4,
                electricChars: true
            }
        };
    },
    mounted() {
        this.getList();
    },
    methods: {
        handleChange(val) {
            if (val.length > 0) {
                this.$axios
                    .request({
                        url:
                            "https://box.77lemon.top/getJsonById?id=" +
                            val[val.length - 1]
                    })
                    .then(res => {
                        var _data = this.list;
                        for (var item of _data) {
                            if (item.id == val[val.length - 1]) {
                                item.value = res.data.list.value;
                            }
                        }
                        this.list = _data;
                    });
            }
        },
        getList() {
            this.$axios
                .request({
                    url: "https://box.77lemon.top/getJson"
                })
                .then(res => {
                    this.list = res.data.list;
                });
        },
        save(id){
            this.$axios.request({
                url:
                    "https://box.77lemon.top/getJsonById?id=" +
                    val[val.length - 1]
            }).then(res => {
                var _data = this.list;
                for (var item of _data) {
                    if (item.id == val[val.length - 1]) {
                        item.value = res.data.list.value;
                    }
                }
                this.list = _data;
            });
        },
        yourCodeChangeMethod(e){
            console.log('!!!')
        }
    },
    components: {
        codemirror
    }
};
</script>