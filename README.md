#### 数字识别画板
> 运行时需要远程加载model.json和model.bin

- tensorflowjs集成在`assets/scripts/plugin/tensorflow`文件夹下
- 环境配置
    - brew :
        - /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    - yarn :
        - brew install yarn
    - 模型导出 :
        - cd ./TF_Model_Export
        - yarn
        - yarn watch
        - 执行训练,训练完成后提示下载模型
    - webserver :
        - cd ./WebServer
        - npm install http-server -g 
        - npm i http-server
        - http-server
    - python (可选) :
        - pip3 install tensorflow
        - pip3 install keras
        - pip3 install matplotlib
        - pip3 install Pillow
        - ~~pip3 install tensorflowjs~~

- 预览
    Chrome跨域: 
    ```
    open -a /Applications/Google\ Chrome.app --args --disable-web-security --user-data-dir
    ```
    使用cocos creator打开DrawingBoard,预览即可