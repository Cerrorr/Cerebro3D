/**
 * 3D文件加载器管理
 * 管理各种3D文件格式的加载器配置
 * @author Cerror
 * @since 2025-07-10
 */

import {
  GLTFLoader,
  OBJLoader,
  FBXLoader,
  DRACOLoader,
  KTX2Loader,
} from 'three-stdlib';
import { WebGLRenderer, LoadingManager } from 'three';
import type { SupportedFileType } from '../types';

/**
 * 加载器实例接口
 */
export interface LoaderInstances {
  gltfLoader: GLTFLoader;
  objLoader: OBJLoader;
  fbxLoader: FBXLoader;
  dracoLoader: DRACOLoader;
  ktx2Loader: KTX2Loader;
}

// 创建和配置3D文件加载器
export class LoaderManager {
  private loaders: LoaderInstances;

  constructor(renderer?: WebGLRenderer) {
    this.loaders = this.setupLoaders(renderer);
  }

  /**
   * 设置和配置加载器
   * @param renderer 可选的 WebGL 渲染器实例
   * @returns 配置好的加载器实例
   */
  private setupLoaders(renderer?: WebGLRenderer): LoaderInstances {
    // 创建 DRACO 解码器用于几何体压缩
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');

    // 创建 KTX2 解码器用于纹理压缩
    const ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath('/basis/');

    // 如果提供了渲染器，为 KTX2Loader 设置渲染器
    if (renderer) {
      ktx2Loader.detectSupport(renderer);
    }

    // 创建 GLTF 加载器并配置扩展支持
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    gltfLoader.setKTX2Loader(ktx2Loader);

    return {
      gltfLoader,
      objLoader: new OBJLoader(),
      fbxLoader: new FBXLoader(),
      dracoLoader,
      ktx2Loader,
    };
  }

  // 获取加载器实例
  getLoaders(): LoaderInstances {
    return this.loaders;
  }

  /**
   * 为GLTF加载器设置自定义资源管理器
   * @param resourceMap 资源映射表
   */
  setupGLTFResourceManager(resourceMap: Map<string, string>): void {
    const customManager = new LoadingManager();
    
    // 重写resolveURL方法来处理外部资源
    customManager.resolveURL = function(resourceUrl: string) {
      // 直接匹配
      if (resourceMap.has(resourceUrl)) {
        return resourceMap.get(resourceUrl)!;
      }
      
      // 文件名匹配
      const fileName = resourceUrl.split('/').pop() || resourceUrl;
      if (resourceMap.has(fileName)) {
        return resourceMap.get(fileName)!;
      }
      
      return resourceUrl;
    };
    
    this.loaders.gltfLoader.manager = customManager;
  }

  /**
   * 根据文件类型加载文件
   * @param fileType 文件类型
   * @param url 文件URL
   * @param onLoad 加载成功回调
   * @param onProgress 加载进度回调
   * @param onError 加载错误回调
   */
  loadFile(
    fileType: SupportedFileType,
    url: string,
    onLoad: (result: any) => void,
    onProgress?: (xhr: ProgressEvent) => void,
    onError?: (error: any) => void
  ): void {
    switch (fileType) {
      case 'gltf':
      case 'glb':
        this.loaders.gltfLoader.load(url, onLoad, onProgress, onError);
        break;
      case 'obj':
        this.loaders.objLoader.load(url, onLoad, onProgress, onError);
        break;
      case 'fbx':
        this.loaders.fbxLoader.load(url, onLoad, onProgress, onError);
        break;
      default:
        onError?.(new Error(`不支持的文件类型: ${fileType}`));
    }
  }
}