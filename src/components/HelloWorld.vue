<template>
  <div class="hello">
    <div style="position: absolute;top:2rem;left: 2rem">
<!--      本地文件选择器-->
      <label class="upload-button">
        <span style="font-family: 楷体,sans-serif;font-weight: bold">本地导入</span>
        <input type="file" @change="uploadExcel" accept=".xlsx">
      </label>
<!--      远端文件模态框开关-->
      <button style="position: absolute;left: 6rem" class="origin-upload-button" @click="showModal = true">云端导入</button>
<!--      模态框-->
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 style="color: #285b44">请选择服务器文件</h2>
            <span class="close-button" @click="showModal = false">×</span>
          </div>
          <div class="modal-body">
            <!-- 在这里填充表格内容 -->
            <div class="table-wrapper">
            <table class="scrollable-table">
              <colgroup>
                <col style="width: 3rem;margin-right: 0" /> <!-- ID列的固定宽度 -->
                <col style="width: 10rem;" /> <!-- 表格名称列的宽度 -->
                <col style="width: 10rem;" /> <!-- 创建时间列的宽度 -->
                <col style="width: 10rem;" /> <!-- 最近更新时间列的宽度 -->
                <col style="width: 2rem;" /> <!-- 更新次数列的宽度 -->
              </colgroup>
              <thead>
              <tr>
                <th>ID</th>
                <th>表格名称</th>
                <th>创建时间</th>
                <th>最近更新时间</th>
                <th>更新次数</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item,index) in tableData" :key="item.id" :class="{ 'selected-row': index === selectedRowIndex }" @click="selectRow(item,index)">
                <td>{{ item.id }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.createTime }}</td>
                <td>{{ item.lastUpdated }}</td>
                <td>{{ item.updateCount }}</td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <!-- 可以在这里添加底部按钮、操作等 -->
            <button class="cancel-button" @click="showModal = false">取消</button>
            <button class="confirm-button"  @click="printSelectedName">确认</button>
          </div>
        </div>
        </div>
      </div>
<!--      模态框结束-->
        <button style="left: 2rem" class="download-button" @click="downloadExcel">下载</button>
        <button style="left: 3rem" class="save-button" @click="saveExcel">保存</button>
    </div>
    <div
      id="luckysheet"
      style="margin:0;padding:0;position:absolute;width:100%;left: 0;top: 10%;bottom:0;box-shadow: #2c3e50 1px 1px"
    ></div>

    <div v-show="isMaskShow" style="position: absolute;z-index: 1000;left: 0;top: 0;bottom: 0;right: 0; background: rgba(255, 255, 255, 0.8); text-align: center;font-size: 40px;align-items:center;justify-content: center;display:flex;">Downloading</div>

  </div>
</template>

