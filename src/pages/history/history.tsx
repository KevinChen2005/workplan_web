import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text ,ScrollView,Button,Picker,Textarea,Input,Image} from '@tarojs/components'
import { AtButton , AtModal, AtModalHeader, AtModalContent, AtModalAction ,AtCalendar} from 'taro-ui'



import  './history.scss'

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
    navigationBarTitleText: '历史工作'
  }

  state={
    userinfo:{type: 'userAvatarUrl'},
    currenttime:'',
    register:{msg:'error',state:false},
    username:'',
    phone:'',
    current: 2,
    currentdate:0,
    current_today:'',
    onedayago:'',
    twodayago:'',
    today_data:[], 
    onedayago_data:[],
    twodayago_data:[],
    today_ext: {
      id: '1',
      daily_sum: '',
    },
    onedayago_ext: {
      id: '1',
      daily_sum: '',
    },
    twodayago_ext: {
      id: '1',
      daily_sum: '',
    },
    itemtitles:['时长(分)','类别','工作项目','工作内容及说明','效率指数','效果指数','驱动指数'],
    moment:['9:00','9:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00'],
    showmodel:false,
    modeldatatitle:'标题',
    value:'',
    idMname:{
      work_start_time:'开始时间',
      length_time:'时长(分)',
      category:'类别',
      work_project:'工作项目',
      work_content:'工作内容及说明',
      work_efficiency:'效率自评',
      work_effect:'效果自评',
      work_myself:'驱动自评',
    },
    targhtid:[],
    showmessageboolean:false,
    showmaeeagecontext:'',
    systemheight:'',
    resttime:'08:00,08:30,12:00,12:30,13:00,13:30,18:00,18:30,19:00,19:30,20:00,20:30,21:00',
    lockstate:false,
    functioncControlict:{

    },
    scrolltitlex:0,
    scrolltitley:0,
    showrankmodel:false,
    contextscrolltitlex:0,
    contextscrolltitley:0,
    ischangetime:false,
    maintask:[],
    showloginmodel:false,
    isinput:false,
    rangevalue:50,
    timelong:{min:10,max:120,step:5},
    ranklong:{min:1,max:10,step:0.5},
    textareasize:400,
    inputfocus:false,
    primitivedata:'',
    random:0.0,
    department:['-请选择-'],
    mydepartment:'',
    time:'2019-01-08',
    showCalendar:false,
    selectdate:''
    
  }


  componentWillMount () {
  
  }

  componentDidMount () {
    
  }

  componentWillUnmount () { 

  }

  componentDidShow () {
    this.state.time=this.$router.params.date
    this.state.current_today = this.$router.params.today
    console.log('current date = ' + this.state.current_today)
    console.log('select date = ' + this.state.time)
    this.pulldata(this.$router.params.date)
  }
    
  componentDidHide () { 

  }

  pulldata(time){
    console.log('history pulldata time='+time);
      Taro.request({
        url:url.locality_address+'/v1/work/notes',
        data:{
          phone:Taro.getStorageSync('phone'),
          scene:'web',
          date:time
        }
      }).then((res)=>{
        console.log(res.data.success_msg.info);
        let dataTemp = [];
        res.data.success_msg.info.map((item)=>{
          if (
            (item.length_time == null || item.length_time == '') && 
            (item.category == null || item.category == '') && 
            (item.work_project == null || item.work_project == '') && 
            (item.work_content == null || item.work_content == '') && 
            (item.work_efficiency == null || item.work_efficiency == 0) && 
            (item.work_effect == null || item.work_effect == 0) && 
            (item.work_myself == null || item.work_myself == 0) 
          ) {
            return;
          }
          dataTemp.push(item);
        });
         this.setState({
          today_data:dataTemp,
          today_ext: res.data.success_msg.ext,
         })
      })
  }

  render () {
    let today_data = this.state.today_data
    let today_ext = this.state.today_ext

    let itemcontexttoday =  today_data.map((item)=>{
      return <View className='tabletitle' id={item.id}>
         <View id={'work_start_time@@'+item.id} style={this.state.resttime.indexOf(item.work_start_time)>-1&&item.work_start_time.length>=5?'color:green':'none'} className='itemcontext-his itemcontexttime'>{item.work_start_time}</View>
          {/* 时间 */}
         <View id={'length_time@@'+item.id}   className='itemcontext-his'>
            {item.length_time}
         </View>
         {/* 类别 */} 
         <View id={'category@@'+item.id}  className='itemcontext-his'>
            {item.category}
         </View>

          {/* 时间 */} 
         <View id={'work_project@@'+item.id}  className='itemcontext-his itemcontext_long_project'>
            {item.work_project}
         </View>
          {/* 时间 */}
         <View id={'work_content@@'+item.id}  className='itemcontext-his itemcontext_long'>
          {item.work_content}
         </View>
          {/* 时间 */}
         <View id={'work_efficiency@@'+item.id}   className='itemcontext-his'>
          {item.work_efficiency} 
         </View>
          {/* 时间 */}
         <View id={'work_effect@@'+item.id}   className='itemcontext-his'>
          {item.work_effect}
         </View>
          {/* 时间 */}
         <View id={'work_myself@@'+item.id}  className='itemcontext-his itemcontextright'>
            {item.work_myself}
         </View>
      
       </View>
     })
 

let title2 = <View className='itemtitleplus' id='ScrollView222'   >
    {/* <View className='itemtitle'>开始时间</View> */}



            <View className='tabletitle-dis'>
              {/* {itemtitle} */}
              <View className='itemtitle-his itemtitletime'>时间</View>
              <View className='itemtitle-his' >{'时长(分)'}</View>
              <View className='itemtitle-his' >{'类别'}</View>
              <View className='itemtitle-his itemtitle_long_project'>{'工作项目'}</View>
              <View className='itemtitle-his itemtitle_long'>{'工作内容及说明'}</View>
              <View className='itemtitle-his' >{'效率自评'}</View>
              <View className='itemtitle-his' >{'对应目标'}</View>
              <View className='itemtitle-his itemcontextright' >{'驱动自评'}</View>
            </View>

</View>


    // 下半部分
let context = <View className='logcontext'>
                  <View className='table' id='hhhtab3'>
                        {itemcontexttoday}
                  </View>
              </View>
  
    return (
      <View className='index'>
            <View className='icontitle'>
              <View className='backplus'>
                <Image src='https://cdn-xyx.raink.com.cn/elsfkxxk/201901051546668599.png'   style='height: 57px;width: 145px;margin: 5px  0 0 25px;'></Image>
                <AtButton size='small' circle={true} type='secondary' className='back' onClick={this.back.bind(this)}>返回</AtButton>
              </View>
              <AtButton size='small' type='primary' className='exit' onClick={this.showhistory.bind(this)} >日历</AtButton>
            </View>

            <View className='contentplus'>

            <View className='fyview'>
              <AtButton size={'small'} className='exit' onClick={this.last.bind(this)} >上一天</AtButton>
              <Text>{this.state.time}</Text>
              <AtButton size={'small'} className='exit' disabled={this.state.current_today == this.state.time} onClick={this.next.bind(this)} >下一天</AtButton>
            </View>

            <View className='content'>
                <View className='test1'>
                {title2}
                {context}
                </View>
                <View className='bottom_self'>今日工作要点自评:</View>
                <View id={'daily_sum@@' + today_ext.id} className='bottom_value'>
                {today_ext.daily_sum}
                </View>
            </View>
            </View>


          <AtModal  isOpened={this.state.showCalendar}   className='model'>
          <AtModalHeader>历史日志</AtModalHeader>
          <AtModalContent>
            <View className='delmode'>
             <AtCalendar format='YYYY-MM-DD'  minDate='2018/1/1' maxDate={this.maxdate()} onDayClick={this.datechange.bind(this)} />
            </View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.closeCalendar.bind(this, 1, '点击了取消')}>
              取消
            </Button>

            <Button
              style='color:#6190E8'
              onClick={this.flashdata.bind(this, 1, '点击了登录')}
            >
              确定
            </Button>
          </AtModalAction>
        </AtModal>

 
      </View>
    )
  }

  back(){
    Taro.navigateBack()
  }

  
  showhistory(e){
    this.setState({
      showCalendar:true,
    })
}


  datechange(e){
    this.setState({
      selectdate:e.value
    })
  }
  
  flashdata(e){
    if(this.state.selectdate==''){
      this.closeCalendar()
        return
    }else if(this.state.selectdate==this.state.time){
      this.closeCalendar()
        return
    }else{
      this.state.time = this.state.selectdate
      this.pulldata(this.state.time)
    }

    this.closeCalendar()
  }

  closeCalendar(){
    this.setState({
      showCalendar:false,
    })
  
  }

maxdate(){
  let date = this.state.current_today.replace(/-/g,'/'); 
  return date;
}

next(e){
  var date = this.state.time+' 17:00:00.0';
  date = date.substring(0,19);    
  date = date.replace(/-/g,'/'); 
  var timestamp = (new Date(date).getTime()+86400000);
  this.state.time = this.timedaty_m_d(timestamp)
  this.pulldata(this.state.time)
}

last(e){
  var date = this.state.time+' 17:00:00.0';
  date = date.substring(0,19);    
  date = date.replace(/-/g,'/'); 
  var timestamp = (new Date(date).getTime()-86400000);
  this.state.time = this.timedaty_m_d(timestamp)
  this.pulldata(this.state.time)
}
  

timedaty_m_d(res){   //res 为传入的时间戳   例：1509091800000

  let time1 = new Date(res);

  var y = time1.getFullYear();

 var m = time1.getMonth()+1;
 if(m<10){
   m='0'+m
 }

 var d = time1.getDate();

 if(d<10){
  d='0'+d
}


 return y+'-'+m+'-'+d;    //返回格式  "2017-10-27" 字符串
}

  
}

