const store=new Vuex.Store({state:{configSaveCallbacks:[],currentIndex:0,currentTitle:"配置管理",titleMap:{}},getters:{getSaveCallbacks:t=>t.configSaveCallbacks,getTitle:t=>t.currentTitle,getTitleByPath:t=>e=>t.titleMap[e]},mutations:{setIndex:(t,e)=>{t.index=e},setTitle:(t,e)=>{console.log("设置标题：",e),t.currentTitle=e},setTitleWithPath:(t,e)=>{console.log("设置标题：",e.title),t.currentTitle=e.title,t.titleMap[e.path]=e.title}}});