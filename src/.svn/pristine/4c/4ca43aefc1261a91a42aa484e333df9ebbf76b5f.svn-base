import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text ,ScrollView,Button,Picker} from '@tarojs/components'
import { AtAvatar,
         AtNoticebar,
         AtButton,
         AtTabs, 
         AtTabsPane,
         AtModal, 
         AtModalHeader,
         AtModalContent, 
         AtModalAction,
         AtInput, 
         AtActionSheet, 
         AtActionSheetItem,
         AtForm, 
         AtSwitch
        } from 'taro-ui'

let loopload 
import  '../index/index.scss'

import url from '../../utils/url'

export default class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '工作日志'
  }

  state={
    userinfo:{type: 'userAvatarUrl'},
    currenttime:'',
    register:{msg:'error',state:false},
    username:'',
    current: 2,
    currentdate:0,
    current_today:'',
    onedayago:'',
    twodayago:'',
    today_data:[{id: "1",
    date: "2018-12-14",
    work_start_time: "9:00",
    length_time: "0",
    work_project: "",
    work_content: "",
    work_efficiency: "0.0",
    work_effect: "0.0",
    work_myself: "0.0"}], 
    onedayago_data:[{id: "1",
    date: "2018-12-14",
    work_start_time: "9:00",
    length_time: "0",
    work_project: "",
    work_content: "",
    work_efficiency: "0.0",
    work_effect: "0.0",
    work_myself: "0.0"}],
    twodayago_data:[{id: "1",
    date: "2018-12-14",
    work_start_time: "9:00",
    length_time: "0",
    work_project: "",
    work_content: "",
    work_efficiency: "0.0",
    work_effect: "0.0",
    work_myself: "0.0"}],
    itemtitles:['开始时间','时长(分)','工作项目','工作内容及说明','效率指数','效果指数','自我驱动指数'],
    moment:['9:00','9:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00'],
    showmodel:false,
    modeldatatitle:'标题',
    value:'',
    idMname:{
      work_start_time:'开始时间',
      length_time:'时长(分)',
      work_project:'工作项目',
      work_content:'工作内容及说明',
      work_efficiency:'效率自评',
      work_effect:'效果自评',
      work_myself:'自我驱动自评',
    },
    targhtid:[],
    showmessageboolean:false,
    showmaeeagecontext:'',
    systemheight:'',
    resttime:'12:00,12:30,13:00,13:30,18:00,18:30,19:00,19:30,20:00,20:30,21:00',
    lockstate:false,
    functioncControlict:{

    },
    scrollleft:2,
  }


  componentWillMount () {

 
    //适配设备高度
    let sysinfo = Taro.getSystemInfoSync()
    let height = sysinfo.screenHeight
    let windowsheight = sysinfo.windowHeight
    this.setState({
      systemheight:'height:' + (windowsheight-118) + 'px;'
    })
    //尝试次数
    let loopnum = 0;
    
    if(Taro.getStorageSync('register')===""){
      loopload =  setTimeout(() => {
      if(loopnum>=3||Taro.getStorageSync('register')===""){
      this.setState({
        register:Taro.getStorageSync('register')
      })
    
      if(Taro.getStorageSync('register').state){
        this.setState({
          username:Taro.getStorageSync('username')
        })
    }
  }else{
    loopnum = 0;
    clearInterval(loopload)
  }
    }, 500);
  }else{

      this.setState({
        register:Taro.getStorageSync('register')
      })
  
      if(Taro.getStorageSync('register').state){
      this.setState({
        username:Taro.getStorageSync('username')
      })
      }

  }



   }

  componentDidMount () {
    
    //载入锁定状态
    this.setState({
      lockstate :Taro.getStorageSync('lockstate')
    })
  }

  componentWillUnmount () { }

  componentDidShow () {

    
    let time
    Taro.request({
      url:url.locality_address+'/v1/work/time?tdsourcetag=s_pcqq_aiomsg'
    }).then(
       (res) => {
         let now = new Date(parseInt(res.data.success_msg.time)*1000)
        //  time = this.timedat(now)
        //  time = time + ' ' + this.getWeek(now)
         time =  this.getWeek(now)
         this.setState({
          currenttime:time,
          currentdate:(parseInt(res.data.success_msg.time)*1000)
         })
         return parseInt(res.data.success_msg.time)*1000
        }
    ).then(
      (timest)=>{
        this.setState({
          current_today:this.timedaty_m_d(timest),
          onedayago:this.timedaty_m_d((timest-86400000)),
          twodayago:this.timedaty_m_d((timest-86400000*2))
         })
         return [this.timedaty_m_d(timest),this.timedaty_m_d((timest-86400000)),this.timedaty_m_d((timest-86400000*2))]
      }
    ).then((timearray)=>{
      //拉取数据
      Taro.request({
        url:url.locality_address+'/v1/work/notes',
        data:{
          openid:Taro.getStorageSync('openid'),
          date:timearray[0]
        }
      }).then((res)=>{
         this.setState({
          today_data:res.data.success_msg.info
         })
      })
      return timearray
    }).then((timearray)=>{
      //拉取数据
      Taro.request({
        url:url.locality_address+'/v1/work/notes',
        data:{
          openid:Taro.getStorageSync('openid'),
          date:timearray[1]
        }
      }).then((res)=>{
         this.setState({
          onedayago_data:res.data.success_msg.info
         })
      })
      return timearray
    }).then((timearray)=>{
      //拉取数据
      Taro.request({
        url:url.locality_address+'/v1/work/notes',
        data:{
          openid:Taro.getStorageSync('openid'),
          date:timearray[2]
        }
      }).then((res)=>{
         this.setState({
          twodayago_data:res.data.success_msg.info
         })
      })
      return timearray
    })


    console.log('加载啦')

    


   
 
//获取数据

}

  componentDidHide () { }

  render () {
    
    const tabList = [{ title:this.state.twodayago }, { title: this.state.onedayago}, { title:this.state.current_today}]
    let {itemtitles} = this.state
    let today_data = this.state.today_data
    let onedayago_data = this.state.onedayago_data
    let twodayago_data = this.state.twodayago_data


    //标题
    let itemtitle = itemtitles.map((item)=>{

      return <View className='itemtitle'>{item}</View>
    })

    //时间栏
    let timelist = today_data.map(
      (item) =>{
        return <View className='timelist'>
        <View className='itemcontext'>开始时间</View>
        <View id={'work_start_time@@'+item.id} style={this.state.resttime.indexOf(item.work_start_time)>-1&&item.work_start_time.length>=5?'color:green':'none'} className='itemcontext'>{item.work_start_time}</View>
      </View>
      }
    )
    
    //内容
    let itemcontexttoday =  today_data.map((item)=>{
     return <View className='tabletitle'>
        <View id={'work_start_time@@'+item.id} style={this.state.resttime.indexOf(item.work_start_time)>-1&&item.work_start_time.length>=5?'color:green':'none'} className='itemcontext'>{item.work_start_time}</View>
        {/* <View id={'length_time@@'+item.id} onClick={this.showmessage} onLongPress={this.changemessage} className='itemcontext'>{item.length_time}</View> */}
        {!this.state.lockstate  &&
        <View id={'length_time@@'+item.id}  className='itemcontext'>
          <Picker id={item.id} mode='time' onCancel={this.closepicker} onChange={this.onDateChange} style='width:100%;height:100%' value={item.length_time}>
            <View className='itemcontext noleftline'>
              {item.length_time}
            </View>
          </Picker>
        </View>
        }
         {this.state.lockstate  &&
        <View id={'length_time@@'+item.id}  className='itemcontext'>{item.length_time}</View>
         }
        

        <View id={'work_project@@'+item.id} onClick={this.showmessage} onLongPress={this.changemessage} className='itemcontext'>{item.work_project}</View>
        <View id={'work_content@@'+item.id} onClick={this.showmessage} onLongPress={this.changemessage} className='itemcontext'>{item.work_content}</View>
        <View id={'work_efficiency@@'+item.id} onClick={this.showmessage} onLongPress={this.changemessage} className='itemcontext'>{item.work_efficiency}</View>
        <View id={'work_effect@@'+item.id} onClick={this.showmessage} onLongPress={this.changemessage} className='itemcontext'>{item.work_effect}</View>
        <View id={'work_myself@@'+item.id} onClick={this.showmessage} onLongPress={this.changemessage} className='itemcontext'>{item.work_myself}</View>
      </View>
    })

    let itemcontextoneago = onedayago_data.map((item)=>{
      return <View className='tabletitle'>
         <View id={'work_start_time@@'+item.id} style={this.state.resttime.indexOf(item.work_start_time)>-1&&item.work_start_time.length>=5?'color:green':'none'} onClick={this.showmessage} onLongPress={this.changemessage} className='itemcontext'>{item.work_start_time}</View>
         {/* <View id={'length_time@@'+item.id}  onClick={this.showmessage} onLongPress={this.changemessage} className='itemcontext'>{item.length_time}</View> */}

         {!this.state.lockstate  &&
        <View id={'length_time@@'+item.id}  className='itemcontext'>
          <Picker id={item.id} mode='time' onCancel={this.closepicker} onChange={this.onDateChange} style='width:100%;height:100%' value={item.length_time}>
            <View className='itemcontext noleftline'>
              {item.length_time}
            </View>
          </Picker>
        </View>
        }
         {this.state.lockstate  &&
        <View id={'length_time@@'+item.id}  className='itemcontext'>{item.length_time}</View>
         }

         <View id={'work_project@@'+item.id} onClick={this.showmessage} onLongPress={this.changemessage} className='itemcontext'>{item.work_project}</View>
         <View id={'work_content@@'+item.id} onClick={this.showmessage}  onLongPress={this.changemessage} className='itemcontext'>{item.work_content}</View>
         <View id={'work_efficiency@@'+item.id} onClick={this.showmessage}  onLongPress={this.changemessage} className='itemcontext'>{item.work_efficiency}</View>
         <View id={'work_effect@@'+item.id} onClick={this.showmessage} onLongPress={this.changemessage} className='itemcontext'>{item.work_effect}</View>
         <View id={'work_myself@@'+item.id} onClick={this.showmessage} onLongPress={this.changemessage} className='itemcontext'>{item.work_myself}</View>
       </View>
     })

    let itemcontexttwoago = twodayago_data.map((item)=>{
      return <View className='tabletitle'>
         <View id={'work_start_time@@'+item.id} style={this.state.resttime.indexOf(item.work_start_time)>-1&&item.work_start_time.length>=5?'color:green':'none'} onClick={this.showmessage} onLongPress={this.changemessage} className='itemcontext'>{item.work_start_time}</View>
         {/* <View id={'length_time@@'+item.id} onClick={this.showmessage} onLongPress={this.changemessage} className='itemcontext'>{item.length_time}</View> */}

         {!this.state.lockstate  &&
        <View id={'length_time@@'+item.id}  className='itemcontext'>
          <Picker id={item.id} mode='time' onCancel={this.closepicker} onChange={this.onDateChange} style='width:100%;height:100%' value={item.length_time}>
            <View className='itemcontext noleftline'>
              {item.length_time}
            </View>
          </Picker>
        </View>
        }
         {this.state.lockstate  &&
        <View id={'length_time@@'+item.id}  className='itemcontext'>{item.length_time}</View>
         }

         <View id={'work_project@@'+item.id} onClick={this.showmessage} onLongPress={this.changemessage} className='itemcontext'>{item.work_project}</View>
         <View id={'work_content@@'+item.id} onClick={this.showmessage} onLongPress={this.changemessage} className='itemcontext'>{item.work_content}</View>
         <View id={'work_efficiency@@'+item.id} onClick={this.showmessage} onLongPress={this.changemessage} className='itemcontext'>{item.work_efficiency}</View>
         <View id={'work_effect@@'+item.id} onClick={this.showmessage} onLongPress={this.changemessage} className='itemcontext'>{item.work_effect}</View>
         <View id={'work_myself@@'+item.id} onClick={this.showmessage} onLongPress={this.changemessage}  className='itemcontext'>{item.work_myself}</View>
       </View>
     })




    let nodebook =  <ScrollView
    className='scrollview'
    scrollY={true}
    scrollX={true}
    scrollWithAnimation
    style={this.state.systemheight}
    scroll-left={this.state.scrollleft+'px'}
    onScroll = {this.scrollmove}
    >
    <View className='table'>
    {/* 标题 */}
      <View className='tabletitle'>
        {itemtitle}
      </View>
      {itemcontexttoday}
    </View>
    
  </ScrollView>

        let nodebook1 =  <ScrollView
        className='scrollview'
        scrollY={true}
        scrollX={true}
        scrollWithAnimation
        style={this.state.systemheight}
        >
        <View className='table'>
        {/* 标题 */}
          <View className='tabletitle'>
            {itemtitle}
          </View>
          {itemcontextoneago}
        </View>

        </ScrollView>

        let nodebook2 =  <ScrollView
        className='scrollview'
        scrollY={true}
        scrollX={true}
        scrollWithAnimation
        style={this.state.systemheight}
        >
        <View className='table'>
        {/* 标题 */}
          <View className='tabletitle'>
            {itemtitle}
          </View>
          {itemcontexttwoago}
        </View>

        </ScrollView>

        let nodebook3 =  <ScrollView
        className='scrollview'
        scrollY={true}
        scrollX={true}
        scrollWithAnimation
        style='height:485px;'
        >
        <View className='table'>
        {/* 标题 */}
          <View className='tabletitle'>
            {itemtitle}
          </View>
          {itemcontexttoday}
        </View>

        </ScrollView>


  
  
    return (
      <View className='index'>
          <AtNoticebar marquee>
              欢迎使用好玩工作日志系统
          </AtNoticebar>
          <View className="title">
            <View className='userinfo'>
              <AtAvatar className='touxiang' openData={this.state.userinfo} circle={true} size="small"></AtAvatar>
            <Text className="username">{this.state.register.state?this.state.username:'欢迎'}</Text>
          </View>
           
            <Text className='currenttime'>{this.state.currenttime}</Text>
              <View>
                      <AtForm>
                        <AtSwitch border={false} onChange={this.changelockstate} checked={this.state.lockstate} title='锁定' />
                      </AtForm>
              </View>
              <Text onClick={this.toindexplus}>跳转</Text>
          </View>
        

        {/* 日志部分 */}
        
        { !this.state.register.state  && <View className='center'>
         <AtButton className='goregster' type='primary' onClick={this.goregister} >请绑定用户姓名</AtButton>
         </View>
        }

     
        { this.state.register.state  &&  
        <AtTabs current={this.state.current}  tabList={tabList} onClick={this.handleClick.bind(this)} swipeable={false}>
        <AtTabsPane current={this.state.current} index={0} >
        {nodebook2}
        </AtTabsPane>
        <AtTabsPane current={this.state.current} index={1}>
        {nodebook1}
        </AtTabsPane>
        <AtTabsPane current={this.state.current} index={2}>
          <View>
        
          {nodebook}
          </View>
        </AtTabsPane>

        </AtTabs>
    }
          

          <AtModal isOpened={this.state.showmodel} onClose={this.closeModal.bind(this, 1, 'Modal被关闭了')}>
          <AtModalHeader>{this.state.modeldatatitle}</AtModalHeader>
          <AtModalContent>
          <AtInput
              name='value1'
              type='text'
              placeholder='输入内容'
              value={this.state.value}
              onChange={this.handleChange.bind(this)}
            />
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.closeModal.bind(this, 1, '点击了取消')}>
              取消
            </Button>
            <Button
              style='color:#6190E8'
              onClick={this.updatemessage.bind(this, 1, '点击了确定')}
            >
              确定
            </Button>
          </AtModalAction>
        </AtModal>




        {/* //展示信息 */}
         <AtModal isOpened={this.state.showmessageboolean}>
          <AtModalHeader>{this.state.modeldatatitle}</AtModalHeader>
          <AtModalContent>
            <Text>{this.state.showmaeeagecontext}</Text>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.closeshowModal.bind(this, 1, '点击了取消')}>
              取消
            </Button>
            <Button
              style='color:#6190E8'
              onClick={this.closeshowModal.bind(this, 1, '点击了确定')}
            >
              确定
            </Button>
          </AtModalAction>
        </AtModal>
            
      </View>
    )
  }

  toindexplus(){
    Taro.navigateTo({
      url:'/pages/indexplus/indexplus'
    })
  }

  scrollmove(e){
      console.log(e);
      
  }

  emptyfunction(){

  }
  
  showmessage(e){

    console.log('断案')

    let  tapid =  e.currentTarget.id
    let tab111 = tapid.split('@@')
    console.log(tab111)

    let text = ''

    switch(this.state.current){
      case 0:
      console.log('进入10')
      let twodayago_data = this.state.twodayago_data
      for(let i = 0;i< twodayago_data.length;i++){
        if(twodayago_data[i].id==tab111[1]){
          text = twodayago_data[i][tab111[0]]
        }
      }
      break;
      case 1:
      console.log('进入2')
      let onedayago_data = this.state.onedayago_data
      for(let i = 0;i< onedayago_data.length;i++){
        if(onedayago_data[i].id==tab111[1]){
          text = onedayago_data[i][tab111[0]]
        }
      }
      break;
      case 2:
      console.log('进入3')
      let today_data_temp = this.state.today_data
        for(let i = 0;i< today_data_temp.length;i++){
          if(today_data_temp[i].id==tab111[1]){
            text = today_data_temp[i][tab111[0]]
          }
        }
       
      break;
  }


    this.setState({
      showmessageboolean:true,
      showmaeeagecontext:text
    })
  }


  changelockstate(){

      this.setState({
        lockstate:!this.state.lockstate
      })

      Taro.setStorageSync('lockstate',!this.state.lockstate)

  }


