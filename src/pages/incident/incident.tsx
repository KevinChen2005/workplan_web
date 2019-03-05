import Taro, { Component, Config } from '@tarojs/taro'
import { View,ScrollView,Button,Text,Image} from '@tarojs/components'
import {AtTimeline,AtDivider,AtButton,AtIcon,AtTag,AtModal, AtModalHeader, AtModalContent, AtModalAction,AtInput} from 'taro-ui'


import  './incident.scss'

import url from '../../utils/url'



  require('taro-ui/dist/h5/css/index.css')


export default class Incident extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '任务详情'
  }

  state={
          taskdetall:{
            task: {
              id: "",
              username: "",
              openid: "",
              title: "",
              content: "",
              date: "",
              length_time: "",
              complete_time: "",
              speed: "",
              state: "",
              create_time: ""
              },
              smalltask: [
              {
              title: "",
              content: [],
              icon:''
              }
              ]
          },
          taskid:'',
          showaddincidentmodel:false,
          addincidentvalue:[],
          addincidentvalueitem:'',
          systemheight:'',
          islogin:false

        }


  componentWillMount () {

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
    

    this.setState({
      taskid:this.$router.params.taskid
    })

      //载入主线任务
      Taro.request({
        url:url.locality_address+'/v1/work/get-smalltask',
        data:{
          phone:Taro.getStorageSync('phone'),
          scene:'web',
          taskid:this.$router.params.taskid
        }
      }).then((res)=>{
          if(res.data.code==200){
              this.setState({
                taskdetall:res.data.result
              })
           
          }else{
            Taro.showToast({
              title:'参数错误!',
              icon:'none'
            })
          }
      }).catch((e)=>{
        Taro.showToast({
          title:'网络错误!',
          icon:'none'
        })
      })
  
      this.setState({
        locktaskstate:Taro.getStorageSync('locktaskstate')
        }
      )
      

  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  componentDidShow () {
 
}

  componentDidHide () { }

  render () {
    let incidenttap = this.state.addincidentvalue.map((item)=>{
      return  <AtTag size='normal' className='includetap' type='primary'  >{item}</AtTag>
    })
    
    return(
    <View className='index'>
         <View>
              <View className='backplus'>
                <Image src='https://cdn-xyx.raink.com.cn/elsfkxxk/201901051546668599.png'   style='height: 57px;width: 145px;margin: 5px  0 0 25px;'></Image>
                <AtButton size='small' circle={true} type='secondary' className='back' onClick={this.back.bind(this)}>返回</AtButton>
              </View>
        </View>

        <View className='at-article'>
          <View className='at-article__h1'>
            {this.state.taskdetall.task.title}
          </View>
          <View className='at-article__info'>
          {this.state.taskdetall.task.create_time}创建
          </View>
          <View className='at-article__content'>
            <View className='at-article__section'>
              <View className='at-article__p'>
                <View
                  className='scrollview'
                  // style='height: 100px;'
                  >
                      <View className=''> 
                        {this.state.taskdetall.task.content}
                      </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <AtDivider content='事件' fontColor='#2d8cf0' lineColor='#2d8cf0' />
        <View
          className='scrollview'
          >
           <View className='timeline'> 
              <AtTimeline 
                pending 
                items={this.state.taskdetall.smalltask}
              >
               </AtTimeline>
          </View>
        </View>

        <View className='addbutton' onClick={this.addincident.bind(this)}>
          {/* <AtButton type='secondary' circle={true} onClick={this.addincident} size='small'>
            <View className='delmode'>
              <AtIcon value='add'  size='20' color='rgb(93,137,228)'></AtIcon>
            </View>
          </AtButton> */}
          <AtTag size='normal' type='primary' active={true} >
             <AtIcon value='add'  size='20' color='rgb(255,255,255)'></AtIcon>
          </AtTag>
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


            
         {/* 添加事件 */}
        <AtModal isOpened={this.state.showaddincidentmodel} closeOnClickOverlay={false} onClose={this.closeModal.bind(this, 1, 'Modal被关闭了')}>
          <AtModalHeader>添加事件</AtModalHeader>
          <AtModalContent>


            <View className='addincident'>
              {/* 标签栏 */}
              <View className='inputincidenttap'>
                {incidenttap}
              </View>
              <AtDivider className='dividerheight'  fontColor='#2d8cf0' lineColor='#2d8cf0' />
              {/* 输入框 */}
              <View className='inputincident'>
               <AtInput
                  name='value1'
                  type='text'
                  placeholder='事件'
                  value={this.state.addincidentvalueitem}
                  onChange={this.handleChange.bind(this)}
                  customStyle='border:1px solid  #d6e4ef;padding:15rpx 0;border-radius:8rpx;'
                  maxLength={10}
                />
                    <AtTag size='small' type='primary' onClick={this.addtag.bind(this)} active={true} >
                      <AtIcon value='add'  size='10' color='rgb(255,255,255)'></AtIcon>
                    </AtTag>
              </View>
            </View>
          

          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.closeModal.bind(this, 1, '点击了取消')}>
              取消
            </Button>
            <Button
              style='color:#6190E8'
              onClick={this.AddIncident.bind(this, 1, '点击了确定')}
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

  addincident(e){

    this.setState({
      showaddincidentmodel:true
    })

  }

  closeModal(){
    
    this.setState({
      showaddincidentmodel:false,
      addincidentvalue:[],
      addincidentvalueitem:''
    })
  }

  handleChange(value){
    this.setState({
      addincidentvalueitem:value
    })
  }

  addtag(e){
    if(this.state.addincidentvalueitem!=''){
      let array_temp = this.state.addincidentvalue
      array_temp.push(this.state.addincidentvalueitem)
      this.setState({
        addincidentvalue:array_temp,
        addincidentvalueitem:''
      })
    }else{
      Taro.showToast({
        title:'事件不能为空',
        icon:'none'
      })
    }
  }

  AddIncident(e){

    if(this.state.addincidentvalue.length==0){
        Taro.showToast({
          title:"不能添加空事件",
          icon:'none'
        })
        return
    }

    let value = ''
    
    Taro.showLoading({
      title:'请稍候...'
    })
    for(let i = 0;i<this.state.addincidentvalue.length;i++){
        if(i<this.state.addincidentvalue.length-1){
          value+=(this.state.addincidentvalue[i]+'@@')
        }else{
          value+=this.state.addincidentvalue[i]
        }
    }


    Taro.request({
      url:url.locality_address+'/v1/work/smalltask',
      method:'POST',
      header:{  "Content-Type": "application/x-www-form-urlencoded"},
      data:{
        phone:Taro.getStorageSync('phone'),
        scene:'web',
        taskid:this.state.taskid,
        content:value
      }
    }).then((res)=>{

      if(res.data.code==200){
          this.setState({
            taskdetall:res.data.result
          })
          this.setState({
            showaddincidentmodel:false,
            addincidentvalue:[],
            addincidentvalueitem:''
          })
      }else{
        Taro.showToast({
          title:'网络出错',
          icon:'none'
        })
      }
      Taro.hideLoading()
  
    }).catch((res)=>{
      Taro.hideLoading()
      this.setState({
        showaddincidentmodel:false,
        addincidentvalue:[],
        addincidentvalueitem:''
      })
      Taro.showToast({
        title:'网络出错',
        icon:'none'
      })
    })

  
  }

}

