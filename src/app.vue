<style src="./assets/styles/base.css"></style>
<style>
.table {
    width: 100%;
    background: #fff;
    margin:.5em 0;
    border: 1px solid #dedede;
    box-shadow: none;
    border-radius: .28571429rem;
    text-align: left;
    color: rgba(0,0,0,.87);
    border-collapse: separate;
    border-spacing: 0;
}
.table tr td {
    border-top: 1px solid rgba(34,36,38,.1);
    padding: .71428571em;
    text-align: inherit;
    color:#555;
}
  
.table tr td,
.table tr th {
    border-left: 1px solid rgba(34,36,38,.1);
}

.table tr td:first-child,
.table tr th:first-child {
    border-left: none;
}
.table tr:first-child td{
    border-top: none;
}
.table tr:first-child:hover td:first-child{
    border-radius: 3px 0 0 0;
}
.table tr:first-child:hover td:last-child{
    border-radius:0 3px 0 0;
}

.table tr:last-child:hover td:first-child{
    border-radius: 0 0 0  3px;
}
.table tr:last-child:hover td:last-child{
    border-radius:0 0 3px 0;
}

.table.hover tbody tr:hover{
    background-color:#fbfbfb;
}
 

html,body {
    background-color: #fff;
    font-size: 14px;
    font-family: "Helvetica Neue","Arial","PingFang SC","Hiragino Sans GB","STHeiti","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;
    line-height: 100%;
    color: #555;
}
#app{
    overflow: hidden;
    width:100%;
    height:100%;
}
.logo{
    padding:20px;
    cursor: pointer;
}
.weeks{
    padding:20px;
}
.weeks>span{
    border-radius: 2px;
    padding:8px 20px;
    cursor: pointer;
}
.weeks>span.active{
    background-color: #000;
    color:#fff;
}
.weeks>div{
    padding:20px;
}
.weeks>div>a{
    display: inline-block;
    margin:5px;
    padding:8px 15px;
    background:#efefef;
    border-radius: 2px;
}
.weeks>div>a:hover{
    background:#000;
    color:#fff;
}
.uploader{
    text-transform: uppercase;
    font-size: 12px;
}
.time{
    font-size: 12px;
    margin-top: 5px;
}
.size{
    position: relative;
    display: inline-block;
    font-size:10px;
    height:11px;
    line-height: 100%;
    margin-left:5px;
    padding:3px 5px;
    border-radius:2px;
    background:#333;
    color:#fff;    
}
.more{
    margin:20px auto;
    display: block;
    box-shadow: 0 0 0 5px #222;
    width:60px;
    height:60px;
    line-height:60px;
    border-radius: 50%;
    background:#000;
    color:#fff;
}
.loading{
    display:block;
    margin:20px auto;
}
.v-beat{
    -webkit-animation: v-beatStretchDelay 0.7s infinite linear;
            animation: v-beatStretchDelay 0.7s infinite linear;
    -webkit-animation-fill-mode: both;
              animation-fill-mode: both;
    display: inline-block;
    width:10px;
    height:10px;
    background-color: #000;
    border-radius: 50%;
}
.v-beat-odd{
  animation-delay: 0s;
}
.v-beat-even{
  animation-delay: 0.35s;
}
@-webkit-keyframes v-beatStretchDelay{
    50%{
        -webkit-transform: scale(0.75);
                transform: scale(0.75);
        -webkit-opacity: 0.2;             
                opacity: 0.2;
    }
    100%{
        -webkit-transform: scale(1);
                transform: scale(1);
        -webkit-opacity: 1;             
                opacity: 1;
    }
}
@keyframes v-beatStretchDelay{
    50%{
        -webkit-transform: scale(0.75);
                transform: scale(0.75);
        -webkit-opacity: 0.2;             
                opacity: 0.2;
    }
    100%{
        -webkit-transform: scale(1);
                transform: scale(1);
        -webkit-opacity: 1;             
                opacity: 1;
    }
}
</style>
<template>
<div>
    <div style="margin:20px">
        <div class="logo text center">
            <img src="./assets/images/logo.svg" v-tap="getItems(1)">
        </div>
        <div class="weeks text center">
            <span v-for="week in weeks" :class="{'active':$index===today}" v-tap="tab($index)">{{week}}</span>
            <div>
                <a href="javascript:void(0)" v-for="item in weeksItems" v-tap="searchItems(item.tag.locale.zh_cn)">{{item.tag.locale.zh_cn}}</a>
            </div>
        </div>
    <table class="table hover" v-if="items.length>0">
        <tbody>
        <tr v-for="item in items">
            
            <td class="text">
            <img src="./assets/images/bt.svg" width="20">
            <a href="{{item.magnet}}">{{item.title}}</a>
            <em class="size">{{item.size}}</em>
            </td>
            <td width="60" class="text center">{{item.category_tag.locale.zh_cn}}</td>
            <td width="100" class="text center">
                <div class="uploader">{{item.uploader.username}}</div>
                <div class="time">{{item.publish_time|moment}}</div>
            </td>
        </tr>
        </tbody>
    </table>

    <div class="text center">
        <span v-if="!loading" v-tap="more" class="more text center">更多</span>
        <div class="loading" v-show="loading">
            <div class="v-beat v-beat-odd"></div>
            <div class="v-beat v-beat-even"></div>
            <div class="v-beat v-beat-odd"></div>
        </div>
    </div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            server:'https://bangumi.moe',
            weeks:["日","一","二","三","四","五","六"],
            today:0,
            weeksItems:[],
            newItems:[],
            items:[],
            page:1,
            search:false,
            loading:false,
        }
    },
    ready(){
        this.getNewItems()
        this.getItems(this.page)
    },
    methods:{
        more(){
            this.page++
            this.getItems(this.page)
        },
        tab(index){
            this.today=index
            this.weeksItems=this.newItems[index]
        },
        // 新番
        getNewItems(){
            this.search=false
            let url=this.server+"/api/v2/bangumi/current"
            this.$http.get(url).then(r=> {
                let data=r.data
                let week=[]
                data.bangumis.forEach(item=>{
                    if(week[item.showOn]==undefined)week[item.showOn]=[]
                    week[item.showOn].push(item)
                })
                this.newItems=week
                this.tab(new Date().getDay())
            })
        },
        // 最新上传
        getItems(page){
            this.loading=true
            let url=this.server+"/api/v2/torrent/page/"+page+"?limit=50"
            this.$http.get(url).then(r=> {
                let data=r.data
                if(this.page==1){
                    this.items=data.torrents 
                }else{
                    this.items=this.items.concat(data.torrents)
                }
                this.loading=false
            })
        },
        // 搜索
        searchItems(title,page){
            if(page==undefined){
                this.page=1
                page=1
            }
            this.search=true
            this.loading=true
            let url=this.server+"/api/v2/torrent/search?limit=50&p="+page+"&query="+title
            this.$http.get(url).then(r=> {
                let data=r.data
                if(this.page==1){
                    this.items=data.torrents 
                }else{
                    this.items=this.items.concat(data.torrents)
                }
                this.loading=false
            })
        }
    }
}
</script>