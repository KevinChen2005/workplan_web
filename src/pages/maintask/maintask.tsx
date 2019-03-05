import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text ,ScrollView,Button,Picker,Textarea,Input,Image} from '@tarojs/components'
import {
         AtCard,
         AtIcon,
         AtModal, 
         AtModalHeader, 
         AtModalContent,
         AtModalAction,
         AtInput, 
         AtTextarea,
         AtProgress,
         AtActionSheet, 
         AtActionSheetItem,
         AtSwitch,
         AtSlider,
         AtButton
        } from 'taro-ui'
        import $ from 'jquery'


import  './maintask.scss'

import url from '../../utils/url'

export default class Maintask extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '主线任务'
  }

  //task格式
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

  state={
    maintask:[],
    showaddmodel:false,
    addtitle:'',
    addcontext:'',
    addtime:'',
    showSheetstate:false,
    cardid:'',
    locktaskstate:false,
    currenttime:{
      length_time:'',
      complete_time:''
    },
    currenttask:{
      id: "2",
      username: "朱海涛",
      openid: "o-GjW5XADtUav0uDKr319xbTe9mk",
      title: "任务1",
      content: "内容1",
      date: "2018-12",
      length_time: "100",
      create_time: "2018-12-20 09:54:40",
      complete_time:'100'
    },
    complete_time_temp:0,
    deltitle:'',
    showupdatetime:false,
    showdelTask:false,
    showUpdatetask:false,
    islogin:false,
    complete_time:''
  }


  componentWillMount () {

  }

  componentDidMount () {
  }

  componentWillUnmount () { }

  componentDidShow () {

    if(Taro.getStorageSync('phone')===''){
      this.setState({
        islogin:true
      })
      return
    }else{
      this.setState({
        islogin:false
      })
    }
    //载入主线任务
    Taro.request({
      url:url.locality_address+'/v1/work/task',
      data:{
        phone:Taro.getStorageSync('phone'),
        scene:'web',
      }
    }).then((res)=>{
        if(res.data.code==200){
            this.setState({
              maintask:res.data.result
            })
        }
    })

    this.setState({
      locktaskstate:Taro.getStorageSync('locktaskstate')
    }
    )

    //返回时重置
    this.setState({
      showSheetstate:false,
      cardid:''
    })
  }

  componentDidHide () { }

