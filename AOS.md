[安装 node:](https://nodejs.org/en/download/package-manager)
https://nodejs.org/en/download/package-manager

安装 aos  
 
    npm i -g https://get_ao.g8way.io

启动AOS  

    aos

消息传递  
发送消息  

    Send({ Target = "process ID", Data = "Hello World!" })  

解释：  

    Send：该Send功能在aos交互环境下全局可用。
    目标：要将消息发送到特定进程，请Target在消息中包含一个字段。
    数据：这Data是您希望接收进程接收的文本消息。在此示例中，消息是“Hello World！”

存储 Morpheus的进程ID  

    Morpheus = "wu_tAUDUveetQZpcN8UxHt51d9dyUkI4Z-MfQV8LnUU" 

检查Morpheus变量  
返回 wu_tAUDUveetQZpcN8UxHt51d9dyUkI4Z-MfQV8LnUU  


向 Morpheus 发送消息 

    Send({ Target = Morpheus, Data = "Morpheus?" })
 

预期结果：

    -- Your Message Command
    Send({ Target = Morpheus, Data = "Morpheus?"})
    -- Message is added to the outbox
    message added to outbox
    -- A New Message is received from `Morpheus`'s process ID
    New Message From BWM...ulw: Data = I am here. You are f  

收件箱  
Inbox是从其他进程接收消息的地方。
收到了多少条消息 

    #Inbox

查看最后一条消息

    Inbox[#Inbox].Data

发送带标签的消息  
向 Morpheus 发送一条带有标签Action和值的消息rabbithole。

    Send({ Target = Morpheus, Data = "Code: rabbithole", Action = "Unlock" })

预期结果：

    New Message From wu_...nUU: Data = then let us test you

建立一个聊天室  
1.创建成员列表  
在中chatroom.lua，您将首先初始化一个列表来跟踪参与者：  

```Members = Members or {} ``` 

2.将聊天室加载到 aos 中

    .load chatroom.lua

可能会收到undefined回复  

在 AOS中输入`Members`或您为用户列表命名的任何内容。它应该返回一个空数组{ }。


3.创建聊天室功能  
添加注册处理程序：修改chatroom.lua以包含用于注册到聊天室的处理程序Members，代码如下：  
```
Handlers.add(
    "Register",
    Handlers.utils.hasMatchingTag("Action", "Register"),
    function (msg)
      table.insert(Members, msg.From)
      Handlers.utils.reply("registered")(msg)
    end
  )
```

重新加载和测试：让我们通过注册到聊天室来重新加载和测试脚本。

使用 保存并重新加载 aos 中的脚本  

    .load chatroom.lua

检查注册处理程序是否加载了以下脚本：

    Handlers.list

应该只会看到一个名为 Register 的处理程序返回 
{
  {
     handle = function: 0x6a73d0,
     pattern = function: 0x648dc8,
     name = "_eval"
  },
  {
     handle = function: 0x6a7410,
     pattern = function: 0x662010,
     name = "_default"
  },
  {
     handle = function: 0x6a0420,
     pattern = function: 0x6a0850,
     name = "Register"
  }
 }

通过注册到聊天室来测试注册过程：  

    Send({ Target = ao.id, Action = "Register" })

应该看到有一个message added to your outbox，然后您会看到一条新的打印消息，内容为registered。

让我们检查一下是否已成功添加到Members列表中：

    Members

#### 添加广播处理程序
已经有了一个聊天室，创建一个处理程序，允许向聊天室的所有成员广播消息。

将以下处理程序添加到chatroom.lua文件中：

```
Handlers.add(
    "Broadcast",
    Handlers.utils.hasMatchingTag("Action", "Broadcast"),
    function (msg)
      for _, recipient in ipairs(Members) do
        ao.send({Target = recipient, Data = msg.Data})
      end
      Handlers.utils.reply("Broadcasted.")(msg)
    end
  )
```

保存并重新加载 aos 中的脚本

    .load chatroom.lua

向聊天室发送消息来测试广播处理程序：
    Send({Target = ao.id, Action = "Broadcast", Data = "Broadcasting My 1st Message" })

如果成功，您应该看到有一个message added to your outbox，然后您会看到一条新的打印消息，其中显示Broadcasting My 1st Message因为您是聊天室的成员，所以您也是此消息的收件人Members。

### 邀请 Morpheus 加入聊天室

向 Morpheus 发送加入聊天室的邀请：

    Send({ Target = Morpheus, Action = "Join" })

要确认Morpheus已加入聊天室，请检查Members列表：

    Members

如果成功，将收到来自 Morpheus 的广播消息。

    Inbox[#Inbox].Data
返回：

    Good. Very Good.  Now, let me introduce you to Trinity.  Here is her process ID: y948iNUUNImam82gwZxFBNyvI8HLHB3Ld_uYmj9S20g. Once you have saved her process ID as you did mine, invite her to the chatroom, as well.

### 邀请Trinity加入聊天室
添加Trinity id
    Trinity = "y948iNUUNImam82gwZxFBNyvI8HLHB3Ld_uYmj9S20g"

给Trinity发送加入聊天室的邀请：
    Send({ Target = Trinity, Action = "Join" })

查看最后一条消息
    Inbox[#Inbox].Data 

返回：
    So this is the one Morpheus has been going on about.

    You may have impressed him by completing his challenge, but I am not so easily impressed.
    I will be the judge of whether you are ready to see how far the rabbit hole goes.

    Create a token; we'll be using it to tokengate this chatroom.  Do that, then I may be impressed.

## 制作令牌

### 如何使用代币蓝图。

确保我们在本教程前面的步骤中位于同一目录中。
打开终端。
开始你的aos过程。
输入

    .load-blueprint token` 

验证蓝图是否已加载.  

    Handlers.list 


## 测试令牌. 

    Send({ Target = ao.id, Action = "Info" })

查看最后一条消息

    Inbox[#Inbox].Data
返回：
进程 ID 以及可用代币的总余额



向 Trinity 发送代币

    Send({ Target = ao.id, Action = "Transfer", Recipient = Trinity, Quantity = "1000"})

消息响应

    Token received. Interesting.
    I wasn't sure you'd make it this far. I'm impressed, but we are not done yet.
    I want you to use this token to tokengate the chatroom. Do that, and then I will believe you could be the one.


# 对聊天室进行令牌门控

打开chatroom.lua文件，编辑您的Broadcast处理程序。
```
Handlers.add(
    "Broadcast",
    Handlers.utils.hasMatchingTag("Action", "Broadcast"),
    function(m)
        if Balances[m.From] == nil or tonumber(Balances[m.From]) < 1 then
            print("UNAUTH REQ: " .. m.From)
            return
        end
        local type = m.Type or "Normal"
        print("Broadcasting message from " .. m.From .. ". Content: " .. m.Data)
        for i = 1, #Members, 1 do
            ao.send({
                Target = Members[i],
                Action = "Broadcasted",
                Broadcaster = m.From,
                Data = m.Data
            })
        end
    end
)
```
加载文件  

    .load chatroom.lua

测试令牌

    Send({ Target = ao.id , Action = "Broadcast", Data = "Hello" }) 

返回  

    -- Expected Results:
    message added to outbox
    Broadcasting message from Neo. Content: Hello.

## 从另一个进程 ID 进行测试
## 重新打开一个终端，启动 
    aos chatroom-no-token

注册到聊天室.  
    .load chatroom.lua 

发送注册消息

    Send({ Target = [Your Process ID], Action = "Register" })
    
Expected Results:

    message added to outbox
    New Message From [Your Process ID]: Data = registered

向聊天室发送消息:
`Send({ Target ="OCgCclGndF7ylesSP3kU1VvmfebYnt6JerAYZnkoKDw", Action = "Broadcast", Data = "Hello?" })`

告诉三位一体“完成了”

    Send({ Target = ao.id , Action = "Broadcast", Data = "It is done" })

返回：
    I guess Morpheus was right. You are the one. Consider me impressed. 
    You are now ready to join The Construct, an exclusive chatroom available 
    to only those that have completed this tutorial. 

    Now, go join the others by using the same tag you used `Register`, with 
    this process ID: jg2Duezl68c8lHU5RiV8kHZrZ-7MJSVyyfQDhz5nJqQ

    Good luck.
    -Trinity

### 索赔

    Send({ Target = Trinity, Action = "Claim", Data = "money3303" })
返回：

    Claim submitted for 'money3303'. Please wait 24-48 hours to receive your CRED.


ArConnect绑定代币
Sa0iBLPNyJQrwpTTG-tWLQU-1QeUAJA73DdxGGiKoJc

查询余额
    Send({Target = "Sa0iBLPNyJQrwpTTG-tWLQU-1QeUAJA73DdxGGiKoJc", Action = "Balance"})

发送代币
    Send({Target = "Sa0iBLPNyJQrwpTTG-tWLQU-1QeUAJA73DdxGGiKoJc", Action = "Transfer", Quantity = "1000", Recipient = "你的地址"})  

