import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text ,ScrollView,Button,Picker,Textarea,Input,Image} from '@tarojs/components'
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
        //  AtForm, 
        //  AtSwitch,
         AtSlider,
         AtIcon ,
         AtProgress,
         AtTextarea,
         AtCalendar, 
         AtList
        } from 'taro-ui'
import $ from 'jquery'

let loopload 

let scrollty
let scrolltxx
let scrolltxy

let scrollid = ''

let rangevalue = 50

import  './index.scss'

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
    phone:'',
    current: 2,
    currentdate:0,
    current_today:'',
    
    onedayago:'',
    twodayago:'',

    today_is_edit:false,
    today_data_use:[],
    today_data_full:[],
    today_data:[], 

    onedayago_is_edit:false,
    onedayago_data_use:[],
    onedayago_data_full:[],
    onedayago_data:[],

    twodayago_is_edit:false,
    twodayago_data_use:[],
    twodayago_data_full:[],
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
    categorys: ['开拓', '驱动', '实施', '维护', "协同"],
    itemtitles:['时长(分)',/*'类别',*/'工作项目','工作内容及说明','效率自评','对应目标','驱动自评'],
    moment:['9:00','9:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00'],
    showmodel:false,
    modeldatatitle:'标题',
    value:'',
    idMname:{
      work_start_time:'开始时间',
      length_time:'时长(分)',
      // category:'类别',
      work_project:'工作项目',
      work_content:'工作内容及说明',
      work_efficiency:'效率自评',
      work_effect:'对应目标',
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
    showCalendar:false,
    selectdate:'',
    endtime:'2999/12/31'
    
    
    // {
    //   id: "2",
    //   username: "朱海涛",
    //   openid: "o-GjW5XADtUav0uDKr319xbTe9mk",
    //   title: "任务1",
    //   content: "内容1",
    //   date: "2018-12",
    //   length_time: "100",
    //   create_time: "2018-12-20 09:54:40",
    //   complete_time:'100'
    // }


    // {id: "1",
    // date: "2018-12-14",
    // work_start_time: "9:00",
    // length_time: "0",
    // work_project: "",
    // work_content: "",
    // work_efficiency: "0.0",
    // work_effect: "0.0",
    // work_myself: "0.0"}
  }


  componentWillMount () {
    console.log('载入init')
   
    
   }

  componentDidMount () {
    
    //载入锁定状态
    this.setState({
      lockstate :Taro.getStorageSync('lockstate')
    })
  }

  componentWillUnmount () { }

  componentDidShow () {
    console.log('载入show')

    this.setState({
      username:Taro.getStorageSync('username'),
      phone:Taro.getStorageSync('phone'),
      register:Taro.getStorageSync('register'),
      mydepartment:Taro.getStorageSync('department')
    })

    if(Taro.getStorageSync('phone')==='')
    {
      this.setState({
        showloginmodel:true
      })
      
    }else{
      this.pullmaintask()
      this.pulldata()
    }
    //保持所有div的高度
    setTimeout(()=>{
      // this.flushhight()
    },700)

    //拉取部门列表
    Taro.request({
      url:'https://xyx-mainland-api.raink.com.cn/v1/work/get-department',
    }).then(
      (res)=>{
        res.data.result.forEach((item)=>{
          this.state.department.push(item.department)
        })
        setTimeout(() => {
         let options = ''
         this.state.department.forEach((item)=>{
          
          options += '<option value=\''+item+'\'>'+item+'<\/option>'
         })

        $('#department').after('<select class=\'select\' id=\'departmentselect\'>'+options+'<\/select>')
        }, 1000);

      }

    ).catch(()=>{
      Taro.showToast({
        title:'部门列表获取失败！',
        icon:'none'
      })
    })

  }
    
   

  componentDidHide () { }

  flushhight(){
      let current = this.state.current
      console.log('current'+current);

      //选择每一行
      let $table =  $('#hhhtab'+(parseInt(current+'')+1)+' > div')
      console.log($table );
      
      for(let i = 0;i<$table.length;i++){
         let id_temp =  $($table[i]).attr('id')
        //  let divheight = 50 
        //  let divheight_content = $('#work_content\\@\\@'+id_temp).height()
        //  let divheight_project = $('#work_project\\@\\@'+id_temp).height()
         let divheight =  $('#work_content\\@\\@'+id_temp).height() 
        //  console.log('项目高度:'+divheight_content);
        //  console.log('内容:'+divheight_project);
        //  divheight = divheight_content>=divheight_project?divheight_content:divheight_project
        //  divheight = Math.max(divheight_content,divheight_project)
        //  console.log('最终:'+divheight);

         $('#length_time\\@\\@'+id_temp).height(divheight)
         $('#work_project\\@\\@'+id_temp).height(divheight)
         $('#work_start_time\\@\\@'+id_temp).height(divheight)
         $('#work_efficiency\\@\\@'+id_temp).height(divheight)
         $('#work_effect\\@\\@'+id_temp).height(divheight)
         $('#work_myself\\@\\@'+id_temp).height(divheight)
        //  $('#work_content\\@\\@'+id_temp).height(divheight)

      }

      console.log('高度已经刷新了'); 
      
  }

  pullmaintask(){
     
    //载入主线任务
    Taro.request({
      url:url.locality_address+'/v1/work/task',
      data:{
        phone:Taro.getStorageSync('phone'),
        scene:'web'
      }
    }).then((res)=>{
        if(res.data.code==200){
            this.setState({
              maintask:res.data.result
            })
        }else{
          Taro.showToast({
            title:"主线任务加载失败，检查参数！",
            icon:'none'
          })
        }
    }).catch((res)=>{
        Taro.showToast({
          title:"主线任务加载失败，检查网络！",
          icon:'none'
        })
    })

  }

  pulldata(){
  
    let time
    Taro.request({
      url:url.locality_address+'/v1/work/time'
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
         return (parseInt(res.data.success_msg.time)*1000)
        }

    ).then( 
      (timest)=>{
        this.setState({
          current_today:this.timedaty_m_d(timest),
          selectdate: this.timedaty_m_d(timest), //默认选择为今天
          onedayago:this.timedaty_m_d((timest-86400000)),
          twodayago:this.timedaty_m_d((timest-86400000*2)),
          endtime:this.endtime(timest)
         })
         
         return [this.timedaty_m_d(timest),this.timedaty_m_d((timest-86400000)),this.timedaty_m_d((timest-86400000*2))]
      }
    ).then((timearray)=>{
      //拉取数据
      Taro.request({
        url:url.locality_address+'/v1/work/notes',
        data:{
          phone:Taro.getStorageSync('phone'),
          scene:'web',
          date:timearray[0]
        }
      }).then((res)=>{
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
          today_data_use: dataTemp,
          today_data: dataTemp,
          today_data_full: res.data.success_msg.info,
          today_ext: res.data.success_msg.ext,
        })
      })
      return timearray
    }).then((timearray)=>{
      //拉取数据
      Taro.request({
        url:url.locality_address+'/v1/work/notes',
        data:{
          phone:Taro.getStorageSync('phone'),
          scene:'web',
          date:timearray[1]
        }
      }).then((res)=>{
        let dataTempOne = [];
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
          dataTempOne.push(item);
        });
         this.setState({
          onedayago_data_use: dataTempOne,
          onedayago_data:dataTempOne,
          onedayago_data_full: res.data.success_msg.info,
          onedayago_ext: res.data.success_msg.ext,
        })
      })
      return timearray
    }).then((timearray)=>{
      //拉取数据
      Taro.request({
        url:url.locality_address+'/v1/work/notes',
        data:{
          phone:Taro.getStorageSync('phone'),
          scene:'web',
          date:timearray[2]
        }
      }).then((res)=>{
        let dataTempTwo = [];
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
          dataTempTwo.push(item);
        });
      this.setState({
        twodayago_data_use: dataTempTwo,
        twodayago_data: dataTempTwo,
        twodayago_data_full: res.data.success_msg.info,
        twodayago_ext: res.data.success_msg.ext,
      })
      })
      return timearray
    })

  }

  render () {
    
    const tabList = [{ title:this.state.twodayago }, { title: this.state.onedayago}, { title:this.state.current_today}]
    let {itemtitles} = this.state
    let today_data = this.state.today_data_use
    let onedayago_data = this.state.onedayago_data_use
    let twodayago_data = this.state.twodayago_data_use
    let today_ext = this.state.today_ext
    let onedayago_ext = this.state.onedayago_ext
    let twodayago_ext = this.state.twodayago_ext

    let scorelist = [];
    for (let i=5; i<=10; i=i+0.5) {
      scorelist.push(i);
    }


    let itemcontexttoday =  today_data.map((item)=>{
      if (item.category == null) {
        item.category = '';
      }

      return <View className='tabletitle' id={item.id}>
         <View id={'work_start_time@@'+item.id} style={this.state.resttime.indexOf(item.work_start_time)>-1&&item.work_start_time.length>=5?'color:green':'none'} className='itemcontext itemcontexttime'>{item.work_start_time}</View>
          {/* 时间 */}
         <View id={'length_time@@'+item.id}   className='itemcontext'>
            <Input className='itemcontextinput ' id={'length_time@@'+item.id+'@@input'}onBlur={this.updateinput.bind(this,{max:120,min:10,steap:5})}  value={item.length_time}   ></Input>
         </View>

         {/* 类别 */}
        {/* <View id={'category@@' + item.id} className='itemcontext'>
          <select id={'category@@' + item.id} className='select_item' name="select_name" onChange={this.onCategoryChange}>  
            <option value="">---</option>
            {
              this.state.categorys.map((cate)=>{
                { if (item.category != cate) return <option value={cate}>{cate}</option>  }
                { if (item.category == cate) return <option value={cate} selected>{cate}</option>  }
              })
            }   
          </select>
        </View> */}
        <View id={'work_effect@@'+item.id}   className='itemcontext'>
          <select id={'work_effect@@' + item.id} className='select_item' name="select_name" onChange={this.onCategoryChange}>  
            <option value="">---</option>
            {
              this.state.maintask.map((itemTask)=>{
                { if (item.work_effect != itemTask.title) return <option value={itemTask.title}>{itemTask.title}</option>  }
                { if (item.work_effect == itemTask.title) return <option value={itemTask.title} selected>{itemTask.title}</option>  }
              })
            }    
          </select>
        </View>

          {/* 时间 */} 
         <View id={'work_project@@'+item.id}  className='itemcontext itemcontext_long_project'>
            <Textarea className='itemcontext_longinput_project textarea' id={'work_project@@'+item.id+'@@input'}  onBlur={this.updatetextarea.bind(this)}  value={item.work_project}  ></Textarea>
         </View>
          {/* 时间 */}
         <View id={'work_content@@'+item.id}  className='itemcontext itemcontext_long'>
            <Textarea className='itemcontext_longinput textarea' id={'work_content@@'+item.id+'@@input'}  onBlur={this.updatetextarea.bind(this)}  value={item.work_content}  ></Textarea>
         </View>

         <View id={'work_efficiency@@' + item.id} className='itemcontext'>
          <select id={'work_efficiency@@' + item.id} className='select_item' name="select_name" onChange={this.onCategoryChange}>  
            <option value="">---</option>
            {
              scorelist.map((score)=>{
                { if (item.work_efficiency != score) return <option value={score}>{score}</option>  }
                { if (item.work_efficiency == score) return <option value={score} selected>{score}</option>  }
              })
            }   
          </select>
        </View>

         {/* <View id={'work_effect@@'+item.id}   className='itemcontext'>
          <select id={'work_effect@@' + item.id} className='select_item' name="select_name" onChange={this.onCategoryChange}>  
            <option value="">---</option>
            {
              this.state.maintask.map((itemTask)=>{
                { if (item.work_effect != itemTask.title) return <option value={itemTask.title}>{itemTask.title}</option>  }
                { if (item.work_effect == itemTask.title) return <option value={itemTask.title} selected>{itemTask.title}</option>  }
              })
            }    
          </select>
        </View> */}


         <View id={'work_myself@@' + item.id} className='itemcontext'>
          <select id={'work_myself@@' + item.id} className='select_item' name="select_name" onChange={this.onCategoryChange}>  
            <option value="">---</option>
            {
              scorelist.map((score)=>{
                { if (item.work_myself != score) return <option value={score}>{score}</option>  }
                { if (item.work_myself == score) return <option value={score} selected>{score}</option>  }
              })
            }   
          </select>
        </View>
      
       </View>
     })
 


    let itemcontextoneago = onedayago_data.map((item)=>{
      return <View className='tabletitle' id={item.id}>
      <View id={'work_start_time@@'+item.id} style={this.state.resttime.indexOf(item.work_start_time)>-1&&item.work_start_time.length>=5?'color:green':'none'} className='itemcontext itemcontexttime'>{item.work_start_time}</View>
          {/* 时间 */}
         <View id={'length_time@@'+item.id}   className='itemcontext'>
            <Input className='itemcontextinput ' id={'length_time@@'+item.id+'@@input'}onBlur={this.updateinput.bind(this,{max:120,min:10,steap:5})}  value={item.length_time}   ></Input>
         </View>

         {/* 类别 */}
        {/* <View id={'category@@' + item.id} className='itemcontext'>
          <select id={'category@@' + item.id} className='select_item' name="select_name" onChange={this.onCategoryChange}>  
            <option value="">---</option>
            {
              this.state.categorys.map((cate)=>{
                { if (item.category != cate) return <option value={cate}>{cate}</option>  }
                { if (item.category == cate) return <option value={cate} selected>{cate}</option>  }
              })
            }   
          </select>
        </View> */}

        <View id={'work_effect@@'+item.id}   className='itemcontext'>
          <select id={'work_effect@@' + item.id} className='select_item' name="select_name" onChange={this.onCategoryChange}>  
            <option value="">---</option>
            {
              this.state.maintask.map((itemTask)=>{
                { if (item.work_effect != itemTask.title) return <option value={itemTask.title}>{itemTask.title}</option>  }
                { if (item.work_effect == itemTask.title) return <option value={itemTask.title} selected>{itemTask.title}</option>  }
              })
            }    
          </select>
        </View>

          {/* 时间 */} 
         <View id={'work_project@@'+item.id}  className='itemcontext itemcontext_long_project'>
            <Textarea className='itemcontext_longinput_project textarea' id={'work_project@@'+item.id+'@@input'}  onBlur={this.updatetextarea.bind(this)}  value={item.work_project}  ></Textarea>
         </View>
          {/* 时间 */}
         <View id={'work_content@@'+item.id}  className='itemcontext itemcontext_long'>
            <Textarea className='itemcontext_longinput textarea' id={'work_content@@'+item.id+'@@input'}  onBlur={this.updatetextarea.bind(this)}  value={item.work_content}  ></Textarea>
         </View>

         <View id={'work_efficiency@@' + item.id} className='itemcontext'>
          <select id={'work_efficiency@@' + item.id} className='select_item' name="select_name" onChange={this.onCategoryChange}>  
            <option value="">---</option>
            {
              scorelist.map((score)=>{
                { if (item.work_efficiency != score) return <option value={score}>{score}</option>  }
                { if (item.work_efficiency == score) return <option value={score} selected>{score}</option>  }
              })
            }   
          </select>
        </View>

         {/* <View id={'work_effect@@'+item.id}   className='itemcontext'>
          <select id={'work_effect@@' + item.id} className='select_item' name="select_name" onChange={this.onCategoryChange}>  
            <option value="">---</option>
            {
              this.state.maintask.map((itemTask)=>{
                { if (item.work_effect != itemTask.title) return <option value={itemTask.title}>{itemTask.title}</option>  }
                { if (item.work_effect == itemTask.title) return <option value={itemTask.title} selected>{itemTask.title}</option>  }
              })
            }    
          </select>
        </View> */}


         <View id={'work_myself@@' + item.id} className='itemcontext'>
          <select id={'work_myself@@' + item.id} className='select_item' name="select_name" onChange={this.onCategoryChange}>  
            <option value="">---</option>
            {
              scorelist.map((score)=>{
                { if (item.work_myself != score) return <option value={score}>{score}</option>  }
                { if (item.work_myself == score) return <option value={score} selected>{score}</option>  }
              })
            }   
          </select>
        </View>
      
       </View>
     })

    let itemcontexttwoago = twodayago_data.map((item)=>{
      return  <View className='tabletitle' id={item.id}>
      <View id={'work_start_time@@'+item.id} style={this.state.resttime.indexOf(item.work_start_time)>-1&&item.work_start_time.length>=5?'color:green':'none'} className='itemcontext itemcontexttime'>{item.work_start_time}</View>
          {/* 时间 */}
         <View id={'length_time@@'+item.id}   className='itemcontext'>
            <Input className='itemcontextinput ' id={'length_time@@'+item.id+'@@input'}onBlur={this.updateinput.bind(this,{max:120,min:10,steap:5})}  value={item.length_time}   ></Input>
         </View>

         {/* 类别 */}
        {/* <View id={'category@@' + item.id} className='itemcontext'>
          <select id={'category@@' + item.id} className='select_item' name="select_name" onChange={this.onCategoryChange}>  
            <option value="">---</option>
            {
              this.state.categorys.map((cate)=>{
                { if (item.category != cate) return <option value={cate}>{cate}</option>  }
                { if (item.category == cate) return <option value={cate} selected>{cate}</option>  }
              })
            }   
          </select>
        </View> */}

        <View id={'work_effect@@'+item.id}   className='itemcontext'>
          <select id={'work_effect@@' + item.id} className='select_item' name="select_name" onChange={this.onCategoryChange}>  
            <option value="">---</option>
            {
              this.state.maintask.map((itemTask)=>{
                { if (item.work_effect != itemTask.title) return <option value={itemTask.title}>{itemTask.title}</option>  }
                { if (item.work_effect == itemTask.title) return <option value={itemTask.title} selected>{itemTask.title}</option>  }
              })
            }    
          </select>
        </View>

          {/* 时间 */} 
         <View id={'work_project@@'+item.id}  className='itemcontext itemcontext_long_project'>
            <Textarea className='itemcontext_longinput_project textarea' id={'work_project@@'+item.id+'@@input'}  onBlur={this.updatetextarea.bind(this)}  value={item.work_project}  ></Textarea>
         </View>
          {/* 时间 */}
         <View id={'work_content@@'+item.id}  className='itemcontext itemcontext_long'>
            <Textarea className='itemcontext_longinput textarea' id={'work_content@@'+item.id+'@@input'}  onBlur={this.updatetextarea.bind(this)}  value={item.work_content}  ></Textarea>
         </View>

         

         <View id={'work_efficiency@@' + item.id} className='itemcontext'>
          <select id={'work_efficiency@@' + item.id} className='select_item' name="select_name" onChange={this.onCategoryChange}>  
            <option value="">---</option>
            {
              scorelist.map((score)=>{
                { if (item.work_efficiency != score) return <option value={score}>{score}</option>  }
                { if (item.work_efficiency == score) return <option value={score} selected>{score}</option>  }
              })
            }   
          </select>
        </View>

         


         <View id={'work_myself@@' + item.id} className='itemcontext'>
          <select id={'work_myself@@' + item.id} className='select_item' name="select_name" onChange={this.onCategoryChange}>  
            <option value="">---</option>
            {
              scorelist.map((score)=>{
                { if (item.work_myself != score) return <option value={score}>{score}</option>  }
                { if (item.work_myself == score) return <option value={score} selected>{score}</option>  }
              })
            }   
          </select>
        </View>
      
       </View>

     })



let title2 = <View className='itemtitleplus' id='ScrollView222'>
              <View className='tabletitle'>
                {/* {itemtitle} */}
                <View className='itemtitle itemtitletime'>时间</View>
                <View className='itemtitle' >{'时长(分)'}</View>
                <View className='itemtitle' >{'对应目标'}</View>
                {/* <View className='itemtitle' >{'类别'}</View> */}
                <View className='itemtitle itemtitle_long_project'>{'工作项目'}</View>
                <View className='itemtitle itemtitle_long'>{'工作内容及说明'}</View>
                <View className='itemtitle' >{'效率自评'}</View>
                
                <View className='itemtitle itemcontextright' >{'驱动自评'}</View>
              </View>
            </View>


    // 下半部分
let context = <View className='logcontext'>
                  <View className='table' id='hhhtab3'>
                        {itemcontexttoday}
                  </View>
              </View>


let context1 = <View className='logcontext' >
                  <View className='table' id='hhhtab2'>
                        {itemcontextoneago}
                  </View>
               </View>



let context2 = <View className='logcontext' >
                    <View className='table' id='hhhtab1'>
                          {itemcontexttwoago}
                    </View>
               </View>


      let tasklist = this.state.maintask.map((item)=>{
        return  <View className='maintaskitem'>
                  <Text className='tasktitle'>{item.title}</Text>
                      <View className='taskcontext' > 
                      <AtProgress percent={parseInt(item.complete_time)} status={parseInt(item.complete_time)==100?'success':'progress'} />
                  </View>
                </View>
      })

  
    return (
      <View className='index'>
        <View className='icontitle'>
          <Image src='https://cdn-xyx.raink.com.cn/elsfkxxk/201901051546668599.png'   style='height: 57px;width: 145px;margin: 5px  0 0 25px;'></Image>
          {this.state.register.state && 
          <AtButton size='small' className='exit' onClick={this.exit.bind(this)}>退出</AtButton>
          }
        </View>

   
          {this.state.register.state && 
          <View className="title">
              <View className='userinfo'>
                {/* <AtAvatar className='touxiang' openData={this.state.userinfo} circle={true} size="small"></AtAvatar> */} 
                {this.state.register.state && 
                <Text>{this.state.mydepartment}-</Text>
                }
                <Text className="username">{this.state.register.state?this.state.username:'欢迎'}</Text>
              </View>
            
              <Text className='currenttime'>{this.state.currenttime}</Text>
                <View className='task' onClick={this.tomaintask}>
                  <Text className='text'>主线任务</Text>
                  <AtIcon className='icon' value='clock' size='15' color='#888' ></AtIcon>
                </View>
                

                  {this.state.register.state && 
              <AtButton size='small' type='primary' className='history' onClick={this.showhistory.bind(this)} customStyle=' margin: 0 0 0 0 ;' >历史日志</AtButton>
              }
          </View>
           }


         {this.state.register.state &&

            <View
            className='maintaskscroll'
            id='ScrollViewtask' 
            >
            
            {this.state.maintask.length<=0 && 
            <View className='maintaskempty'>
              <Text>暂无任务</Text>
            </View>
            }
            {this.state.maintask.length>0 && 
            <View className='maintask' onClick={this.tomaintask}>
              {tasklist}
              </View>
            }
        
          </View>
           }
        
        <View className='contentplus'>
        <View className='content'>
    

       {this.state.register.state && 
       <AtTabs current={this.state.current}  tabList={tabList} onClick={this.handleClick.bind(this)} swipeable={false}>
        <AtTabsPane current={this.state.current} index={0} className='tabs' >  
        <View className='test1'>
          {title2}
          {context2}
          </View>
          <View className='bottom_self'>今日工作要点自评:</View>
          <View id={'daily_sum@@' + twodayago_ext.id} className='bottom_value'>
            <Textarea className='bottom_value_input' id={'daily_sum@@'+twodayago_ext.id+'@@input'}  onBlur={this.updatetextarea_ext.bind(this)}  value={twodayago_ext.daily_sum}  ></Textarea>
          </View>
        </AtTabsPane>
        <AtTabsPane current={this.state.current} index={1}>
        <View className='test1'>
          {title2}
          {context1}
          </View>
          <View className='bottom_self'>今日工作要点自评:</View>
          <View id={'daily_sum@@' + onedayago_ext.id} className='bottom_value'>
            <Textarea className='bottom_value_input' id={'daily_sum@@'+onedayago_ext.id+'@@input'}  onBlur={this.updatetextarea_ext.bind(this)}  value={onedayago_ext.daily_sum}  ></Textarea>
          </View>
        </AtTabsPane>
        <AtTabsPane current={this.state.current} index={2}>
          <View className='test1'>
          {title2}
          {context}
          </View>
          <View className='bottom_self'>今日工作要点自评:</View>
          <View id={'daily_sum@@' + today_ext.id} className='bottom_value'>
            <Textarea className='bottom_value_input' id={'daily_sum@@'+today_ext.id+'@@input'}  onBlur={this.updatetextarea_ext.bind(this)}  value={today_ext.daily_sum}  ></Textarea>
          </View>
        </AtTabsPane>

        </AtTabs>
          }

</View>
</View>
          

        <AtModal isOpened={this.state.showloginmodel} closeOnClickOverlay={false} onClose={this.closeloginModal.bind(this, 1, '点击了确定')}>
          <AtModalHeader>登录</AtModalHeader>
          <AtModalContent>
            <View className='delmode'>
                        <View  className="department">
                          <Text id='department'>部门:</Text>
                        </View>
                        <View className="formstyle">
                            <AtInput
                              name='value'
                              type='text'
                              placeholder='请输入姓名'
                              value={this.state.username}
                              onChange={this.nameChange.bind(this)}
                              customStyle='padding:15rpx 0'
                            />

                    
                            <AtInput
                              name='value'
                              type='text'
                              placeholder='请输入手机号码'
                              value={this.state.phone}
                              onChange={this.changePhone.bind(this)}
                              customStyle='padding:15rpx 0'
                            />
                        </View>
            </View>
          </AtModalContent>
          <AtModalAction>

            <Button
              style='color:#6190E8'
              onClick={this.login.bind(this, 1, '点击了登录')}
            >
              确定
            </Button>
          </AtModalAction>
        </AtModal>

        
        <AtModal  isOpened={this.state.showCalendar}  onClose={this.closeloginModal.bind(this, 1, '点击了确定')} className='model'>
          <AtModalHeader>历史日志</AtModalHeader>
          <AtModalContent>
            <View className='delmode'>
             <AtCalendar format='YYYY-MM-DD'  minDate='2018/1/1' maxDate={this.state.endtime} onDayClick={this.datechange.bind(this)} />
            </View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.closeCalendar.bind(this, 1, '点击了取消')}>
              取消
            </Button>

            <Button
              style='color:#6190E8'
              onClick={this.gohistory.bind(this, 1, '点击了登录')}
            >
              确定
            </Button>
          </AtModalAction>
        </AtModal>

      </View>
    )
  }

  datechange(e){
    console.log(e);
    this.setState({
      selectdate:e.value
    })
  }


  gohistory(){
    Taro.navigateTo({
      url:'/pages/history/history?date='+this.state.selectdate+'&today='+this.state.current_today
    })

    this.closeCalendar()
  }

  closeCalendar(){
    this.setState({
      showCalendar:false,
      
    })
  
  }

  showhistory(e){
      this.setState({
        showCalendar:true,
      })
  }


  exit(e){
    Taro.removeStorageSync('lockstate')
    Taro.removeStorageSync('locktaskstate')
    Taro.removeStorageSync('phone')
    Taro.removeStorageSync('register')
    Taro.removeStorageSync('sysinfo')
    Taro.removeStorageSync('taroRouterStore')
    Taro.removeStorageSync('username')
    location.reload()
  }

  changerange(e){
 
    rangevalue = e.detail.value
    this.setState({
      value:rangevalue
    })
 
  }



  updateinput(scope,e){
    console.log('updateinput-'+e);
    let targetid = e.target.id
    let param  = targetid.split('@@')
    console.log(param)

    console.log(parseFloat(e.detail.value))
    console.log(scope.min)
    console.log(scope.max)
    console.log(scope.steap)
    console.log(parseFloat(e.detail.value)%parseFloat(scope.steap))

    
    if(e.detail.value!=''){
        console.log('进来了1')
        if(parseFloat(e.detail.value)<scope.min||parseFloat(e.detail.value)>scope.max||(parseFloat(e.detail.value)%parseFloat(scope.steap))!=0){
          console.log('进来了2')
            Taro.showToast({
              title:'当前格位范围为:'+scope.min+'-'+scope.max+' 步进为:'+scope.steap+'请检查内容',
              icon:'none',
              duration:2000
            })  
           
            this.setState({
              random:Math.random()
            })
            return
        }   
    } 

    Taro.request({
      url:url.locality_address+'/v1/work/modify',
      data:{  
        wid:param[1],
        phone:Taro.getStorageSync('phone'),
        scene:'web',
        field:param[0],
        val:e.detail.value
      },
      method:'POST',
      header:{  "Content-Type": "application/x-www-form-urlencoded"}
   }).then((res)=>{
    //更改现有数据
    this.updatePageData(res);
   }) 
  }

  onCategoryChange(e){
    let targetid = e.target.id
    let param  = targetid.split('@@')
    console.log(param)
    Taro.request({
      url:url.locality_address+'/v1/work/modify',
      data:{  
        wid:param[1],
        phone:Taro.getStorageSync('phone'),
        scene:'web',
        field:param[0],
        val:e.target.value
      },
      method:'POST',
      header:{  "Content-Type": "application/x-www-form-urlencoded"}
      }).then((res)=>{
        //更改现有数据
        this.updatePageData(res);
    }) 
  }

  updatetextarea(e) {
    console.log(e);
    let targetid = e.target.id
    let param  = targetid.split('@@')
    console.log(param)
    Taro.request({
      url:url.locality_address+'/v1/work/modify',
      data:{  
        wid:param[1],
        phone:Taro.getStorageSync('phone'),
        scene:'web',
        field:param[0],
        val:e.target.value
      },
      method:'POST',
      header:{  "Content-Type": "application/x-www-form-urlencoded"}
      }).then((res)=>{
        this.updatePageData(res);
    }) 
  }

  updatePageData(res)
  {
    //更改现有数据
    switch(this.state.current){
      case 0:
      {
        let twodayago_data = this.state.twodayago_data_full
        for(let i = 0;i< twodayago_data.length;i++){
          if(twodayago_data[i].id==res.data.result.wid){
            twodayago_data[i][res.data.result.field] = res.data.result.val;
          }
        }
        let dataTemp = [];
        twodayago_data.map((item)=>{
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
        this.state.twodayago_data = dataTemp;
      }
      break;
      case 1:
      {
        let onedayago_data = this.state.onedayago_data_full
        for(let i = 0;i< onedayago_data.length;i++){
          if(onedayago_data[i].id==res.data.result.wid){
            onedayago_data[i][res.data.result.field] = res.data.result.val;
          }
        }
        let dataTemp = [];
        onedayago_data.map((item)=>{
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
        this.state.onedayago_data = dataTemp;
      }
      break;
      case 2:
      {
        let today_data_temp = this.state.today_data_full
        for(let i = 0;i< today_data_temp.length;i++){
          if(today_data_temp[i].id==res.data.result.wid){
            today_data_temp[i][res.data.result.field] = res.data.result.val;
          }
        }
        let dataTemp = [];
        today_data_temp.map((item)=>{
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
        this.state.today_data = dataTemp;
      }
      break;
    }
  }

  //修改自评文本
  updatetextarea_ext(e) {
    console.log(e);
    let targetid = e.target.id
    let param  = targetid.split('@@')
    console.log(param)
    Taro.request({
      url:url.locality_address+'/v1/work/modify',
      data:{  
        wid:param[1],
        phone:Taro.getStorageSync('phone'),
        scene:'web',
        field:param[0],
        val:e.target.value
      },
      method:'POST',
      header:{  "Content-Type": "application/x-www-form-urlencoded"}
      }).then((res)=>{
        //更改现有数据
        switch(this.state.current){
            case 0:
            this.state.twodayago_ext.daily_sum = res.data.result.val;
            break;
            case 1:
            this.state.onedayago_ext.daily_sum = res.data.result.val;
            break;
            case 2:
            this.state.today_ext.daily_sum = res.data.result.val;
            break;
        }
    }) 
  }

  login(){
    const phoneverfy =  /(?:^1[3456789]|^9[28])\d{9}$/

    if(this.state.username.length>7||this.state.username.length<=0){
      Taro.showToast({
        title:'名字长度应在1-7字',
        icon:'none'
      })

    }else{
      if(!phoneverfy.test(this.state.phone)){
            Taro.showToast({
              title:'手机号格式不正确',
              icon:'none'
            })
            return
          
      }

      let dep = $('#departmentselect').val();

      if(dep=='-请选择-'){
        Taro.showToast({
          title:'请选择部门!',
          icon:'none'
      })
      return
    }

    Taro.request({
      url:url.locality_address+'/v1/work/phone-login',
      data:{
        username:this.state.username,
        phone:this.state.phone,
        scene:'web',
        department:dep
      },
      method:'POST',
      header:{  "Content-Type": "application/x-www-form-urlencoded"}
      }).then((res)=>{
        if(res.data.code==200){
        Taro.setStorageSync('username',this.state.username)
        Taro.setStorageSync('phone',this.state.phone)
        Taro.setStorageSync('register',{msg:'success',state:true})
        Taro.setStorageSync('department',$('#departmentselect').val())
        this.setState({
          register:{msg:'success',state:true},
          mydepartment:$('#departmentselect').val()
        })
        Taro.showLoading({
          title:'请稍后',
          mask:true,
        })
        setTimeout(() => {
          Taro.hideLoading()
          this.setState({
            showloginmodel:false
          })
          this.pullmaintask()
          this.pulldata()
        }, 1000); 

      }else{
        Taro.showToast({
          title:'网络出错！- '+res.data.code,
          icon:'none'
        })
      }
    }).catch((res)=>{
      Taro.showToast({
        title:'网络出错！'+res.data.code,
        icon:'none'
      })
    })

  }

  }


  closeloginModal(){

  }

  nameChange(value){
    this.setState({
      username:value
    })
  }


  changePhone (value) {
    this.setState({
      phone:value
    })
  }

  tomaintask(e){
    Taro.navigateTo({
      url:'/pages/maintask/maintask'
    })
  }



  showmessage(e){

    console.log('断案')

    let  tapid =  e.currentTarget.id
    let tab111 = tapid.split('@@')
    console.log(tab111)

    this.setState({
      targhtid:tab111,
      modeldatatitle:this.state.idMname[tab111[0]]
    })

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
              phone:Taro.getStorageSync('phone'),
              scene:'web',
              field:'length_time',
              val:e.detail.value
            },
            method:'POST',
            header:{  "Content-Type": "application/x-www-form-urlencoded"}
        }).then((res)=>{
            //更改现有数据
            this.updatePageData(res);

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
      showmaeeagecontext:'',
      targhtid:[],
      modeldatatitle:'标题',
    })
  }

  //替换内容
  handleClick (value) {

    console.log(value)
    this.setState({
      current: value,
      scrolltitlex:0,
      scrolltitley:0,
      contextscrolltitley:0,
      contextscrolltitlex:0
    })
    
      clearTimeout(
       scrollty
       )

      clearTimeout(
        scrolltxx
       )

       clearTimeout(
        scrolltxy
       )

      setTimeout(() => {
        // this.flushhight()
      }, 700);

      switch (this.state.current) {
        case 0:
        this.state.twodayago_is_edit = !this.state.twodayago_is_edit;
          if (this.state.twodayago_is_edit) {
            this.setState({
              twodayago_data_use: this.state.twodayago_data_full
            }) 
          } else {
            this.setState({
              twodayago_data_use: this.state.twodayago_data
            }) 
          }
          
          break;
        case 1:
          this.state.onedayago_is_edit = !this.state.onedayago_is_edit;
          if (this.state.onedayago_is_edit) {
            this.setState({
              onedayago_data_use: this.state.onedayago_data_full
            }) 
          } else {
            this.setState({
              onedayago_data_use: this.state.onedayago_data
            }) 
          }
          break;
        case 2:
          this.state.today_is_edit = !this.state.today_is_edit;
          if (this.state.today_is_edit) {
            this.setState({
              today_data_use: this.state.today_data_full
            }) 
          } else {
            this.setState({
              today_data_use: this.state.today_data
            }) 
          }
         break;
      }
      
  }
  
  handleChangeinput (value) {
    console.log(value)
    this.setState({
      value:value
    })
  }

  handleChange (e) {
    console.log(e)

    this.setState({
      value:e.nativeEvent.target.value
    })
  }
  
  changemessage(textareasize,e){

    console.log(e)
    console.log('长按')
    

    let  tapid =  e.currentTarget.id
    let tab111 = tapid.split('@@')
    this.setState({
      showmodel:true,
      targhtid:tab111,
      modeldatatitle:this.state.idMname[tab111[0]],
      textareasize:textareasize
    })

    
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
      value:text
    })
  }

  //提交变动
  updatemessage(e){
    console.log(e);
    
   Taro.request({
      url:url.locality_address+'/v1/work/modify',
      data:{  
        wid:this.state.targhtid[1],
        phone:Taro.getStorageSync('phone'),
        scene:'web',
        field:this.state.targhtid[0],
        val:this.state.value
      },
      method:'POST',
      header:{  "Content-Type": "application/x-www-form-urlencoded"}
   }).then((res)=>{
      //更改现有数据
      switch(this.state.current){
          case 0:
          {
            let twodayago_data = this.state.twodayago_data_full
            for(let i = 0;i< twodayago_data.length;i++){
              if(twodayago_data[i].id==this.state.targhtid[1]){
                console.log('1111'+twodayago_data[i][this.state.targhtid[0]])
                twodayago_data[i][this.state.targhtid[0]] = this.state.value;
              }
            }
            let dataTemp = [];
            twodayago_data.map((item)=>{
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
            this.state.twodayago_data = dataTemp;
          }
          break;
          case 1:
          {
            let onedayago_data = this.state.onedayago_data_full
            for(let i = 0;i< onedayago_data.length;i++){
              if(onedayago_data[i].id==this.state.targhtid[1]){
                console.log('1111'+onedayago_data[i][this.state.targhtid[0]])
                onedayago_data[i][this.state.targhtid[0]] = this.state.value;
              }
            }
            let dataTemp = [];
            onedayago_data.map((item)=>{
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
            this.state.onedayago_data = dataTemp;
          }
          break;
          case 2:
          {
            let today_data_temp = this.state.today_data_full
            for(let i = 0;i< today_data_temp.length;i++){
              if(today_data_temp[i].id==this.state.targhtid[1]){
                console.log('1111'+today_data_temp[i][this.state.targhtid[0]])
                today_data_temp[i][this.state.targhtid[0]] = this.state.value;
              }
            }

            let dataTemp = [];
            today_data_temp.map((item)=>{
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
            this.state.today_data = dataTemp;
            console.log('today_data.length='+dataTemp.length);
          }
          break;
      }

      this.setState({
      showmodel:false,
      targhtid:[],
      modeldatatitle:'标题',
      value:'',
      showrankmodel:false
      })
      setTimeout(() => {
        // this.flushhight()
      }, 700); 
     
   }) 
  }

  changerank(e){
    this.setState({
      value:e.value
    })
  }
  
  //关闭模态框
  closeModal = (type, msg) => {
    console.log(msg)
    this.setState({
      showmodel:false,
      targhtid:[],
      modeldatatitle:'标题',
      value:'',
      showrankmodel:false,
      ischangetime:false
    })
  }

  showrankmodel(e){

    console.log(e)
    console.log(e.currentTarget.dataset.text)
    console.log('长按')
    console.log(this.state)
    if(!this.state.lockstate){

    let  tapid =  e.currentTarget.id
    let tab111 = tapid.split('@@')

    let text = ''


    //定义滑动条范围
    if(tab111[0]=='work_efficiency'||tab111[0]=='work_effect'||tab111[0]=='work_myself')
    {
      $('#range1').attr(this.state.ranklong)
    }else if(tab111[0]=='length_time'){
      $('#range1').attr(this.state.timelong)
    }

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
    console.log(typeof text)

    if(tab111[0]=='length_time'){
      this.setState({
        ischangetime: true,
        value:text===''||!text?'10':text,
      })
     
    }else{
      this.setState({
        value:text===''||!text?'1':text,
      })
    }

  
    this.setState({
      showrankmodel:true,
      targhtid:tab111,
      modeldatatitle:this.state.idMname[tab111[0]],
    
    })
  }else{
    return
  }

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
 if(m<10){
   m='0'+m
 }

 var d = time1.getDate();

 if(d<10){
  d='0'+d
}


 return y+'-'+m+'-'+d;    //返回格式  "2017-10-27" 字符串
}

endtime(res){   //res 为传入的时间戳   例：1509091800000

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


 return y+'/'+m+'/'+d;    //返回格式  "2017-10-27" 字符串
}

goregister(){
  Taro.navigateTo({
    url:'/pages/bindname/bindname'
  })
}



}