emptyfunction(){}

  render () {
    //列表渲染
    let maintasklist = this.state.maintask
    let tasklist = maintasklist.map((item)=>{
        return   <View className='card' id={item.id} onClick={this.showSheet.bind(this)}>
             
            <AtCard
              extra={item.create_time}
              title={item.title}
            >
              {item.content}
              <AtProgress percent={parseInt(item.complete_time)} status={parseInt(item.complete_time)==100?'success':'progress' }/>
            </AtCard>
        </View>
     
    }) 

    return (
      <View className='index'>
        <View>
              <View className='backplus'>
                <Image src='https://cdn-xyx.raink.com.cn/elsfkxxk/201901051546668599.png'   style='height: 57px;width: 145px;margin: 5px  0 0 25px;'></Image>
                <AtButton size='small' circle={true} type='secondary' className='back' onClick={this.back.bind(this)}>返回</AtButton>
              </View>
         
        </View>

       <View className='tasktitle'>
           {/* <AtIcon value='add' className='titleelement' size='30' color='#888' onClick={this.showaddmodel.bind(this)}></AtIcon> */}
           <AtButton size={'small'} type={'primary'} className='addtask' onClick={this.showaddmodel.bind(this)}>添加任务</AtButton>
           <View className='titleelement'>
             <AtSwitch border={false}   onChange={this.changelockstate.bind(this)} customStyle='padding:0 0 0 0;' checked={this.state.locktaskstate} title='锁定' />
           </View>
        </View> 
          
          
        <View
          className='scrollview'
          style={'width:100%'}
        >
             {tasklist} 
        </View>
           
        
        {/* //展示信息 */}
        <AtModal isOpened={this.state.islogin} closeOnClickOverlay={false} >
          <AtModalHeader>
            提示
          </AtModalHeader>
          <AtModalContent>
            <View className='delmode'>
              <Text>您还没有登录,点击确定前往首页登录</Text>
            </View>
          </AtModalContent>
          <AtModalAction>
            {/* <Button onClick={this.closeshowModal.bind(this, 1, '点击了取消')}>
              取消
            </Button> */}
            <Button
              style='color:#6190E8'
              onClick={this.gotoindex.bind(this, 1, '点击了确定')}
            >
              确定
            </Button>
          </AtModalAction>
        </AtModal>

    

      

     <AtModal  isOpened={this.state.showaddmodel} closeOnClickOverlay={false} onClose={this.closeModal.bind(this, 1, 'Modal被关闭了')}>
        <AtModalHeader>添加任务</AtModalHeader>
        <AtModalContent>
      
            <View className='addmodel'>
            {/* 标题 */}
                <AtInput
                name='value1'
                title='标题'
                type='text'
                placeholder='任务标题'
                value={this.state.addtitle}
                onChange={this.titleChange.bind(this)}
                customStyle='border:1px solid  #d6e4ef;padding:15rpx 0;border-radius:8rpx;'
                 />
             {/* 内容 */}
            
            <View style='width:100%'>
            {this.state.showaddmodel &&
            <AtTextarea
              value={this.state.addcontext}
              onChange={this.contextChange.bind(this)}
              maxlength='400'
              placeholder='计划内容'
              className='addcontextarea'
              
              />
            }
              {/* <Textarea value={this.state.addcontext} style='background:#fff;width:100%;min-height:80px;padding:0 30rpx;' autoHeight/> */}
        </View>
           
             {/* 时间 */}
                  {/* <AtInput
                    name='value1'
                    title='时间(小时)'
                    type='number'
                    placeholder='所需时间'
                    value={this.state.addtime}
                    onChange={this.timeChange.bind(this)}
                    /> */}
                </View>

        </AtModalContent>
        <AtModalAction>
          <Button onClick={this.closeModal.bind(this, 1, '点击了取消')}>
            取消
          </Button>
          <Button
            style='color:#6190E8'
            onClick={this.addtask.bind(this, 1, '点击了确定')}
          >
            确定
          </Button>
        </AtModalAction>
        </AtModal>

        {/* 操作面板 */}

      <AtActionSheet isOpened={this.state.showSheetstate}  onClose={this.closesheet1.bind(this)} onCancel={this.closesheet.bind(this)} cancelText='取消' title='操作'>
          <AtActionSheetItem onClick={this.updatetime.bind(this)}>
            更新进度
          </AtActionSheetItem>
          {/* <AtActionSheetItem onClick={this.updatetask}>
            修改
          </AtActionSheetItem> */}
          <AtActionSheetItem  onClick={this.toincident.bind(this)}>
            任务详情
          </AtActionSheetItem> 
          <AtActionSheetItem onClick={this.deltask.bind(this)}>
            删除
          </AtActionSheetItem>
   
      </AtActionSheet>

      {/* 更新进度面板 */}
      <AtModal  isOpened={this.state.showupdatetime} onClose={this.closeUpdateTime.bind(this, 1, 'Modal被关闭了')}>
        <AtModalHeader>更新进度</AtModalHeader>
        <AtModalContent>
       
            {/* <View className='addmodel'> */}
                {/* <Text>计划用时：{this.state.currenttime.length_time}</Text> */}
                {/* <Text>已用时：{this.state.currenttime.complete_time}</Text> */}
                {/* <View style='width:100%'> */}
                {/* <AtProgress percent={parseInt(this.state.currenttime.complete_time)==0 ?0:((parseInt(this.state.currenttime.complete_time)/parseInt(this.state.currenttime.length_time)*100))} status='progress' /> */}
                {/* <AtSlider step={0.5} min={0} value={this.state.complete_time_temp} max={24} onChange={this.changeComplete_time}  activeColor='#4285F4' backgroundColor='#BDBDBD' blockColor='#4285F4' blockSize={15} showValue={true}></AtSlider> */}
                  {/* <AtProgress percent={parseInt(this.state.currenttime.complete_time)} status={parseInt(this.state.currenttime.complete_time)==100?'success':'progress'} /> */}
                  {/* <AtSlider step={5} min={parseInt(this.state.currenttime.complete_time)} value={this.state.complete_time_temp} max={parseInt(this.state.currenttime.complete_time)+5>=100?100:(parseInt(this.state.currenttime.complete_time)+5)} onChange={this.changeComplete_time}  activeColor='#4285F4' backgroundColor='#BDBDBD' blockColor='#4285F4' blockSize={15} showValue={true}></AtSlider> */}
                  {/* <AtSlider step={5} min={parseInt(this.state.currenttime.complete_time)} value={this.state.complete_time_temp} max={100} onChange={this.changeComplete_time}  activeColor='#4285F4' backgroundColor='#BDBDBD' blockColor='#4285F4' blockSize={15} showValue={true}></AtSlider> */}
                {/* </View> */}
                               
            {/* </View> */}
    
            <View className='rangeview'>
                    <Input
                    name='value1'
                    type='range'
                    value={this.state.complete_time}
                    onChange={this.changeComplete_time.bind(this)}
                    max={100}
                    min={this.state.complete_time_temp}
                    step={5}
                    id='range1'
                    className='weui-input'
                    >
                    </Input> 
                    <Text>{this.state.complete_time}</Text>
                </View>

        </AtModalContent>
        <AtModalAction>
          <Button onClick={this.closeUpdateTime.bind(this, 1, '点击了取消')}>
            取消
          </Button>
          <Button
            style='color:#6190E8' 
            onClick={this.UpdateTime.bind(this, 1, '点击了确定')}
          >
            确定
          </Button>
        </AtModalAction>
        </AtModal>


         {/* 删除面板 */}
      <AtModal  isOpened={this.state.showdelTask} onClose={this.closedeltask.bind(this, 1, 'Modal被关闭了')}>
        <AtModalHeader>删除任务</AtModalHeader>
        <AtModalContent>
       
            <View className='delmode'>
               <Text>确定删除{this.state.deltitle}?</Text>
            </View>

        </AtModalContent>
        <AtModalAction>
          <Button onClick={this.closedeltask.bind(this, 1, '点击了取消')}>
            取消
          </Button>
          <Button
            style='color:#6190E8'
            onClick={this.Deltask.bind(this, 1, '点击了确定')}
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

  gotoindex(){
    Taro.navigateTo({
      url:'/pages/index/index'
    })
  }

  changelockstate(){

    this.setState({
      locktaskstate:!this.state.locktaskstate
    })

    Taro.setStorageSync('locktaskstate',!this.state.locktaskstate)

}

  showaddmodel(){
    this.setState({
      showaddmodel:true
    })
  }

  closeModal(){
    this.setState({
      showaddmodel:false,
      addtitle:'',
      addcontext:'',
      addtime:''
    })
  }

  addtask(e){
      Taro.showLoading({
        title:'正在添加'
      })
      if(this.state.addtitle!=''&&this.state.addcontext!=''){
          Taro.request({
            url:url.locality_address+'/v1/work/addmain',
            data:{
              phone:Taro.getStorageSync('phone'),
              scene:'web',
              title:this.state.addtitle,
              content:this.state.addcontext,
              // length_time:this.state.addtime,
            },
            method:'POST',
            header:{  "Content-Type": "application/x-www-form-urlencoded"}
          }).then((res)=>{
            if(res.data.code==200){
                this.setState({
                  maintask:res.data.result
                })
            }else if(res.data.code==10007){
                Taro.showToast({
                  title:'当月只能添加五个任务',
                  icon:'none'
                })
            }
            this.closeModal()

            Taro.hideLoading()
          }).catch(()=>{
            Taro.showToast({
              title:'网络错误!',
              icon:'none'
            })
          })
      }else{
        Taro.showToast({
          title:'信息不能为空',
          icon:'none'
        })
      }
  }

  showSheet(e){
    console.log(2123123123123)
      if(!this.state.locktaskstate){
        console.log(e);
        this.setState({
          showSheetstate:true,
          cardid:e.currentTarget.id
        })
      }
    }

  closesheet(e){
    this.setState({
      showSheetstate:false,
      cardid:''
    })
  }

  closesheet1(e){
    this.setState({
      showSheetstate:false,
    })
  }


  titleChange(value){
    console.log(value)
    this.setState({
      addtitle:value
    })
  }
  
  contextChange(e){
    console.log(e.detail.value)
    this.setState({
      addcontext:e.nativeEvent.target.value
    })
  }

  timeChange(value){
    console.log(value)
    this.setState({
      addtime:value
    })
  }

  updatetime(e){
    let temp = {length_time:'',
                complete_time:''
                }
    let complete_time = ''
      for(let i = 0;i<this.state.maintask.length;i++){
        console.log(this.state.maintask[i]);
        console.log(this.state.maintask[i].id); 
          if(this.state.maintask[i].id == this.state.cardid){
              temp.length_time = this.state.maintask[i].length_time
              temp.complete_time = this.state.maintask[i].complete_time
              complete_time = this.state.maintask[i].complete_time
          }

      }


      this.setState({
        currenttime:temp,
        showupdatetime:true,
        showSheetstate:false,
        complete_time:complete_time
        complete_time_temp:complete_time
    })

  }

  changeComplete_time(e){
    console.log(e)

    this.setState({
      complete_time:e.detail.value
    })
   
  }

  closeUpdateTime(){
    this.setState({
      currenttime: {length_time:'',
      complete_time:''
      },
      showupdatetime:false,
      complete_time_temp:'',
      cardid:'',
      complete_time:''
  })
  }

  UpdateTime(){
    Taro.showLoading({
      title:'请稍候...'
    })
      Taro.request({
        url:url.locality_address+'/v1/work/updatetask',
        data:{
          phone:Taro.getStorageSync('phone'),
          scene:'web',
          taskid:this.state.cardid,
          complete_time:this.state.complete_time
        },
        method:'POST',
        header:{  "Content-Type": "application/x-www-form-urlencoded"}
      }).then((res)=>{
          if(res.data.code==200){
           

            this.setState({
              currenttime: {length_time:'',
              complete_time:''
              },
              showupdatetime:false,
              complete_time_temp:'',
              cardid:'',
              maintask:res.data.result,
              complete_time:''
              })
          }else{
            Taro.showToast({
              title:'错误!',
              icon:'none'
            })
          }
          Taro.hideLoading()
      }).catch((res)=>{
        Taro.hideLoading()
        Taro.showToast({
          title:'网络错误!',
          icon:'none'
        })
      })
  }




  updatetask(e){
    

  }





  deltask(e){

    for(let i = 0;i<this.state.maintask.length;i++){
      if(this.state.maintask[i].id==this.state.cardid){
          this.setState({
            deltitle:this.state.maintask[i].title
          })
      }
  }
       this.setState({
        showdelTask:true,
        showSheetstate:false,
    })
  }

  closedeltask(){
    this.setState({
      deltitle:'',
      showdelTask:false,
      cardid:''
  })
  }

  Deltask(){
    
    Taro.showLoading({
      title:'请稍候...'
    })
      Taro.request({
        url:url.locality_address+'/v1/work/deltask',
        data:{
          phone:Taro.getStorageSync('phone'),
          scene:'web',
          taskid:this.state.cardid,
        },
        method:'POST',
        header:{"Content-Type":"application/x-www-form-urlencoded"}
      }).then((res)=>{
          if(res.data.code==200){
            this.setState({
              showdelTask:false,
              cardid:'',
              deltitle:'',
              maintask:res.data.result
              })
          }else{
            Taro.showToast({
              title:'错误!',
              icon:'none' 
            })
          }
          Taro.hideLoading()
      }).catch((res)=>{
        Taro.hideLoading()
        Taro.showToast({
          title:'网络错误!',
          icon:'none'
        })
      })
  }


  toincident(){
      Taro.navigateTo({
        url:'/pages/incident/incident?taskid='+this.state.cardid
      })
  }

}

