<template>
	
	<view class="fuiNavBar">
		<fui-nav-bar  custom background>
			<view class="fui-search__box ">
				<fui-tabs class="tabs_class" direction='column' color='#ACB0D0' :isSlider='false'
					selectedColor='#17135F' :tabs="tabbarData" scale='1.5' @change="changeHomePage" :center="false"
					:short="true" :scroll='false' itemPadding="25" :current="pageindex" size='28' fontWeight='900'
					background></fui-tabs>
			</view>
		</fui-nav-bar>

	</view>

	<view v-show="pageindex==0">
		
		<fui-background-image
			:src="backGroundImage">
		</fui-background-image>
		<AppSwiper />

		<up-gap height="10"></up-gap>
		<!--  搜索-->
		<!-- <Search /> -->
		<!-- // 下面链接改成你的背景图片，求求大家用自己的，作者oss按量付费，开源不易！
		
		// 背景图片和用到的素材我都给大家放在/src/static里了 -->
		<image @click="img2pay" style="width: 320rpx; height: 106rpx; background-color: transparent; display:inline-block; box-sizing:border-box; position:relative; left:40rpx;"
			mode="scaleToFill" src="https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/画板 2 (1).png"></image>
			<image @click="handleGotoHistory" style="width: 320rpx; height: 106rpx; background-color: transparent; display:inline-block; box-sizing:border-box; position:relative; left:70rpx;"
				mode="scaleToFill" src="https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/画板 3.png"></image>
	
		<up-gap height="10"></up-gap>
		<AppTags />

		<AppWaterFall />

	</view>
	<view v-show="pageindex==1">
		<fui-background-image
			:src="backGroundImage">
		</fui-background-image>



		<BaseLayout>
			<view>
				<up-status-bar />
			
				<template v-for="graphicData in graphicDatas">
				
					<view>
						<MyGraphicCard :avatar="graphicData.avatar" :title="graphicData.title"
							:username="graphicData.username" :description="graphicData.description"
							:tags="graphicData.tags" :content="graphicData.content" :images="graphicData.images"
							:view-count="graphicData.viewCount" :comment-count="graphicData.commentCount"
							:like-count="graphicData.likeCount" :view-user-avatars="graphicData.viewUserAvatars">
						</MyGraphicCard>
					</view>
				</template>
			</view>



		</BaseLayout>
		<view style="height: 200rpx;"> <fui-footer text="Copyright © 2021 Fuzi-AI"></fui-footer></view>


	</view>
	<view v-show="pageindex==2">
		<fui-background-image
			:src="backGroundImage">
		</fui-background-image><template>
			<BaseLayout>
				<view style="margin-top: -20%;">
					<!-- <MyNavbar /> -->
					<up-status-bar />
					<view class="u-flex u-row-right" style="width: 100%;">
						<view class="camera u-flex u-row-center">
						</view>
					</view>
					<view class=" trans_back u-flex u-flex-y-center u-flex-around user-box u-p-l-30 u-p-r-20 u-p-b-30"
						@click="handleLogin">
						<view class="u-m-r-10">
							<up-avatar :src="user.avatar_url" size="80">
							</up-avatar>
							<view v-if="!isLogin" class="tn-text-center tn-text-sm tn-gray-dark_text"
								style="position: relative;bottom: 0;">点击登录</view>
						</view>
						<view class="u-flex-1">
							<view v-if="isLogin" class="u-font-18 u-p-b-10 tn-text">昵称：{{ user.nickname }}</view>
							<view v-else class="u-font-18 u-p-b-10 tn-gray-dark_text">未登录</view>
							<!--        会员信息-->
							<view>
								<UserMemberInfo></UserMemberInfo>
							</view>
							<!--        完善用户信息-->
							<view v-if="isLogin" class="tn-text-xs tn-gray-dark_text">余额：{{user.balance}}</view>
							<GetUserInfoPopup />

						</view>
						<view class="u-m-l-10 u-p-10" @click='toEmpty'>
							<up-icon name="scan" color="#969799" size="28"></up-icon>
						</view>
						<view class="u-m-l-10 u-p-10" @click='toEmpty'>
							<up-icon name="arrow-right" color="#969799" size="28"></up-icon>
						</view>
					</view>

					<view class="u-m-t-20">
						<up-cell-group class="trans_back" >
							<up-cell icon="rmb-circle" title="算力充值" @click="showPay=true" :border='false'> </up-cell>
						</up-cell-group>
					</view>

					<view class="u-m-t-20">
						<up-cell-group class="trans_back">
							<!--        <up-cell icon="star" title="收藏(暂未开放)"></up-cell>-->
							<up-cell :border='false' icon="photo" title="绘图历史" @click="handleGotoHistory"></up-cell>
							<up-cell :border='false' icon="setting" title="退出登录" @click="handleLoginOut">
								<template #icon>
									<tn-icon name="logout" />
								</template>
							</up-cell>
							<button style="background-color: transparent; margin: 0; padding: 0; text-align: left;" open-type="contact">
								<up-cell icon="chat-fill"   title="微信客服"></up-cell>
							</button>
							<!--        <up-cell icon="coupon" title="卡券(暂未开放)"></up-cell>-->
							<!--        <up-cell icon="heart" title="关注(暂未开放)"></up-cell>-->
						</up-cell-group>
					</view>

					
				</view>
			</BaseLayout>
		</template>
	</view>
	
