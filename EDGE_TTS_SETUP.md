# Edge TTS 服务部署指南

本文档介绍如何为 Earthworm 项目部署 Edge TTS 服务。

## 方案一：使用 Node.js + edge-tts 库

### 1. 创建服务器项目

```bash
mkdir edge-tts-server
cd edge-tts-server
npm init -y
npm install express cors edge-tts
```

### 2. 创建服务器文件 (server.js)

```javascript
const express = require("express");
const cors = require("cors");
const { EdgeTTS } = require("edge-tts");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post("/synthesize", async (req, res) => {
  try {
    const { text, voice } = req.body;

    if (!text || !voice) {
      return res.status(400).json({ error: "Text and voice are required" });
    }

    const tts = new EdgeTTS();
    const audioBuffer = await tts.synthesize(text, voice);

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.length,
    });

    res.send(audioBuffer);
  } catch (error) {
    console.error("TTS synthesis error:", error);
    res.status(500).json({ error: "TTS synthesis failed" });
  }
});

app.get("/voices", async (req, res) => {
  try {
    const tts = new EdgeTTS();
    const voices = await tts.getVoices();
    res.json(voices);
  } catch (error) {
    console.error("Get voices error:", error);
    res.status(500).json({ error: "Failed to get voices" });
  }
});

app.listen(port, () => {
  console.log(`Edge TTS server running at http://localhost:${port}`);
});
```

### 3. 启动服务器

```bash
node server.js
```

## 方案二：使用 Python + edge-tts

### 1. 安装依赖

```bash
pip install edge-tts flask flask-cors
```

### 2. 创建 Python 服务器 (app.py)

```python
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import edge_tts
import asyncio
import io
import tempfile
import os

app = Flask(__name__)
CORS(app)

@app.route('/synthesize', methods=['POST'])
def synthesize():
    try:
        data = request.get_json()
        text = data.get('text')
        voice = data.get('voice')

        if not text or not voice:
            return jsonify({'error': 'Text and voice are required'}), 400

        # 创建临时文件
        with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as tmp_file:
            tmp_path = tmp_file.name

        # 异步合成语音
        async def run_tts():
            tts = edge_tts.Communicate(text, voice)
            await tts.save(tmp_path)

        asyncio.run(run_tts())

        # 返回音频文件
        return send_file(tmp_path, mimetype='audio/mpeg', as_attachment=False)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        # 清理临时文件
        if 'tmp_path' in locals() and os.path.exists(tmp_path):
            os.unlink(tmp_path)

@app.route('/voices', methods=['GET'])
def get_voices():
    try:
        async def get_voices_list():
            voices = await edge_tts.list_voices()
            return voices

        voices = asyncio.run(get_voices_list())
        return jsonify(voices)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, debug=True)
```

### 3. 启动服务器

```bash
python app.py
```

## 方案三：使用 Docker 部署

### 1. 创建 Dockerfile

```dockerfile
FROM python:3.9-slim

WORKDIR /app

RUN pip install edge-tts flask flask-cors

COPY app.py .

EXPOSE 3001

CMD ["python", "app.py"]
```

### 2. 构建和运行

```bash
docker build -t edge-tts-server .
docker run -p 3001:3001 edge-tts-server
```

## 配置 Earthworm

### 1. 更新服务端点

在 `services/edgeTTS.ts` 中，更新 API 端点：

```typescript
private async callEdgeTTSAPI(ssml: string, voice: string): Promise<Response> {
  const localUrl = 'http://localhost:3001/synthesize';
  return fetch(localUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: ssml,
      voice: voice
    })
  });
}
```

### 2. 环境配置

创建 `.env` 文件：

```env
EDGE_TTS_API_URL=http://localhost:3001
```

## 生产环境部署

### 使用 Nginx 反向代理

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api/tts/ {
        proxy_pass http://localhost:3001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 使用 PM2 管理进程

```bash
npm install -g pm2
pm2 start server.js --name edge-tts-server
pm2 startup
pm2 save
```

## 故障排除

### 常见问题

1. **CORS 错误**: 确保服务器端启用了 CORS
2. **语音文件损坏**: 检查网络连接和临时文件权限
3. **服务无响应**: 检查端口是否被占用

### 调试建议

1. 启用详细日志输出
2. 使用浏览器开发者工具检查网络请求
3. 测试不同的语音和文本组合

## 许可证

请确保遵守 Microsoft Edge TTS 的使用条款和条件。
