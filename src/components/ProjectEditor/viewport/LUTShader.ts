/**
 * LUT着色器
 * 用于应用LUT颜色变换
 * @author Cerror
 * @since 2025-08-29
 */

export const LUTShader = {
  uniforms: {
    tDiffuse: { value: null },
    lut: { value: null },
    lutSize: { value: 32 },
    intensity: { value: 1.0 },
  },

  vertexShader: `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,

  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform sampler2D lut;
    uniform float lutSize;
    uniform float intensity;
    
    varying vec2 vUv;
    
    vec3 lutLookup(vec3 color) {
      float size = lutSize;
      float sizeMinusOne = size - 1.0;
      
      // 将RGB值映射到LUT坐标
      vec3 scaledColor = color * sizeMinusOne;
      
      // 找到LUT中对应的位置
      float bIndex = floor(scaledColor.b);
      float bIndexNext = min(bIndex + 1.0, sizeMinusOne);
      
      // 计算在2D纹理中的UV坐标
      vec2 uv1 = vec2(
        (scaledColor.r + bIndex * size) / (size * size),
        scaledColor.g / size
      );
      
      vec2 uv2 = vec2(
        (scaledColor.r + bIndexNext * size) / (size * size),
        scaledColor.g / size
      );
      
      // 在LUT中查找颜色
      vec3 color1 = texture2D(lut, uv1).rgb;
      vec3 color2 = texture2D(lut, uv2).rgb;
      
      // 在两个LUT层之间插值
      float t = fract(scaledColor.b);
      return mix(color1, color2, t);
    }
    
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      
      if (intensity > 0.0) {
        vec3 lutColor = lutLookup(color.rgb);
        color.rgb = mix(color.rgb, lutColor, intensity);
      }
      
      gl_FragColor = color;
    }
  `,
};