</template>

<script setup lang="ts">
	import MyNavbar from "@/components/common/MyNavbar.vue";
	import BaseLayout from "@/layouts/BaseLayout.vue";
	import GetUserInfoPopup from "@/components/GetUserInfoPopup.vue";
	import {
		creatOrder,
		getLoginInfo,
		getOrderInfoById,
		getPrePay,
		getProductList,
		isLogin,
		loginByUsername,
		loginByWechatCode,
		loginOut,
		refreshUserInfo,
		saveLoginInfo
	} from "@/composables/useCommon.ts";
	import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
	import { onLoad ,onReady } from "@dcloudio/uni-app";
	import useWorkFlow from "@/composables/useWorkFlow.ts";	
	import UserMemberInfo from "@/components/home/UserMemberInfo.vue";
	import { ref, onMounted, onUnmounted, computed } from 'vue'	
	import TnWaterFall from '@tuniao/tnui-vue3-uniapp/components/water-fall/src/water-fall.vue'
	import { request } from "@/utils/request.ts";
	import type { IDrawHistoryItem } from "@/types";
	import TnGraphicCard from 'tnuiv3p-tn-graphic-card/index.vue'
	import MyGraphicCard from "@/components/custom/MyGraphicCard/MyGraphicCard.vue";
	import { formatDateTime } from "@/utils/common.ts";	
	import AppSwiper from "@/components/home/AppSwiper.vue";
	import Search from "@/components/home/Search.vue";
	import AppTags from "@/components/home/AppTags.vue";
	import AppWaterFall from "@/components/home/AppWaterFall.vue";
	import Home from "@/pages/home/home.vue";
	import Creative from "@/pages/creative/creative.vue";
	import TaskExcuting from "@/components/common/TaskExcuting.vue";
	import BottomNavigation from "@/components/BottomNavigation.vue";	
	import History from "@/pages/history/history.vue";
	import { storeToRefs } from "pinia";
	import { useAppStore } from "@/stores/appStore.ts";
	import { EventType } from "@/types/event.types.ts";
	import { on } from "@/utils/emitter.ts";
	import PaymentPopup from "@/components/home/PaymentPopup.vue";
	import fuiBackgroundImage from "@/components/firstui/fui-background-image/fui-background-image.vue";
	
	function img2pay(){
		pageindex.value=2
		showPay.value=true
	}
	
	const fuiNavBar_class = ref('fuiNavBar')
	
	function changeStyle(e){
		console.log("changeStyle-----------------",e)
		if (e.isFixed == false){
			fuiNavBar_class.value = "fuiNavBar"
		}
		else{
			fuiNavBar_class.value = "fuiNavBar_isTrue"
		}
		
	}
	// ------------------------------------------------------
	const { tabbarIndex } = storeToRefs(useAppStore())
	const pageindex = ref(0)
	const changeHomePage = (index : number) => {
		pageindex.value = index.index;
		console.log('index', pageindex.value);


	};
	
	const name_value = ref('我的')
	function  wode_loging (){
		if(!isLogin.value){
			name_value.value = '登录'
		}
		else{
			name_value.value = '我的'
			
		}
	}
	const tabbarData = [
		{
			name: '首页',			
			to: '/pages/index/index',
			onClick: tabbarIndex
		},
		{
			name: '创意',			
			to: '/pages/creative/creative',
			onClick: tabbarIndex
		},
		{
			name: name_value,
			onClick: tabbarIndex,
		}
	]
// 下面链接改成你的背景图片，求求大家用自己的，作者oss按量付费，开源不易！

