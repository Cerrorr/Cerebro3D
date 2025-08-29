/**
 * LUT纹理管理器
 * 负责加载和管理各种LUT纹理
 * @author Cerror
 * @since 2025-08-29
 */

import { 
  DataTexture, 
  RGBAFormat,
  LinearFilter, 
  ClampToEdgeWrapping,
  UnsignedByteType
} from 'three';

export type LUTType = 'Bourbon 64.CUBE' | 'Cinematic' | 'Warm' | 'Cool' | 'Vintage';

export interface LUTData {
  size: number;
  data: Float32Array;
}

/**
 * LUT纹理管理器类
 */
export class LUTManager {
  private static instance: LUTManager;
  private lutTextures: Map<LUTType, DataTexture> = new Map();

  public static getInstance(): LUTManager {
    if (!LUTManager.instance) {
      LUTManager.instance = new LUTManager();
    }
    return LUTManager.instance;
  }

  /**
   * 获取LUT纹理
   * @param lutType LUT类型
   * @returns LUT纹理
   */
  public async getLUTTexture(lutType: LUTType): Promise<DataTexture> {
    if (this.lutTextures.has(lutType)) {
      return this.lutTextures.get(lutType)!;
    }

    const texture = await this.createLUTTexture(lutType);
    this.lutTextures.set(lutType, texture);
    return texture;
  }

  /**
   * 创建程序化LUT纹理
   * @param lutType LUT类型
   * @returns LUT纹理
   */
  private async createLUTTexture(lutType: LUTType): Promise<DataTexture> {
    const size = 32; // 32x32x32 LUT
    const data = new Uint8Array(size * size * size * 4); // RGBA格式，使用Uint8Array

    // 根据不同类型生成不同的LUT数据
    this.generateLUTData(data, size, lutType);

    const texture = new DataTexture(data, size * size, size, RGBAFormat, UnsignedByteType);
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.wrapS = ClampToEdgeWrapping;
    texture.wrapT = ClampToEdgeWrapping;
    texture.generateMipmaps = false;
    texture.flipY = false;
    texture.needsUpdate = true;

    return texture;
  }

  /**
   * 生成LUT数据
   * @param data 数据数组
   * @param size LUT尺寸
   * @param lutType LUT类型
   */
  private generateLUTData(data: Uint8Array, size: number, lutType: LUTType): void {
    const sizeMinusOne = size - 1;

    for (let b = 0; b < size; b++) {
      for (let g = 0; g < size; g++) {
        for (let r = 0; r < size; r++) {
          const index = (b * size * size + g * size + r) * 4; // RGBA = 4个分量
          
          // 标准化RGB值 (0-1)
          const nr = r / sizeMinusOne;
          const ng = g / sizeMinusOne;
          const nb = b / sizeMinusOne;

          // 应用不同的LUT变换
          const transformed = this.applyLUTTransform(nr, ng, nb, lutType);
          
          data[index] = Math.round(transformed.r * 255);     // R
          data[index + 1] = Math.round(transformed.g * 255); // G
          data[index + 2] = Math.round(transformed.b * 255); // B
          data[index + 3] = 255;                             // A
        }
      }
    }
  }

  /**
   * 应用LUT变换
   * @param r 红色通道
   * @param g 绿色通道  
   * @param b 蓝色通道
   * @param lutType LUT类型
   * @returns 变换后的RGB值
   */
  private applyLUTTransform(r: number, g: number, b: number, lutType: LUTType): { r: number; g: number; b: number } {
    switch (lutType) {
      case 'Cinematic':
        return this.cinematicTransform(r, g, b);
      case 'Warm':
        return this.warmTransform(r, g, b);
      case 'Cool':
        return this.coolTransform(r, g, b);
      case 'Vintage':
        return this.vintageTransform(r, g, b);
      case 'Bourbon 64.CUBE':
        return this.bourbonTransform(r, g, b);
      default:
        return { r, g, b }; // 原始颜色
    }
  }