//修改时间
  onDateChange = e => {
    this.setState({
      dateSel: e.detail.value
    })

    console.log(e)
          Taro.request({
            url:url.locality_address+'/v1/work/modify',
            data:{
              wid:e.currentTarget.id,
              openid:Taro.getStorageSync('openid'),
              field:'length_time',
              val:e.detail.value
            },
            method:'POST',
            header:{  "Content-Type": "application/x-www-form-urlencoded"}
        }).then((res)=>{
            //更改现有数据
            switch(this.state.current){
                case 0:
                let twodayago_data = this.state.twodayago_data
                for(let i = 0;i< twodayago_data.length;i++){
                  if(twodayago_data[i].id==res.data.result.wid){
                    twodayago_data[i][res.data.result.field] = res.data.result.val;
                  }
                }
                break;
                case 1:
                let onedayago_data = this.state.onedayago_data
                for(let i = 0;i< onedayago_data.length;i++){
                  if(onedayago_data[i].id==res.data.result.wid){
                    onedayago_data[i][res.data.result.field] = res.data.result.val;
                  }
                }
                break;
                case 2:
                let today_data_temp = this.state.today_data
                  for(let i = 0;i< today_data_temp.length;i++){
                    if(today_data_temp[i].id==res.data.result.wid){
                      today_data_temp[i][res.data.result.field] = res.data.result.val;
                    }
                  }
                break;
            }

            this.setState({
            showmodel:false,
            targhtid:[],
            modeldatatitle:'标题',
            value:''
            })
        }) 

  }


  closepicker(){

  }

  closeshowModal(){
    this.setState({
      showmessageboolean:false,
      showmaeeagecontext:''
    })
  }

  //替换内容
  handleClick (value) {
    this.setState({
      current: value
    })
  }
  
  handleChange (value) {
    this.setState({
      value
    })
  }
  
  changemessage(e){
    console.log(e)
    console.log(e.currentTarget.dataset.text)
    console.log('长按')
    if(!this.state.lockstate){

    let  tapid =  e.currentTarget.id
    let tab111 = tapid.split('@@')
    this.setState({
      showmodel:true,
      targhtid:tab111,
      modeldatatitle:this.state.idMname[tab111[0]]
    })
  }else{
    return
  }
  }
  //提交变动
  updatemessage(e){
   Taro.request({
      url:url.locality_address+'/v1/work/modify',
      data:{
        wid:this.state.targhtid[1],
        openid:Taro.getStorageSync('openid'),
        field:this.state.targhtid[0],
        val:this.state.value
      },
      method:'POST',
      header:{  "Content-Type": "application/x-www-form-urlencoded"}
   }).then((res)=>{
      //更改现有数据
      switch(this.state.current){
          case 0:
          let twodayago_data = this.state.twodayago_data
          for(let i = 0;i< twodayago_data.length;i++){
            if(twodayago_data[i].id==this.state.targhtid[1]){
              console.log('1111'+twodayago_data[i][this.state.targhtid[0]])
              twodayago_data[i][this.state.targhtid[0]] = this.state.value;
            }
          }
          break;
          case 1:
          let onedayago_data = this.state.onedayago_data
          for(let i = 0;i< onedayago_data.length;i++){
            if(onedayago_data[i].id==this.state.targhtid[1]){
              console.log('1111'+onedayago_data[i][this.state.targhtid[0]])
              onedayago_data[i][this.state.targhtid[0]] = this.state.value;
            }
          }
          break;
          case 2:
          let today_data_temp = this.state.today_data
            for(let i = 0;i< today_data_temp.length;i++){
              if(today_data_temp[i].id==this.state.targhtid[1]){
                console.log('1111'+today_data_temp[i][this.state.targhtid[0]])
                today_data_temp[i][this.state.targhtid[0]] = this.state.value;
              }
            }
           
          break;
      }

      this.setState({
      showmodel:false,
      targhtid:[],
      modeldatatitle:'标题',
      value:''
      })
   }) 
  }
  
  //关闭模态框
  closeModal = (type, msg) => {
    console.log(msg)
    this.setState({
      showmodel:false,
      targhtid:[],
      modeldatatitle:'标题',
      value:''
    })
  }

   getWeek(date) { 
    let week; 
    if(date.getDay() == 0) week = "星期日" 
    if(date.getDay() == 1) week = "星期一" 
    if(date.getDay() == 2) week = "星期二" 
    if(date.getDay() == 3) week = "星期三" 
    if(date.getDay() == 4) week = "星期四" 
    if(date.getDay() == 5) week = "星期五" 
    if(date.getDay() == 6) week = "星期六" 
    return week; 
} 

 timedat(res){   //res 为传入的时间戳   例：1509091800000

    var time = new Date(res);

    var y = time.getFullYear();

   var m = time.getMonth()+1;

   var d = time.getDate();
 

   return m+'月'+d+'日';    //返回格式  "2017-10-27" 字符串
}

timedaty_m_d(res){   //res 为传入的时间戳   例：1509091800000

  let time1 = new Date(res);

  var y = time1.getFullYear();

 var m = time1.getMonth()+1;

 var d = time1.getDate();

 console.log(res)
 console.log(time1)

 return y+'-'+m+'-'+d;    //返回格式  "2017-10-27" 字符串
}

goregister(){
  Taro.navigateTo({
    url:'/pages/bindname/bindname'
  })
}



}

