<template>
    <div class="main">
        <el-container>
            <el-aside width="250px">
                <h1>GET</h1>
                <el-button type="primary" round>添加接口</el-button>
                <h5 v-for="(item, index) of list" @click="listClick(item.id)">{{item.name}}</h5>
            </el-aside>
            <el-main>
                <h3>内容编辑<el-button type="danger" icon="el-icon-refresh" circle @click="auto"></el-button></h3>
                <codemirror ref="myCm" v-model="codemirrorValue" :options="mode" class="code" @changes="yourCodeChangeMethod"></codemirror>
            </el-main>
        </el-container>
    </div>
</template>

<script type="text/javascript">
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
const CodeMirror = require("codemirror/lib/codemirror.js");
require("codemirror/mode/javascript/javascript");
require("codemirror/addon/hint/javascript-hint.js");
require("codemirror/keymap/vim.js");
export default {
    data() {
        return {
            list: [],
            activeNames: [],
            codemirrorValue: '123',
            mode: {
                mode: { name: "javascript", json: true },
                indentUnit: 4,
                indentWithTabs: true,
                indentWithTabs: 4,
                electricChars: true,
                lineNumbers: true
            }
        };
    },
    mounted() {
        this.getList();
    },
    methods: {
        listClick(id) {
            this.$axios
                .request({
                    url:
                        "https://box.77lemon.top/getJsonById?id=" +id
                })
                .then(res => {
                            this.codemirrorValue = res.data.list.value;
                });
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
        save(id) {
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
        },
        yourCodeChangeMethod(e) {
            console.log("!!!");
        },
        auto(){
            let obj = this.$refs.myCm.codemirror;
            console.log(obj)
            let from={line:0, ch:0};
            let to= {line:obj.lineCount()}
             var cm = obj;
            var outer = cm.getMode(),
                text = cm.getRange(from, to).split("\n");
            var state = CodeMirror.copyState(outer, cm.getTokenAt(from).state);
            var tabSize = cm.getOption("tabSize");

            var out = "",
                lines = 0,
                atSol = from.ch == 0;

            function newline() {
                out += "\n";
                atSol = true;
                ++lines;
            }

            for (var i = 0; i < text.length; ++i) {
                var stream = new CodeMirror.StringStream(text[i], tabSize);
                while (!stream.eol()) {
                    var inner = CodeMirror.innerMode(outer, state);
                    var style = outer.token(stream, state),
                        cur = stream.current();
                    stream.start = stream.pos;
                    if (!atSol || /\S/.test(cur)) {
                        out += cur;
                        atSol = false;
                    }
                    if (!atSol && inner.mode.newlineAfterToken &&
                        inner.mode.newlineAfterToken(style, cur, stream.string.slice(stream.pos) || text[i + 1] || "", inner.state))
                        newline();
                }
                if (!stream.pos && outer.blankLine) outer.blankLine(state);
                if (!atSol) newline();
            }

            cm.operation(function() {
                cm.replaceRange(out, from, to);
                for (var cur = from.line + 1, end = from.line + lines; cur <= end; ++cur)
                    cm.indentLine(cur, "smart");
                cm.setSelection(from, cm.getCursor(false));
            });
        }
    },
    components: {
        codemirror
    }
};
</script>

<style>
body,html,#app{height: 100%;}
body{margin: 0;padding: 0;}
.main{height: 100%;}

.el-aside {
    height: 100%;
    color: #333;
    text-align: center;
    box-sizing: border-box;border-right: 1px solid #e5e5e5;
}

.el-aside h5{
    font-weight: normal;
    border-bottom: 1px solid #e5e5e5;
    padding: 0;
    line-height: 50px;
    margin: 0;
    cursor: pointer;
}

.el-main {height: 100%;
    color: #333;
}


</style>