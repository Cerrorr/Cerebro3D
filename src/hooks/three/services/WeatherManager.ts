/**
 * 天气效果管理器
 * 管理雾、雨、雪等天气效果在Three.js场景中的实现
 * @author Cerror
 * @since 2025-09-01
 */

import { 
  Scene,
  Fog,
  FogExp2,
  Color,
  Points,
  BufferGeometry,
  BufferAttribute,
  PointsMaterial,
  AdditiveBlending,
  Clock,
  TextureLoader,
  Texture
} from 'three';
import type { WeatherConfig } from '@/components/projectEditor/rightPanels/types/WeatherConfig.types';

export class WeatherManager {
  private scene: Scene;
  private weatherConfig: WeatherConfig;
  
  // 纹理加载器
  private textureLoader: TextureLoader;
  private rainTexture: Texture | null = null;
  private snowTexture: Texture | null = null;
  
  // 雨效果相关
  private rainParticles: Points | null = null;
  private rainGeometry: BufferGeometry | null = null;
  private rainMaterial: PointsMaterial | null = null;
  
  // 雪效果相关
  private snowParticles: Points | null = null;
  private snowGeometry: BufferGeometry | null = null;
  private snowMaterial: PointsMaterial | null = null;
  
  
  // 动画相关
  private clock: Clock;
  private animationId: number | null = null;

  constructor(scene: Scene) {
    this.scene = scene;
    this.clock = new Clock();
    this.textureLoader = new TextureLoader();
    this.weatherConfig = {
      fog: { enabled: false, type: 'Linear', color: '#888888', near: 1, far: 30, density: 0.02 },
      rain: { enabled: false, speed: 0.4, color: '#ffffff', size: 0.5, arc: 95, opacity: 0.4, particleCount: 2000 },
      snow: { enabled: false, speed: 1, density: 1, size: 0.5, opacity: 0.5, color: '#ffffff', particleCount: 1000 }
    };
    
    // 预加载纹理
    this.loadTextures();
  }

  /**
   * 加载天气效果纹理
   * 预加载雨和雪的纹理文件
   * @author Cerror
   * @since 2025-09-04
   */
  private loadTextures(): void {
    // 加载雨滴纹理
    this.textureLoader.load(
      '/images/rain.png',
      (texture) => {
        this.rainTexture = texture;
        console.log('🌧️ 雨滴纹理加载成功');
      },
      undefined,
      (error) => {
        console.warn('⚠️ 雨滴纹理加载失败:', error);
      }
    );
    
    // 加载雪花纹理
    this.textureLoader.load(
      '/images/snow.png',
      (texture) => {
        this.snowTexture = texture;
        console.log('❄️ 雪花纹理加载成功');
      },
      undefined,
      (error) => {
        console.warn('⚠️ 雪花纹理加载失败:', error);
      }
    );
  }

  /**
   * 更新天气配置
   * 根据新的配置参数更新天气效果
   * @param config - 新的天气配置对象
   * @author Cerror
   * @since 2025-09-01
   */
  updateConfig(config: WeatherConfig): void {
    this.weatherConfig = { ...config };
    this.applyWeatherEffects();
  }

  /**
   * 应用天气效果到场景
   * 根据当前配置应用所有天气效果（雾、雨、雪）
   * @author Cerror
   * @since 2025-09-01
   */
  private applyWeatherEffects(): void {
    this.applyFogEffect();
    this.applyRainEffect();
    this.applySnowEffect();
  }

  /**
   * 应用雾效果
   * 根据雾配置创建线性雾或指数雾效果
   * @author Cerror
   * @since 2025-09-01
   */
  private applyFogEffect(): void {
    const fogConfig = this.weatherConfig.fog;
    
    if (fogConfig.enabled) {
      const color = new Color(fogConfig.color);
      
      if (fogConfig.type === 'Linear') {
        // Three.js 线性雾：Fog(color, near, far)
        // 在 near 距离内完全可见，far 距离外完全不可见
        this.scene.fog = new Fog(color, fogConfig.near, fogConfig.far);
        console.log('🌫️ 线性雾已启用:', { color: fogConfig.color, near: fogConfig.near, far: fogConfig.far });
      } else {
        // Three.js 指数雾：FogExp2(color, density)
        // 使用配置的密度值，密度越大雾越浓
        this.scene.fog = new FogExp2(color, fogConfig.density);
        console.log('🌫️ 指数雾已启用:', { color: fogConfig.color, density: fogConfig.density });
      }
    } else {
      this.scene.fog = null;
      console.log('🌫️ 雾效果已禁用');
    }
  }

