import React,{Component} from 'react';
import ReactDom from 'react-dom';

import { Row,Col,Button,DatePicker,Input,Upload, message, Icon,Select,Checkbox,Radio,Cascader,Modal,Tree,Affix,Tabs } from 'antd';
const {TextArea}=Input;
const Option=Select.Option;
const CheckboxGroup=Checkbox.Group;
const RadioGroup=Radio.Group;
const TreeNode=Tree.TreeNode;
const Search=Input.Search;
const TabPane=Tabs.TabPane;
import $ from 'jquery';
import './main.css';

// 附件上传；
const props = {
    name: 'file',
    action: '//jsonplaceholder.typicode.com/posts/',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }
};

// 下拉选框
function selectChange(value) {
    console.log(`selected ${value}`);
}

function selectBlur() {
    console.log('blur');
}

function selectFocus() {
    console.log('focus');
}
// 复选框
const checkboxOptions = ['Apple', 'Pear'];
const checkboxDefault= ['Apple'];
class Checkbox2 extends Component {
    state = {
        checkedList: checkboxDefault,
        indeterminate: true,
        checkAll: false,
    };
    onChange = (checkedList) => {
        this.setState({
        checkedList,
        indeterminate: !!checkedList.length && (checkedList.length < checkboxOptions.length),
        checkAll: checkedList.length === checkboxOptions.length,
        });
    }
    onCheckAllChange = (e) => {
        this.setState({
        checkedList: e.target.checked ? checkboxOptions : [],
        indeterminate: false,
        checkAll: e.target.checked,
        });
    }
    render() {
        return (
        <span>
            <Checkbox
                indeterminate={this.state.indeterminate}
                onChange={this.onCheckAllChange}
                checked={this.state.checkAll}
            >
                全选 
            </Checkbox>
            <CheckboxGroup options={checkboxOptions} value={this.state.checkedList} onChange={this.onChange} />
        </span>
        );
    }    
}
// 级联平铺：
const options = [{
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [{
        value: 'hangzhou',
        label: 'Hanzhou',
        children: [{
        value: 'xihu',
        label: 'West Lake',
        }],
    }]
    }, {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [{
        value: 'nanjing',
        label: 'Nanjing',
        children: [{
        value: 'zhonghuamen',
        label: 'Zhong Hua Men',
        }],
    }],
}];

function cascaderChange(value) {
  console.log(value);
}

//  模态框
class Modal2 extends React.Component {
    constructor(props){
        super();
        this.state = {            
            visible:false,
            params:{
                label:false,name:false,required:false,
                readonly:false,disabled:false,is_show:false,
                dataSource:false,valiDate:false,config:false
            },
            spanTitleEle:''
        }
        //this.visible2=false;
        //console.log(props.showFlag,'constructor');
    } 

    componentWillReceiveProps(props){
        console.log(props);
        var _this=this;
        var params=this.state.params;
        for(var v in params){
            params[v]=false;
        }
        props.params.forEach((v,k)=>{
            params[v]=true;
        });
        _this.setState({
            params,
            spanTitleEle:props.spanTitleEle,
            visible: props.showFlag
        });    
        if(props.showFlag){ console.log('componentWillReceiveProps',props.spanTitleEle);
            // 模态框弹起是的信息自动填充；            
            var jsonOld=JSON.parse(props.spanTitleEle.getAttribute('config'));console.log(11111);
            if(jsonOld!=null){
                console.log(2222222);
                for(var key in jsonOld){
                    if('required,readonly,disabled,is_show'.indexOf(key)!=-1){
                        $('.'+key).find('input').attr('checked',jsonOld[key]?'checked':false);
                    }else if('dataSource,valiDate,label,name'.indexOf(key)!=-1){
                        if(jsonOld[key])$('.'+key).find('input').val(jsonOld[key]);
                    }else{
                        $('.'+key).find('input').each((k2,v2)=>{
                            if(jsonOld[key][k2])v2.value=jsonOld[key][k2];
                        });                        
                    }                    
                }
            }else{
                console.log(33333333);
                $('.attr td input[type="checkbox"').attr('checked',false);
                $('.attr td input').val('');
                $('.attr td select option').eq(0).attr('selected',true);
            }                    
        }    
    }     
    handleOk = (e) => {
        //console.log(e,'handleOk',this);
        this.props.modalOk();          
        var json={};
        $(".attr td").each((k,v)=>{
            if(v.style.display!='none'){
                var className=v.getAttribute('class');
                // 'required','readonly','disabled','is_show','dataSource','valiDate','label','name','config'
                if('required,readonly,disabled,is_show'.indexOf(className)!=-1){
                    json[className]=v.children[0].checked?true:false;
                }else if('dataSource,valiDate,label,name'.indexOf(className)!=-1){
                    json[className]=v.children[0].value;
                }else{
                    json[className]=[];
                    [...v.children].forEach((v2,k2)=>{
                        json[className].push(v2.value);
                    });
                } 
            }            
        });        
        if($(this.state.spanTitleEle).parent().attr('class')=='component title'){
            // 右侧的标题组件赋值；
            $('.right .title').find('span').eq(1).html(json.label);
        }else{
            if(json.label!='')this.state.spanTitleEle.innerHTML=json.label+' ：';
        }        
        this.state.spanTitleEle.setAttribute('config',JSON.stringify(json));
    }
  
