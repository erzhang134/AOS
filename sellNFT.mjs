import { readFileSync, readdirSync } from "node:fs";
import { join } from "path";
import { message, createDataItemSigner } from "@permaweb/aoconnect";
import axios from 'axios';

// 定义私钥文件目录
const walletDir = "xxxxxxx";

// 读取目录中的所有私钥文件
const walletFiles = readdirSync(walletDir).filter(file => file.startsWith("AR_key-") && file.endsWith(".json"));

// 遍历每个私钥文件并执行操作
for (const file of walletFiles) {
  const walletPath = join(walletDir, file);
  const wallet = JSON.parse(readFileSync(walletPath, 'utf8'));

  // 提取文件名中的特定部分
  const fileIdentifier = file.match(/^AR_key-(.+)\.json$/)?.[1];
  console.log(`File identifier: ${fileIdentifier}`);

  // 发送 HTTP 请求
  try {
    const response = await axios.post('https://cu6464.ao-testnet.xyz/dry-run?process-id=SNy4m-DrqxWl01YqGM4sxI8qCni-58re8uuJLvZPypY', {
      Id: "1234",
      Target: "SNy4m-DrqxWl01YqGM4sxI8qCni-58re8uuJLvZPypY",
      Owner: "1234",
      Anchor: "0",
      Data: JSON.stringify({ Address: fileIdentifier }),
      Tags: [
        { name: "Action", value: "Get-Profiles-By-Delegate" },
        { name: "Data-Protocol", value: "ao" },
        { name: "Type", value: "Message" },
        { name: "Variant", value: "ao.TN.1" }
      ]
    }, {
      headers: {
        'accept': '*/*',
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 OPR/114.0.0.0'
      }
    });

    // 提取返回值中的 ProfileId
    const profileId = response.data.Messages[0].Data ? JSON.parse(response.data.Messages[0].Data)[0].ProfileId : null;
    console.log(`ProfileId for ${file}: ${profileId}`);

    // 发送消息
    const messageResponse = await message({
      process: profileId,
      signer: createDataItemSigner(wallet),
      tags: [
        { name: 'Action', value: 'Transfer' },
        { name: 'Recipient', value: 'U3TjJAZWJjlWBB4KAXSHKzuky81jtyh0zqH8rUL4Wd0' },
        { name: 'Target', value: 'xxxxxxxx' },
        { name: 'Quantity', value: '2' },
        { name: 'X-Quantity', value: '2' },
        { name: 'X-Swap-Token', value: 'xxxxxx' },
        { name: 'X-Price', value: ((Math.random() * (0.12 - 0.07) + 0.07).toFixed(2) * 1000000000000).toString() },
        { name: 'X-Order-Action', value: 'Create-Order' },
      ],
    });

    console.log(`Order created successfully for wallet ${file}:`, messageResponse);
    if (messageResponse['Transfer-Success']) {
      console.log(messageResponse['Transfer-Success'].message || 'Balance transferred!');
    }
    if (messageResponse['Action-Response']) {
      console.log(messageResponse['Action-Response'].message || 'Order created!');
    }
  } catch (error) {
    console.error(`Error processing wallet ${file}:`, error.message || error);
  }
}