  /**
   * 应用雨效果
   */
  private applyRainEffect(): void {
    const rainConfig = this.weatherConfig.rain;
    
    if (rainConfig.enabled) {
      // 检查是否需要重新创建粒子（粒子数量改变）
      const needRecreate = !this.rainParticles || 
        (this.rainGeometry && this.rainGeometry.attributes.position.count !== rainConfig.particleCount);
      
      if (needRecreate) {
        this.removeRainParticles();
        this.createRainParticles();
      } else if (this.rainParticles) {
        this.updateRainParticles();
      }
    } else {
      this.removeRainParticles();
    }
  }

  /**
   * 创建雨粒子系统
   * 根据配置创建指定数量的雨粒子并添加到场景中，使用纹理贴图
   * @author Cerror
   * @since 2025-09-01
   */
  private createRainParticles(): void {
    const rainConfig = this.weatherConfig.rain;
    const particleCount = rainConfig.particleCount;
    const positions = new Float32Array(particleCount * 3);
    
    // 随机分布粒子位置
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 100;     // x
      positions[i + 1] = Math.random() * 100;        // y
      positions[i + 2] = (Math.random() - 0.5) * 100; // z
    }
    
    this.rainGeometry = new BufferGeometry();
    this.rainGeometry.setAttribute('position', new BufferAttribute(positions, 3));
    
    this.rainMaterial = new PointsMaterial({
      color: new Color(rainConfig.color),
      size: rainConfig.size,
      transparent: true,
      opacity: rainConfig.opacity,
      vertexColors: false,
      blending: AdditiveBlending,
      depthWrite: false,
      fog: false,  // 雨粒子不受雾影响
      map: this.rainTexture, // 使用雨滴纹理
      alphaTest: 0.1 // 只渲染不透明的像素
    });
    