  /**
   * 电影风格变换
   */
  private cinematicTransform(r: number, g: number, b: number): { r: number; g: number; b: number } {
    // 增加对比度，降低高光，提升阴影
    const contrast = 1.2;
    const brightness = -0.1;
    const saturation = 1.1;

    // 应用对比度和亮度
    r = Math.max(0, Math.min(1, (r - 0.5) * contrast + 0.5 + brightness));
    g = Math.max(0, Math.min(1, (g - 0.5) * contrast + 0.5 + brightness));
    b = Math.max(0, Math.min(1, (b - 0.5) * contrast + 0.5 + brightness));

    // 应用饱和度
    const gray = r * 0.299 + g * 0.587 + b * 0.114;
    r = gray + saturation * (r - gray);
    g = gray + saturation * (g - gray);
    b = gray + saturation * (b - gray);

    return { r: Math.max(0, Math.min(1, r)), g: Math.max(0, Math.min(1, g)), b: Math.max(0, Math.min(1, b)) };
  }

  /**
   * 暖色调变换
   */
  private warmTransform(r: number, g: number, b: number): { r: number; g: number; b: number } {
    return {
      r: Math.min(1, r * 1.2 + 0.1),
      g: Math.min(1, g * 1.1 + 0.05),
      b: Math.max(0, b * 0.9 - 0.05)
    };
  }

  /**
   * 冷色调变换  
   */
  private coolTransform(r: number, g: number, b: number): { r: number; g: number; b: number } {
    return {
      r: Math.max(0, r * 0.9 - 0.05),
      g: Math.min(1, g * 1.05),
      b: Math.min(1, b * 1.2 + 0.1)
    };
  }

  /**
   * 复古风格变换
   */
  private vintageTransform(r: number, g: number, b: number): { r: number; g: number; b: number } {
    // 模拟老照片效果：降低饱和度，增加棕褐色调
    const sepia = 0.6;
    const newR = (r * (1 - sepia)) + ((r * 0.393 + g * 0.769 + b * 0.189) * sepia);
    const newG = (g * (1 - sepia)) + ((r * 0.349 + g * 0.686 + b * 0.168) * sepia);
    const newB = (b * (1 - sepia)) + ((r * 0.272 + g * 0.534 + b * 0.131) * sepia);
    
    return {
      r: Math.max(0, Math.min(1, newR)),
      g: Math.max(0, Math.min(1, newG)),
      b: Math.max(0, Math.min(1, newB))
    };
  }

  /**
   * Bourbon风格变换
   */
  private bourbonTransform(r: number, g: number, b: number): { r: number; g: number; b: number } {
    // 模拟胶片风格：增加对比度，暖色调，轻微去饱和
    const contrast = 1.15;
    const warmth = 0.1;
    const desaturation = 0.9;

    // 应用对比度
    r = Math.max(0, Math.min(1, (r - 0.5) * contrast + 0.5));
    g = Math.max(0, Math.min(1, (g - 0.5) * contrast + 0.5));
    b = Math.max(0, Math.min(1, (b - 0.5) * contrast + 0.5));

    // 添加暖色调
    r = Math.min(1, r + warmth * 0.5);
    g = Math.min(1, g + warmth * 0.3);
    b = Math.max(0, b - warmth * 0.1);

    // 轻微去饱和
    const gray = r * 0.299 + g * 0.587 + b * 0.114;
    r = gray + desaturation * (r - gray);
    g = gray + desaturation * (g - gray);
    b = gray + desaturation * (b - gray);

    return { r: Math.max(0, Math.min(1, r)), g: Math.max(0, Math.min(1, g)), b: Math.max(0, Math.min(1, b)) };
  }

  /**
   * 清理所有纹理
   */
  public dispose(): void {
    this.lutTextures.forEach(texture => texture.dispose());
    this.lutTextures.clear();
  }
}