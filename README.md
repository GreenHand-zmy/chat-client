# chat-client

#### 项目介绍
这是一款聊天app的客户端部分,使用Hbuild + h5+打造的混合app,由于作者本人时间有限,某些app的功能暂未实现,欢迎大家提交pr。

#### 安装教程

1. 克隆本项目到本地
2. [下载Hbuild客户端](http://www.dcloud.io/)
3. 打开hubild,在工具栏找到文件 -> 打开目录 -> 选择项目路径 -> 右键工作空间的项目 ->转化为移动app

#### 配置说明
1. 运行app你需要先运行服务端项目 ->
2. 服务端搭建好之后,你需要修改 js/app.js文件配置
```
	serverUrl: "http://你的本地地址/或服务器地址:8080",
	imServerUrl: "ws://本地地址/或服务器地址/ws",
	imgserverUrl: "http://本地地址/或服务器地址/fdfs/",
```
3. 关于如何真机运行调试,请参考Hbuild的官网文档。