    this.rainParticles = new Points(this.rainGeometry, this.rainMaterial);
    this.scene.add(this.rainParticles);
    console.log(`🌧️ 雨粒子已创建 (${particleCount}个粒子)` + (this.rainTexture ? ' - 使用纹理贴图' : ' - 使用纯色'));
  }

  /**
   * 更新雨粒子
   */
  private updateRainParticles(): void {
    if (!this.rainParticles || !this.rainMaterial) return;
    
    const rainConfig = this.weatherConfig.rain;
    
    this.rainMaterial.color = new Color(rainConfig.color);
    this.rainMaterial.size = rainConfig.size;
    this.rainMaterial.opacity = rainConfig.opacity;
    this.rainMaterial.needsUpdate = true;
  }

  /**
   * 移除雨粒子
   */
  private removeRainParticles(): void {
    if (this.rainParticles) {
      this.scene.remove(this.rainParticles);
      this.rainParticles = null;
    }
    if (this.rainGeometry) {
      this.rainGeometry.dispose();
      this.rainGeometry = null;
    }
    if (this.rainMaterial) {
      this.rainMaterial.dispose();
      this.rainMaterial = null;
    }
  }

  /**
   * 应用雪效果
   */
  private applySnowEffect(): void {
    const snowConfig = this.weatherConfig.snow;
    
    if (snowConfig.enabled) {
      // 检查是否需要重新创建粒子（粒子数量改变）
      const needRecreate = !this.snowParticles || 
        (this.snowGeometry && this.snowGeometry.attributes.position.count !== snowConfig.particleCount);
      
      if (needRecreate) {
        this.removeSnowParticles();
        this.createSnowParticles();
      } else if (this.snowParticles) {
        this.updateSnowParticles();
      }
    } else {
      this.removeSnowParticles();
    }
  }

  /**
   * 创建雪粒子系统
   * 根据配置创建指定数量的雪粒子并添加到场景中，使用纹理贴图
   * @author Cerror
   * @since 2025-09-01
   */
  private createSnowParticles(): void {
    const snowConfig = this.weatherConfig.snow;
    const particleCount = snowConfig.particleCount;
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    // 随机分布粒子位置和大小
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 100;     // x
      positions[i + 1] = Math.random() * 100;        // y
      positions[i + 2] = (Math.random() - 0.5) * 100; // z
      sizes[i / 3] = Math.random() * 2 + 1;         // 随机大小
    }
    
    this.snowGeometry = new BufferGeometry();
    this.snowGeometry.setAttribute('position', new BufferAttribute(positions, 3));
    this.snowGeometry.setAttribute('size', new BufferAttribute(sizes, 1));
    
    this.snowMaterial = new PointsMaterial({
      color: new Color(snowConfig.color || '#ffffff'),
      size: snowConfig.size,
      transparent: true,
      opacity: snowConfig.opacity,
      vertexColors: false,
      blending: AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
      fog: false,  // 雪粒子不受雾影响
      map: this.snowTexture, // 使用雪花纹理
      alphaTest: 0.1 // 只渲染不透明的像素
    });
    
    this.snowParticles = new Points(this.snowGeometry, this.snowMaterial);
    this.scene.add(this.snowParticles);
    console.log(`❄️ 雪粒子已创建 (${particleCount}个粒子)` + (this.snowTexture ? ' - 使用纹理贴图' : ' - 使用纯色'));
  }

  /**
   * 更新雪粒子
   */
  private updateSnowParticles(): void {
    if (!this.snowParticles || !this.snowMaterial) return;
    
    const snowConfig = this.weatherConfig.snow;
    
    this.snowMaterial.color = new Color(snowConfig.color || '#ffffff');
    this.snowMaterial.size = snowConfig.size;
    this.snowMaterial.opacity = snowConfig.opacity;
    this.snowMaterial.needsUpdate = true;
  }

  /**
   * 移除雪粒子
   */
  private removeSnowParticles(): void {
    if (this.snowParticles) {
      this.scene.remove(this.snowParticles);
      this.snowParticles = null;
    }
    if (this.snowGeometry) {
      this.snowGeometry.dispose();
      this.snowGeometry = null;
    }
    if (this.snowMaterial) {
      this.snowMaterial.dispose();
      this.snowMaterial = null;
    }
  }

  /**
   * 动画循环
   */
  private animate(): void {
    const deltaTime = this.clock.getDelta();
    
    // 更新雨粒子动画
    if (this.rainParticles && this.rainGeometry && this.weatherConfig.rain.enabled) {
      const positions = this.rainGeometry.attributes.position.array as Float32Array;
      const speed = this.weatherConfig.rain.speed;
      const arc = (this.weatherConfig.rain.arc * Math.PI) / 180; // 转换为弧度
      
      for (let i = 0; i < positions.length; i += 3) {
        // 垂直下落
        positions[i + 1] -= speed * 10 * deltaTime;
        
        // 水平移动（模拟弧度）
        positions[i] += Math.sin(arc) * speed * 2 * deltaTime;
        
        // 重置到底部
        if (positions[i + 1] < 0) {
          positions[i + 1] = 100;
          positions[i] = (Math.random() - 0.5) * 100;
        }
      }
      this.rainGeometry.attributes.position.needsUpdate = true;
    }
    
    // 更新雪粒子动画
    if (this.snowParticles && this.snowGeometry && this.weatherConfig.snow.enabled) {
      const positions = this.snowGeometry.attributes.position.array as Float32Array;
      const speed = this.weatherConfig.snow.speed;
      const density = this.weatherConfig.snow.density;
      
      for (let i = 0; i < positions.length; i += 3) {
        // 缓慢下落
        positions[i + 1] -= speed * 2 * deltaTime;
        
        // 左右飘动
        positions[i] += Math.sin(Date.now() * 0.001 + i) * density * deltaTime;
        
        // 重置到底部
        if (positions[i + 1] < 0) {
          positions[i + 1] = 100;
          positions[i] = (Math.random() - 0.5) * 100;
        }
      }
      this.snowGeometry.attributes.position.needsUpdate = true;
    }
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  /**
   * 开始动画
   */
  startAnimation(): void {
    if (!this.animationId) {
      this.clock.start();
      this.animate();
    }
  }

  /**
   * 停止动画
   */
  stopAnimation(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * 销毁管理器
   */
  destroy(): void {
    this.stopAnimation();
    this.removeRainParticles();
    this.removeSnowParticles();
    this.scene.fog = null;
    
    // 销毁纹理
    if (this.rainTexture) {
      this.rainTexture.dispose();
      this.rainTexture = null;
    }
    if (this.snowTexture) {
      this.snowTexture.dispose();
      this.snowTexture = null;
    }
  }
}