// 背景图片和用到的素材我都给大家放在/src/static里了
// 下面链接改成你的背景图片，求求大家用自己的，作者oss按量付费，开源不易！
// 下面链接改成你的背景图片，求求大家用自己的，作者oss按量付费，开源不易！
// 下面链接改成你的背景图片，求求大家用自己的，作者oss按量付费，开源不易！
// 下面链接改成你的背景图片，求求大家用自己的，作者oss按量付费，开源不易！
	const backGroundImage = 'https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/aidraw/image/temps/67873d6c232a3c5d52240dd6/Home2.jpg'
	
	onMounted(() => {
		getTestImageData()
	})

	onUnmounted(() => {
		//   销毁当前组件
		imageData.value = []
	})
	const getTestImageData = async () => {
		imageData.value = await request<IDrawHistoryItem[]>('draw/history/findMany', {
			method: 'POST',
			data: {
				history: {
					is_deleted: false,
					is_public: true,
				}
			}
		})
	}
	const imageData = ref<IDrawHistoryItem[]>([])
	/**图文卡片展示的数据 */
	const graphicDatas = computed(() => {
		return imageData.value.map(item => {
			return {
				id: item._id,
				avatar: item.user_id?.avatar_url || '',
				username: item.user_id?.nickname || item.user_id?.username,
				title: item.options?.workflow_title,
				description: formatDateTime(new Date(item.created_at)),
				tags: item.tags,
				content: item.params?.positive?.slice(0, 120) + "...",
				images: (() => {
					// 生成参数
					const inputImages = []
					for (const key in item.params) {
						if (key.startsWith('image_path_') && item.params[key]) {
							inputImages.push(item.params[key])
						}
					}
					if (!item.output) {
						return inputImages
					}
					return [...inputImages, ...item.output]
				})(),
				commentCount: item.comment?.length
			}
		})
	})


	// ---------------------------------------------------------
	


	// -------------------------------------------------------

	function toEmpty() {
		uni.navigateTo({
			url: '/pages/Empty/Empty'
		})
	}
	const { user } = storeToRefs(useAppStore())
	const show = ref(true)
	const pic = ref('')
	function handleGotoHistory() {
		uni.navigateTo({
			url: '/pages/history/history_fui/history_fui'
		})
	}
	const handleLogin = async () => {
		if (isLogin.value) {
			return
		}
		uni.showLoading({
			title: '正在登录...',
			mask: true
		})
		//获取平台信息
		const { uniPlatform } = uni.getSystemInfoSync()

		if (uniPlatform !== 'web') {
			// 非开发者工具环境，执行登录操作
			handleLoginByWechat()
		} else {
			console.log('dev')
			// 开发者工具环境，模拟登录 todo

			const user = await loginByUsername({
				username: 'test456',
				password: '123456'
			})
			saveLoginInfo(user)
			uni.hideLoading()
		}
		name_value.value = '我的'
		
	}
	/** 通过微信登录 */
	const handleLoginByWechat = () => {
		uni.login({
			success: async function ({ code }) {
				const result = await loginByWechatCode(code)
				saveLoginInfo(result)
				uni.hideLoading()
			},
			fail: function (err) {
				uni.showToast({
					title: '登录错误',
					icon: 'none'
				})
			}
		})
	}
	const { socketInit } = useWorkFlow()
	onReady(() => {
		socketInit()
		on(EventType.PAY_SUCCESS, ({ order_id }) => handlePayMessage(order_id))
		wode_loging()
	})
	const handlePayMessage = async (order_id : string) => {
		// 监听到支付成功事件
		console.log('收到支付成功消息', order_id)
		//查询订单支付状态进行复核
		const order = await getOrderInfoById(order_id)
		if (order[0] && order[0].order_status === 1) {
			uni.showToast({
				title: '支付成功',
				icon: 'none'
			})
			refreshUserInfo()
		}
	}
	const handleLoginOut = () => {
		uni.showLoading({
			title: '正在退出登录...',
			mask: true
		})
		loginOut()

		uni.hideLoading()
		uni.showToast({
			title: '退出成功',
			icon: 'none'
		})
		name_value.value = '登录'
	}


	/** 支付 **/

	const { showPay } = storeToRefs(useAppStore())
</script>
<style scoped lang="scss">
	.image-data {
		width: calc(100% - 20rpx);
		margin: 10rpx;

		.image {
			width: 100%;
			height: auto;
		}
	}

	// ---------------------------------
	page {
		background-color: #ededed;
	}

	.camera {
		width: 54px;
		height: 44px;

		&:active {
			background-color: #ededed;
		}
	}

	.user-box {
		background-color: #fff;
	}

	.u-cell-group {
		background-color: #fff;
	}

	.fui-search__box {

		background: transparent;
		width: 450rpx;
		height: 48px;
		margin-left: -0%;
		margin-top: -5%;
		box-sizing: border-box;

		border-radius: 0px;
		display: flex;
		align-items: center;
		justify-content: left;

	}
	.fuiNavBar_isTrue{
		width: 100%;
			padding: 24rpx;
			box-sizing: border-box;
			display: flex;
		
			background: #F8F8F8;
			color: #465CFF;
			font-weight: bold;
		
	}
	.fuiNavBar {
	
			
			
		// text-align: center;
		margin-top: 10%;
		margin-bottom: 10%;
	}

	.trans_back {
		background-color: transparent;
		border: transparent;

	}

	.tabs_class {
		width:537rpx;
		display:flex;
		display:border-box;
	}
</style>