    handleCancel = (e) => {
        console.log(e,'handleCancel');
        this.props.modalCancel();
    }
  
    render() {
      return (
        <div>
            <Modal
                title="组件属性配置"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <table className='attr' style={{width:'100%',border:'1px solid #ccc',paddingTop:30}}>
                    <tbody>
                        <tr>
                            <td className='required' style={{display:this.state.params.required?'inline-block':'none',textIndent:65}}>
                                是否必填:   <input style={{verticalAlign:'middle'}} type='checkbox' name='attr'  />
                            </td>
                            <td className='readonly' style={{display:this.state.params.readonly?'inline-block':'none',textIndent:65}}>
                                是否只读:   <input style={{verticalAlign:'middle'}} type='checkbox' name='attr'  />
                            </td>
                        </tr>
                        <tr >
                            <td className='is_show' style={{display:this.state.params.is_show?'inline-block':'none',textIndent:65}}>
                                是否显示:    <input style={{verticalAlign:'middle'}} type='checkbox' name='attr'  />
                            </td>
                            <td className='disabled' style={{display:this.state.params.disabled?'inline-block':'none',textIndent:65}}>
                                可否点击:   <input style={{verticalAlign:'middle'}} type='checkbox' name='attr'  />
                            </td>										
                        </tr>
                        <tr>
                            <td className='dataSource'  colSpan='2' style={{display:this.state.params.dataSource?'block':'none',padding:'10px 0px'}}>
                                引用: <input type='text' style={{width:300}} name='attr' placeholder='输入地址' />
                            </td>
                        </tr>								
                        <tr>
                            <td className='valiDate'  colSpan='2' style={{display:this.state.params.valiDate?'block':'none',padding:'10px 0px'}}>
                                过滤: <input type='text' style={{width:300}} name='attr' placeholder='验证规则' />
                            </td>
                        </tr>	
                        <tr>
                            <td className='label'  colSpan='2' style={{display:this.state.params.label?'block':'none',padding:'10px 0px'}}>
                                名称: <input type='text' style={{width:300}} name='attr' placeholder='输入组件名' />
                            </td>
                        </tr>								
                        <tr>
                            <td className='name'  colSpan='2' style={{display:this.state.params.name?'block':'none',padding:'10px 0px'}}>
                                字段: <select style={{width:300,height:30}}>
                                    <option value='1'>1</option>
                                    <option value='2'>2</option>
                                    <option value='3'>3</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td className='config'  colSpan='2' style={{display:this.state.params.config?'block':'none',padding:'10px 0px'}}>
                                配置：
                                    <input type='text' style={{width:70}} name='attr' placeholder='item' />
                                    <input type='text' style={{width:70}} name='attr' placeholder='item' />
                                    <input type='text' style={{width:70}} name='attr' placeholder='item' />
                                    <input type='text' style={{width:70}} name='attr' placeholder='item' />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Modal>
        </div>
        );
    }
}
// 下拉树 数据
const treeData = [{
    title: '0-0',
    key: '0-0',
    children: [{
        title: '0-0-0',
        key: '0-0-0',
        children: [
            { title: '0-0-0-0', key: '0-0-0-0' },
            { title: '0-0-0-1', key: '0-0-0-1' },
            { title: '0-0-0-2', key: '0-0-0-2' },
        ],
    }, {
        title: '0-0-1',
        key: '0-0-1',
        children: [
            { title: '0-0-1-0', key: '0-0-1-0' },
            { title: '0-0-1-1', key: '0-0-1-1' },
            { title: '0-0-1-2', key: '0-0-1-2' },
        ],
    }, {
        title: '0-0-2',
        key: '0-0-2',
    }],
}, {
    title: '0-1',
    key: '0-1',
    children: [
    { title: '0-1-0-0', key: '0-1-0-0' },
    { title: '0-1-0-1', key: '0-1-0-1' },
    { title: '0-1-0-2', key: '0-1-0-2' },
    ],
}, {
    title: '0-2',
    key: '0-2',
}];
class Tree2 extends Component{
    state = {
        expandedKeys: ['0-0-0', '0-0-1'],
        autoExpandParent: false,
        checkedKeys: ['0-0-0'],
        selectedKeys: [],
    }    
    onExpand = (expandedKeys) => {
        console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
        expandedKeys,
        autoExpandParent: false,
        });
    }
    
    onCheck = (checkedKeys) => {
        console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
    }
    
    onSelect = (selectedKeys, info) => {
        console.log('onSelect', info);
        this.setState({ selectedKeys });
    }
    
    renderTreeNodes = (data) => {
        return data.map((item) => {
        if (item.children) {
            return (
            <TreeNode title={item.title} key={item.key} dataRef={item}>
                {this.renderTreeNodes(item.children)}
            </TreeNode>
            );
        }
        return <TreeNode {...item} />;
        });
    }
    
    render() {
        return (
        <Tree 
            checkable
            onExpand={this.onExpand}
            expandedKeys={this.state.expandedKeys}
            autoExpandParent={this.state.autoExpandParent}
            onCheck={this.onCheck}
            checkedKeys={this.state.checkedKeys}
            onSelect={this.onSelect}
            selectedKeys={this.state.selectedKeys}
        >
            {this.renderTreeNodes(treeData)}
        </Tree>
        );
    }
}
// 下拉平铺
class Cascader_x extends Component{
    constructor(args){
        super(args);
        this.state={
            tabPosition:'left',
            data:{
                time:{
                    '年':[
                        '今年','去年','更早'
                    ],
                    '月':[
                        '当月','上月','近5月'
                    ],
                    '日':[
                        '今日','昨天','近5天'
                    ]           
                },
                state:{
                    '待办':[
                        '朝阳','昌平','顺义'
                    ],
                    '已办':[
                        '朝阳','昌平','顺义'
                    ],
                    '在办':[
                        '朝阳','昌平','顺义'
                    ]
                },
                addr:{
                    '昆明':[
                        '盘龙','官渡','五华'
                    ],
                    '南京':[
                        '玄武','秦淮','鼓楼'
                    ],
                    '北京':[
                        '朝阳','昌平','顺义'
                    ]
                }

            }
        }
    }
    onclick(v){
        console.log(v.join('<'));
    }
    render(){
        var data=this.state.data;
        var ele={};
        var count=0;
        for(var v1 in data){ // v1:time state addr
            ele[v1]=[];
            for(var v2 in data[v1]){ // v2 昆明 南京 北京
                var li=[];
                li.push(<li key={v2+(count++)}>{v2}</li>);
                data[v1][v2].forEach((v3,k3)=>{ // v3 '朝阳','昌平','顺义'
                    var params=[v1,v2,v3];
                    li.push(
                        <li key={k3} onClick={()=>{this.onclick(params)}}>{v3}</li>
                    );
                });
                ele[v1].push(<ul key={v1+(count++)}>{li}</ul>);
            }            
        }
        console.log(ele);
        return (            
            <div>
                <Tabs tabPosition={this.state.tabPosition}>
                    <TabPane tab="时间" key="1">
                        {ele.time.map((arr)=>{
                            return arr;
                        })}
                    </TabPane>
                    <TabPane tab="状态" key="2">
                        {ele.state.map((arr)=>{
                            return arr;
                        })}
                    </TabPane>
                    <TabPane tab="地点" key="3">
                        {ele.addr.map((arr)=>{
                            return arr;
                        })}
                    </TabPane>
                </Tabs>            
            </div>
        )
    }
}
class Drag extends Component{
    constructor(){
        super();
        this.state={
            // dragStart事件触发；
            currentEle:{},
            //eleArr:{ele:[],key:0},
            
            // 模态框状态以及参数配置          
            modalFlag:false,
            modalParams:[],
            // 记录当前点击的span标签对象
            spanTitleEle:'',
            // 表单预览
            leftSpan:6
        }
        // dragOver事件高亮显示对象  
        this.dragOverEle='',
        this.count=0;
        this.attribute={  // 'span','type', 'label','name','required','readonly','disabled','is_show','dataSource','valiDate','config'
            input:['label','name','required','readonly','is_show','valiDate'],
            textarea:['label','name','required'],
            select:['label','name','required','readonly','dataSource'],
            date:['label','name','required','readonly'],
            selectTree:['label','name','required','dataSource'],
            cascader:['label','name','required','dataSource'],
            cascader_x:['label','name','required','dataSource'],            
            radio:['label','name','required','config'],
            checkbox:['label','name','required','config'],
            upload:['label','name','required','dataSource'],
            button:['label','disabled','dataSource'],
            reset:['label'],
            title:['label']
        }
    }
    componentDidMount(){      

        var _this=this;
        $('.spanTitle').click(function(){
            var className=$(this).parent().attr('class');
            if(!$(this).parents('.left').length){
                //console.log('a'+className.substr(9)+'b','name9999999',_this.attribute[className.substr(10)]);                
                _this.setState({
                    modalParams:_this.attribute[className.substr(10)],
                    modalFlag:!(_this.state.modalFlag),
                    spanTitleEle:this
                });               
            }                          
        })
    }
    dragStart=(e)=>{ 
        this.setState({
            currentEle:e.target
        });
    }
    dragOver(e){     
        e.nativeEvent.stopImmediatePropagation();
        e.nativeEvent.preventDefault();    
        //if(!this.aa++)console.log(e.target,'000000000',this.dragOverEle);
        //return ;
        if(e.target==this.dragOverEle){
            return false;
        }else{
            if(this.dragOverEle!=''){
                $(this.dragOverEle).removeClass('dragOverActive');
            }            
            this.dragOverEle=e.target;   
            $(this.dragOverEle).addClass('dragOverActive');
        }
    }    
    dragDrop(e){
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        var cloneEle=$(this.state.currentEle).clone(true);
        var ele=$(`<span class='closeSpan' >x</span>`).click(function(){
            cloneEle.remove();
        })
        cloneEle.append(ele);
        cloneEle.attr('draggable',false);
        $(e.target).append(cloneEle);   
        var className=e.target.getAttribute('class');
        if(className.indexOf('ant-col')!=-1){
            var height=cloneEle.height();
            if(height>=$(e.target).siblings().eq(0).height()-10){
                //console.log(e.target,'00000000000000-dragDrop',className,$(e.target).height(),$(e.target).parent(),$(e.target).parents());
                //$(e.target).height(height+10).siblings().height(height+10);
                $(e.target).parent().children().not('span').height(height+20);
            }            
        }   
        $(this.dragOverEle).removeClass('dragOverActive');
    }
    btnSubmit(){
        //    this.count=this.count==8?0:this.count;
        //    $('body').css({
        //        background:`url(../../../img/bg${this.count++}.jpg)`,
        //        backgroundSize:'cover'
        //    });       
        
        console.log($('.right .component'));
        var json=[];
        for(var a=0;a<$('.right .component').length;a++){
            var row=[];
            //debugger
            var v=$('.right .component')[a];
            //var className=v.getAttribute('class');console.log(className,$(v).parent().parent());
            row.push({
                col:{
                    span:$(v).parent().attr('class').split('-')[2],
                    component:[
                        {
                            name:v.getAttribute('class').split(' ')[1],
                            config:$(v).find('.spanTitle').attr('config')
                        }
                    ]
                }
            });
            $(v).parent().siblings().not('span').each((k2,v2)=>{    //console.log(k2);
                ++a;
                var ele=$('.right .component')[a];
                row.push({
                    col:{
                        span:$(v2).attr('class').split('-')[2],
                        component:[
                            {
                                name:$(ele).attr('class').split(' ')[1],
                                config:$(ele).find('.spanTitle').attr('config')
                            }
                        ]
                    }
                });
                //row.push({col:$(v2).attr('class'),config:$(v2).find('.spanTitle').attr('config')});                
            });
            json.push(row);           
        }
        console.log(JSON.stringify(json));
    }
    search(val){
        console.log(val);
    }
    //
    modalOk(){
        this.setState({
            modalFlag:false
        });
    }
    modalCancel(){
        this.setState({
            modalFlag:false
        });
    }
    formPreShow(){
        var currentSpan=this.state.leftSpan;
        this.setState({
            leftSpan:currentSpan==6?0:6
        });  
        if(currentSpan==6){
            $('.right .ant-row>div').css({
                borderRightWidth:0,
                borderBottomWidth:0 
            });  
            $('.closeSpan').css('display','none');    
            $('.right .title .spanTitle').css('display','none');
        }else{
            $('.right .ant-row>div').css({
                borderRightWidth:1,
                borderBottomWidth:1 
            });      
            $('.closeSpan').css('display','block');    
            $('.right .title .spanTitle').css('display','inline-block');
        }
        
    }
    render(){
        return (
            <div>
                <Row style={{height:60,background:'#2ae',marginBottom:0}}>   
                    <Col span={24}>
                        <h3 style={{textIndent:20,color:'#fff',letterSpacing:3,fontSize:30}} >表单图形化设计器 <span style={{background:'#6cf',padding:5,borderRadius:3,fontSize:10,letterSpacing:1}}>buildForm v1.0</span></h3>     
                    </Col>
                </Row>                
                <Row>
                    <Col span={this.state.leftSpan} className='left' style={{border:'1px solid #bbb',height:window.innerHeight-60,overflowY:'scroll'}}>
                        <Affix offsetTop={65}>
                            <Search
                                placeholder="组件模糊搜索"
                                onSearch={this.search.bind(this)}
                                style={{ width: '100%',height:35,margin:'0px auto'}}
                                enterButton
                            />
                        </Affix>            
                        <h2 style={{textAlign:'center',margin:'10px 0px 0px 0px',height:25}}>纵横布局</h2>
                        <p>单行布局</p>
                        <div className='component row'>
                            <Row draggable="true" onDragStart={this.dragStart}>
                                <Col span={24}></Col>
                            </Row>
                        </div>                            
                        <p>等分布局</p>
                        <div className='component row'>
                            <Row draggable="true" onDragStart={this.dragStart}>
                                <Col span={12}></Col>
                                <Col span={12}></Col>
                            </Row>
                        </div>                        
                        <p>三等分布局</p>
                        <div className='component row'>
                            <Row draggable="true" onDragStart={this.dragStart}>
                                <Col span={8}></Col>
                                <Col span={8}></Col>
                                <Col span={8}></Col>
                            </Row>
                        </div>                        
                        <p>1 vs 2 布局</p>
                        <div className='component row'>
                            <Row draggable="true" onDragStart={this.dragStart}>
                                <Col span={16}></Col>
                                <Col span={8}></Col>
                            </Row>
                        </div>  
                        <h2 style={{textAlign:'center',marginTop:20}}>组件布局</h2>   
                        <p>表单标题</p>    
                        <div className='component title' draggable="true" onDragStart={this.dragStart}>                                                    
                            <span className='spanTitle'>案件标题 ：</span><span style={{fontSize:20,fontWeight:600,letterSpacing:3}}>案件登记</span>
                        </div>                     
                        <p>单行输入框</p>    
                        <div className='component input' draggable="true" onDragStart={this.dragStart}>                                                    
                            <span className='spanTitle'>案件描述 ：</span><Input style={{width:'70%'}} placeholder='相关描述' />
                        </div>
                        <p>日历组件</p>    
                        <div className='component date' draggable="true" onDragStart={this.dragStart}>                                                    
                            <span className='spanTitle'>上报日期 ：</span><DatePicker style={{width:'70%'}} onChange={this.change} />
                        </div>                        
                        <p>多行输入框</p>    
                        <div className='component textarea' draggable="true" onDragStart={this.dragStart}>                                                    
                            <span style={{verticalAlign:'top'}} className='spanTitle'>详细描述&nbsp;&nbsp;&nbsp;&nbsp;:</span>
                            <TextArea style={{width:'70%'}} placeholder='案件详情描述' autosize={{ minRows: 2, maxRows: 6 }} />
                        </div>
                        <p>下拉选框</p>    
                        <div className='component select' draggable="true" onDragStart={this.dragStart}>                                                    
                            <span className='spanTitle'>下拉选框 ：</span>
                            <Select 
                                showSearch
                                style={{ width: '70%' }}
                                placeholder="Select a person"
                                optionFilterProp="children"
                                onChange={selectChange}
                                onFocus={selectFocus}
                                onBlur={selectBlur}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                <Option value="jack">Jack</Option>
                                <Option value="lucy">Lucy</Option>
                                <Option value="tom">Tom</Option>
                            </Select>
                        </div>                        
                        <p>附件上传</p>    
                        <div className='component upload' draggable="true" onDragStart={this.dragStart}>                                                    
                            <span className='spanTitle'>案件资料 ：</span>
                            <Upload {...props}>
                                <Button><Icon type="upload" /> 上传案件资料 </Button>
                            </Upload>
                        </div>
                        <p>下拉级联</p>    
                        <div className='component cascader' draggable="true" onDragStart={this.dragStart}>                                                    
                            <span className='spanTitle' >下拉级联 ：</span>
                            <Cascader style={{width:'70%'}} options={options} onChange={cascaderChange} changeOnSelect />
                        </div>
                        <p>级联平铺</p>                            
                        <div style={{position:'relative',height:150}}>
                            <div className='component cascader_x' draggable="true" onDragStart={this.dragStart} style={{position:'absolute',zIndex:10}}>                                                    
                                <span className='spanTitle' style={{verticalAlign:'top'}} >级联选择 ：</span>
                                <span  style={{width:'70%',textAlign:'left',display:'inline-block'}}>
                                    <Cascader_x />
                                </span>
                            </div>
                        </div>
                        <p>下拉树</p>    
                        <div style={{position:'relative',height:110}}>
                            <div className='component selectTree' draggable="true" onDragStart={this.dragStart} style={{position:'absolute',zIndex:10}}>                                                    
                                <span className='spanTitle' style={{verticalAlign:'top'}} >下拉选择 ：</span>
                                <span  style={{width:'70%',textAlign:'left',display:'inline-block'}}><Tree2 /></span>
                            </div>
                        </div>
                        <p style={{position:'relative',display:'block'}}>多选框</p>    
                        <div className='component checkbox' draggable="true" onDragStart={this.dragStart}>                                                    
                            <span className='spanTitle'>多项选择 ：</span>
                            <Checkbox2 style={{width:'70%'}} />
                        </div>
                        <p>单选框</p>    
                        <div className='component radio' draggable="true" onDragStart={this.dragStart}>                                                    
                            <span className='spanTitle'>单项选择 ：</span>
                            <RadioGroup name='radio' defaultValue={1}>
                                <Radio value='1' > A </Radio>
                                <Radio value='2' > B </Radio>
                                <Radio value='3' > C </Radio>
                            </RadioGroup>
                        </div>
                    </Col>
                    <Col className='right' span={24-this.state.leftSpan}>
                        <div className='container' style={{width:'100%',height:window.innerHeight-120,border:'1px solid #bbb'}} onDragOver={this.dragOver.bind(this)} onDrop={this.dragDrop.bind(this)}>
                           
                        </div>
                        <div>
                            <Button type={this.state.leftSpan==6?'primary':'default'} size='large' style={{width:130,float:'right',height:30,marginRight:50,marginTop:20}} onClick={this.formPreShow.bind(this)}>
                                {
                                    this.state.leftSpan==6?<span><Icon type="scan" /> 表单预览</span>:<span><Icon type="edit" /> 继续编辑</span>
                                }
                            </Button>
                            <Button type="primary" size='large' style={{width:130,float:'right',height:30,marginRight:50,marginTop:20}} onClick={this.btnSubmit.bind(this)}>
                                <Icon type="check" />提交表单
                            </Button>
                        </div>
                        <Modal2 showFlag={this.state.modalFlag} params={this.state.modalParams} spanTitleEle={this.state.spanTitleEle} modalOk={this.modalOk.bind(this)} modalCancel={this.modalCancel.bind(this)} /> 
                    </Col>                                       
                </Row>                
            </div>
        );
    }
}
ReactDom.render(<Drag />,root);