<script>
import LuckyExcel from 'luckyexcel'
//导入库export.js 这个文件是es6的，不能在普通的HTML文件直接引入js文件（虽然都是js文件，但是有区别，具体请百度es6与es5）！需要把es6转es5才可以直接引入使用！
// eslint-disable-next-line no-unused-vars
import {exportExcel, saveExcel} from './export'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data(){
    return {
      //选中文件
      selected: null,
      //当前激活文件序号
      activeFileId:-1,
      //选中行序号
      selectedRowIndex:-1,
      tableData: [{
          id: 1,
          name: "Money Manager.xlsx",
          url:'https://minio.cnbabylon.com/public/luckysheet/money-manager-2.xlsx',
          createTime: "2023-07-01",
          lastUpdated: "2023-07-05",
          updateCount: 3
        },
        {
          id: 2,
          name: "Activity costs tracker.xlsx",
          url: 'https://minio.cnbabylon.com/public/luckysheet/Activity%20costs%20tracker.xlsx',
          createTime: "2023-07-02",
          lastUpdated: "2023-07-06",
          updateCount: 5
        },{
          id: 3,
          name: "House cleaning checklist.xlsx",
          url: 'https://minio.cnbabylon.com/public/luckysheet/House%20cleaning%20checklist.xlsx',
          createTime: "2023-07-02",
          lastUpdated: "2023-07-06",
          updateCount: 5
        },{
          id: 4,
          name: "Student assignment planner.xlsx",
          url: 'https://minio.cnbabylon.com/public/luckysheet/Student%20assignment%20planner.xlsx',
          createTime: "2023-07-02",
          lastUpdated: "2023-07-06",
          updateCount: 5
        },{
          id: 5,
          name: "Credit card tracker.xlsx",
          url: 'https://minio.cnbabylon.com/public/luckysheet/Credit%20card%20tracker.xlsx',
          createTime: "2023-07-02",
          lastUpdated: "2023-07-06",
          updateCount: 5
        },{
          id: 6,
          name: "Blue timesheet.xlsx",
          url: 'https://minio.cnbabylon.com/public/luckysheet/Blue%20timesheet.xlsx',
          createTime: "2023-07-02",
          lastUpdated: "2023-07-06",
          updateCount: 5
        },{
          id: 7,
          name: "Student calendar (Mon).xlsx",
          url: 'https://minio.cnbabylon.com/public/luckysheet/Student%20calendar%20%28Mon%29.xlsx',
          createTime: "2023-07-02",
          lastUpdated: "2023-07-06",
          updateCount: 5
        },{
          id: 8,
          name: "Blue mileage and expense report.xlsx",
          url: 'https://minio.cnbabylon.com/public/luckysheet/Blue%20mileage%20and%20expense%20report.xlsx',
          createTime: "2023-07-02",
          lastUpdated: "2023-07-06",
          updateCount: 5
        }],
      isMaskShow: false,
      showModal:false,
    }

  },
  mounted() {
    //注册表格
    this.init()
    const that=this
    //修改Ctrl+S热区键
    document.addEventListener("keydown", function(event) {
      // 检查是否按下了Ctrl键和S键
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault(); // 阻止默认的保存行为
        // 调用下载函数
        that.downloadExcel();
      }
    });

    //下边这几行代码可以把luckysheet的logo隐藏掉。但是出于开源精神，请尊重luckysheet的开源作者们的辛勤付出
    //如果实在是需要隐藏掉，请把这段代码移动到init()函数的末尾去。在这里只会在挂载时运行一次，之后重新渲染表格不会生效。
    // let title = document.getElementsByClassName("luckysheet-share-logo");
    // for (let titleElement of title) {
    //   console.log(titleElement)
    //   titleElement.setAttribute("style","background-image:none");
    // }
  },
  methods:{
    //上传文件
    uploadExcel(evt){
        const files = evt.target.files;
        const that=this;
        if(files==null || files.length===0){
            alert("没有等待引入的文件...");
            return;
        }
        let name = files[0].name;
        let suffixArr = name.split("."), suffix = suffixArr[suffixArr.length-1];
        if(suffix!=="xlsx"){
            alert("只支持xlsx后缀的文件！");
            return;
        }
      // eslint-disable-next-line no-unused-vars
        LuckyExcel.transformExcelToLucky(files[0], function(exportJson, luckysheetfile){
            if(exportJson.sheets==null || exportJson.sheets.length===0){
                alert("读取内容失败。当前不支持读取后缀为xls的文件");
                return;
            }
            window.luckysheet.destroy();
            that.init(exportJson.info.name,exportJson.sheets,exportJson.info.name.creator);
        });
    },
    selectExcel(){
        const value = this.selected.url;
        const name = this.selected.name;
        console.log(value)
        console.log(name)
        if(value==""){
            return;
        }
        this.isMaskShow = true;

      // eslint-disable-next-line no-unused-vars
        LuckyExcel.transformExcelToLuckyByUrl(value, name, (exportJson, luckysheetfile) => {

            if(exportJson.sheets==null || exportJson.sheets.length===0){
                alert("读取内容失败。当前不支持读取后缀为xls的文件");
                return;
            }
            this.isMaskShow = false;
            window.luckysheet.destroy();
          this.init(exportJson.info.name,exportJson.sheets,exportJson.info.name.creator);
          this.activeFileId=this.selected.id
        });
    },
    //下载Excel
    downloadExcel(){
      // eslint-disable-next-line no-undef
      exportExcel(luckysheet.getAllSheets(),luckysheet.getWorkbookName().replaceAll(".xlsx",""))
    },
    saveExcel(){
      alert("保存失败！远端服务器不可用！请点击[下载]保存表格")
      // eslint-disable-next-line no-undef
      saveExcel(luckysheet.getAllSheets(),luckysheet.getWorkbookName().replaceAll(".xlsx",""),this.activeFileId)
    },
    init(title='新的表格.xlsx',data=null,userInfo='小狐狸Excel'){
      //配置luckysheet
      const options = {
        container: 'luckysheet', // luckysheet为容器id
        title:title,
        lang: 'zh',
        color:'green',
        data:data,
        userinfo:userInfo,
        showinfobar: true, // 标题部分信息
        showsheetbar: true, // 底部sheet页
        sheetFormulaBar: true, // 是否显示公示栏
        showstatisticBar: true, // 自定义计数栏
        showtoolbar: true, // 默认工具栏都不显示
        enableAddRow: true, // 底部添加行按钮
        showGridLines: 1, //是否显示网格线
        showtoolbarConfig: { // 自定义配置工具栏
          undoRedo: true, // 撤销重做，注意撤消重做是两个按钮，由这一个配置决定显示还是隐藏
          paintFormat: true, // 格式刷
          mergeCell: true // '合并单元格'
        },
        cellRightClickConfig: { // 自定义右键单元格
          insertColumn: true,
          deleteColumn: true,
          hideRow: true,
          hideColumn: true,
          deleteCell: true,
          sort: true,
          filter: true, // 筛选选区
          chart: true, // 图表生成
          image: true, // 插入图片
          link: true, // 插入链接
          data: true,
          matrix: true
        },
        enableAddBackTop: true
      }
      // eslint-disable-next-line
      luckysheet.create(options)
      // alert("加载完成！")
    },
    selectRow(item,index) {
      this.selected=item;
      this.selectedRowIndex = index;
    },
    printSelectedName() {
      console.log(this.selected)
      this.showModal=false;
      if (this.selected) {
        this.selectExcel()
        console.log(this.selected);
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
/*上传按钮*/
.upload-button {
  /* 自定义样式 */
  display: inline-block;
  position: relative;
  overflow: hidden;
  background-color: #42b983;
  color: #fff;
  border: #42b983 1px solid;
  padding: 5px 10px;
  margin-right: 5rem;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}
.upload-button:hover,.origin-upload-button:hover{
  color: #42b983;
  background-color: rgba(66, 185, 131, 0.1);
}

.upload-button span {
  /* 定义按钮文本样式 */
}

.upload-button input[type="file"] {
  /* 调整上传按钮样式 */
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
}
/*远端按钮和模态框*/
.origin-upload-button {
  background-color: #42b983;
  border: #42b983 1px solid;
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}
/*模态框CSS*/
/*模态框遮罩*/
.modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100000;
}
/*模态框内容*/
.modal-content {
  background-color: #fff;
  position: absolute;
  top: 20vh;
  border-radius: 5px;
  padding: 10px;
  width: 80vw;
  max-height: 60vh;
  overflow: auto;
  border-top: #42b983 2px solid;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.modal-body {
  margin-bottom: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
}

.close-button {
  position: relative;
  top: -1rem;
  color: #42b983;
  font-size: 2rem;
  cursor: pointer;
}

.scrollable-table {
  width: 100%;
}


/*下载按钮*/
.download-button {
  position: relative;
  top: -0.6rem;
  background-color: rgba(252, 0, 0, 0.1);
  color: red;
  border: red 1px solid;
  /*border: none;*/
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}
.download-button:hover{
  background-color: #f34a4a;
  color: white;
}
.download-button:active{
  background-color: #f34a4a;
  color: white;
}
/*保存按钮*/
.save-button {
  position: relative;
  top: -0.6rem;
  background-color: rgba(68, 64, 64, 0.1);
  color: #444040;
  border: #444040 1px solid;
  /*border: none;*/
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}
.save-button:hover{
  background-color: #444040;
  color: white;
}
.save-button:active{
  background-color: #444040;
  color: white;
}

/*模态框按钮*/
.cancel-button,.confirm-button{
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}
.cancel-button {
  margin-right: 10px;
  background-color: rgba(231, 124, 7, 0.1);
  color: #e77c07;
  border: #e77c07 1px solid;
}
.cancel-button:hover{
  background-color: #e77c07;
  color: white;
}
.confirm-button{
  margin-right: 10px;
  background-color: rgba(66, 185, 131, 0.1);
  color: #42b983;
  border: #42b983 1px solid;
}
.confirm-button:hover{
  background-color: #42b983;
  color: white;
}

button{
  font-family: 楷体,sans-serif;
  font-weight: bold;
}
.table-wrapper {
  max-height: 40vh;
  max-width: 100%;
  overflow: auto;
  margin: auto;
  padding: 10px;
}

.scrollable-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}

.scrollable-table thead {
  position: sticky;
  top: -12px;
  background-color: #f2f2f2;
  z-index: 1; /* 设置较高的层级，使其覆盖tbody */
}

.scrollable-table th,
.scrollable-table td {
  padding: 10px;
  /*position: relative;*/
  /*top: -12px;*/
  text-align: left;
  white-space: nowrap; /* 防止内容换行 */
  overflow: hidden;
  text-overflow: ellipsis;
}

.scrollable-table th:first-child,
.scrollable-table td:first-child {
  position: -webkit-sticky; /* 使用-webkit-前缀实现thead和ID列的固定 */
  position: sticky;
  left: -12px;
  background-color: #f2f2f2;
  z-index: 2; /* 让ID列在最顶层 */
  margin-left: -10px; /* 添加负左外边距来消除间隙 */
}

.scrollable-table th:first-child {
  border-right: 1px solid #ddd;
  padding-left: 20px; /* 重新设置固定列的左内边距 */
}

.scrollable-table td:first-child {
  border-right: 1px solid #ddd;
  /*padding-left: 20px;*/
}

thead th:first-child,
tbody td:first-child {
  padding-left: 20px; /* 给固定列留出空间 */
}
/*修改表格行css*/
.selected-row {
  background-color: rgba(66, 185, 131, 0.1); /* 自定义高亮颜色 */
  color: #42b983; /* 自定义高亮文字颜色 */
  overflow-inline: visible;
}
</style>
