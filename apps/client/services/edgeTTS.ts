/**
 * Edge-TTS服务
 * 提供与Microsoft Edge Text-to-Speech服务的接口
 */

export interface EdgeTTSConfig {
  voice: string;
  rate: string; // 例如: "+0%", "-10%", "+20%"
  pitch: string; // 例如: "+0Hz", "-50Hz", "+100Hz"
}

export class EdgeTTSService {
  private static instance: EdgeTTSService;

  public static getInstance(): EdgeTTSService {
    if (!EdgeTTSService.instance) {
      EdgeTTSService.instance = new EdgeTTSService();
    }
    return EdgeTTSService.instance;
  }

  /**
   * 将速度数值转换为Edge TTS的rate格式
   */
  private speedToRate(speed: number): string {
    // speed范围是0.25-4.0，转换为百分比
    const percentage = Math.round((speed - 1) * 100);
    return percentage >= 0 ? `+${percentage}%` : `${percentage}%`;
  }

  /**
   * 生成Edge TTS的SSML格式
   */
  private generateSSML(text: string, config: EdgeTTSConfig): string {
    return `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
        <voice name="${config.voice}">
          <prosody rate="${config.rate}" pitch="${config.pitch}">
            ${text}
          </prosody>
        </voice>
      </speak>
    `.trim();
  }

  /**
   * 通过Edge TTS API合成语音
   */
  async synthesize(text: string, voice: string, speed: number = 1.0): Promise<Blob> {
    const config: EdgeTTSConfig = {
      voice,
      rate: this.speedToRate(speed),
      pitch: "+0Hz",
    };

    const ssml = this.generateSSML(text, config);

    try {
      // 方案1: 使用第三方Edge TTS API服务
      const response = await this.callEdgeTTSAPI(ssml, voice);

      if (response.ok) {
        return await response.blob();
      }

      throw new Error(`Edge TTS API failed: ${response.status}`);
    } catch (error) {
      console.error("Edge TTS synthesis failed:", error);
      throw error;
    }
  }

  /**
   * 调用Edge TTS API
   * 这里需要配置实际的Edge TTS服务端点
   */
  private async callEdgeTTSAPI(ssml: string, voice: string): Promise<Response> {
    // 方案1: 使用公开的Edge TTS服务 (需要自己部署或使用第三方服务)
    const apiUrl = "https://your-edge-tts-service.com/api/synthesize";

    return fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: ssml,
        voice: voice,
        format: "audio-24khz-48kbitrate-mono-mp3",
      }),
    });

    // 方案2: 使用edge-tts库的本地服务端点
    // const localUrl = 'http://localhost:3001/synthesize';
    // return fetch(localUrl, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     text: ssml,
    //     voice: voice
    //   })
    // });
  }

  /**
   * 播放音频Blob
   */
  async playAudio(audioBlob: Blob): Promise<void> {
    return new Promise((resolve, reject) => {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        resolve();
      };

      audio.onerror = (error) => {
        URL.revokeObjectURL(audioUrl);
        reject(error);
      };

      audio.play().catch(reject);
    });
  }

  /**
   * 合成并播放语音
   */
  async speak(text: string, voice: string, speed: number = 1.0): Promise<void> {
    try {
      const audioBlob = await this.synthesize(text, voice, speed);
      await this.playAudio(audioBlob);
    } catch (error) {
      console.error("Edge TTS speak failed:", error);
      throw error;
    }
  }

  /**
   * 检查Edge TTS服务是否可用
   */
  async checkServiceAvailability(): Promise<boolean> {
    try {
      // 测试简单的合成请求
      await this.synthesize("test", "en-US-AriaNeural", 1.0);
      return true;
    } catch (error) {
      console.warn("Edge TTS service not available:", error);
      return false;
    }
  }
}

// 导出单例实例
export const edgeTTSService = EdgeTTSService.getInstance();
