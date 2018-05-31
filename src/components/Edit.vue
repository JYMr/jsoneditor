<template>
  <div class="main">
    <el-container>
      <el-aside width="250px">
        <h1>GET</h1> <el-button type="success" icon="el-icon-refresh" circle @click="getList"></el-button>
        <el-button type="primary" round @click="newLink">添加接口</el-button>
        <h5 v-for="(item, index) of list" @click="listClick(item.id)">{{item.name}}</h5>
      </el-aside>
      <el-main>
        <h3>链接</h3>
        <span class="link" v-if="nameValue">https://api.77lemon.top/{{nameValue}}</span>
        <el-row :gutter="20">
          <el-col :span="3">
            <el-select v-model="selectvalue" placeholder="请选择" size="mini">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="12">
            <el-input placeholder="备注" v-model="remark" size="mini"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-input placeholder="请输入链接" v-model="nameValue">
              <template slot="prepend">$url/</template>
            </el-input>
          </el-col>
        </el-row>
        <h3>内容编辑 </h3>
        <codemirror ref="myCm" v-model="codemirrorValue" :options="mode" class="code"></codemirror>
        <el-row class="btn-group">
          <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="del" v-if="id"></el-button>
          <el-button type="info" size="mini" icon="el-icon-refresh" circle @click="refresh"></el-button>
          <el-button type="primary" @click="format">格式化</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </el-row>
      </el-main>
    </el-container>
    <el-dialog title="你确定删除该链接" :visible.sync="dialogVisible" width="50%">
      <h5>请输入该链接，已确认删除</h5>
      <el-input placeholder="请输入链接" v-model="delvalue"></el-input>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="delreq" :disabled="!delstatus">确 定</el-button>
  </span>
    </el-dialog>
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
      id: '',
      nameValue: '',
      codemirrorValue: '{}',
      remark: '',
      options: [{ value: 0, label: 'GET' }],
      selectvalue: 0,
      mode: {
        mode: { name: "javascript", json: true },
        indentUnit: 4,
        indentWithTabs: true,
        indentWithTabs: 4,
        electricChars: true,
        lineNumbers: true
      },
      dialogVisible: false,
      delvalue: '',
      delstatus: false
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    listClick(id) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$axios.request({
        url: "https://box.77lemon.top/getJsonById?id=" + id
      }).then(res => {
        this.codemirrorValue = res.data.list.value;
        this.id = id;
        for (let item of this.list) {
          if (id == item.id) {
            this.nameValue = item.name
          }
        }
        setTimeout(() => {
          this.format();
        }, 0)
        loading.close();
      });
    },
    getList() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$axios.request({
        url: "https://box.77lemon.top/getJson"
      }).then(res => {
        loading.close();
        this.list = res.data.list;
      });
    },
    save(id) {
      if (this.id) {
        //编辑
        this.$axios.request({
          url: 'https://box.77lemon.top/updataJson',
          params: {
            id: this.id,
            name: this.nameValue,
            value: JSON.stringify(this.codemirrorValue)
          }
        }).then(res => {
          if (res.data.status == 0) {
            this.$message({
              message: '修改成功',
              type: 'success'
            });
            this.newLink();
            this.getList();
          }
        })
      } else {
        //新增
        if (this.nameValue == '') {
          return;
        }
        if (this.codemirrorValue == '') {
          return;
        }
        this.$axios.request({
          url: 'https://box.77lemon.top/insJson',
          params: {
            name: this.nameValue,
            value: JSON.stringify(this.codemirrorValue)
          }
        }).then(res => {
          if (res.data.status == 0) {
            this.$message({
              message: '添加成功',
              type: 'success'
            });
            this.newLink();
            this.getList();
          }
        })
      }
    },
    newLink() {
      this.id = "";
      this.nameValue = "";
      this.remark = "";
      this.codemirrorValue = "{}";
    },
    refresh() {
      if (this.id) {

        this.listClick(this.id);
      } else {
        this.codemirrorValue = "";
      }
    },
    del() {
      this.dialogVisible = true;
    },
    delreq() {
      console.log('!!!')
      this.$axios.request({
        url: 'https://box.77lemon.top/delJson',
        params: {
          id: this.id
        }
      }).then(res => {
        if (res.data.status == 0) {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.dialogVisible = false;
          this.delstatus = false;
          this.delvalue = "";
          this.newLink();
          this.getList();
        }
      })
    },
    format() {
      let obj = this.$refs.myCm.codemirror;
      let from = { line: 0, ch: 0 };
      let to = { line: obj.lineCount() }
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
  watch: {
    delvalue(newval, oldval) {
      this.delstatus = newval == this.nameValue
    }
  },
  components: {
    codemirror
  }
};

</script>
<style>
body,
html,
#app {
  height: 100%;
}

body {
  margin: 0;
  padding: 0;
}

.main {
  height: 100%;
}

.el-aside {
  height: 100%;
  color: #333;
  text-align: center;
  box-sizing: border-box;
  border-right: 1px solid #e5e5e5;
}

.el-aside h5 {
  font-weight: normal;
  border-bottom: 1px solid #e5e5e5;
  padding: 0;
  line-height: 50px;
  margin: 0;
  cursor: pointer;
}

.el-main {
  height: 100%;
  color: #333;
}

.el-main h3{
  display: inline-block;
}

.code {
  border: 1px solid #e5e5e5;
}

.btn-group {
  margin-top: 20px;
  text-align: right;
}

.mt16 {
  margin-top: 16px;
}

.el-row {
  margin-bottom: 20px;
}

.link {
  display: inline-block;
  font-size: 12px;
}

</style>
