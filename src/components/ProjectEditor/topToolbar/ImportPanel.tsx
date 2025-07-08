import React, { useState, useRef, useCallback } from 'react';
import { Modal, Tabs, Upload, Button, Input, Progress, message, Space, Typography } from 'antd';
import { InboxOutlined, LinkOutlined, FileOutlined } from '@ant-design/icons';
import { useR3FFileImport } from '@/hooks/three';
import type { UploadProps } from 'antd';
import type { ImportPanelProps } from './types';
import './styles/ImportPanel.scss';

const { Dragger } = Upload;
const { Text } = Typography;

/**
 * 3D模型导入面板组件
 * 提供文件上传和URL导入两种方式导入3D模型
 * 支持GLB、GLTF、OBJ、FBX格式和ZIP压缩包
 * @param props 组件属性
 * @returns 导入面板React组件
 * @author Cerror
 * @since 2025-07-08 */
const ImportPanel: React.FC<ImportPanelProps> = ({
  visible,
  onClose,
  onImportSuccess,
  onImportError
}) => {
  const [activeTab, setActiveTab] = useState('file'); // 当前激活的标签页
  const [urlValue, setUrlValue] = useState(''); // URL输入框的值
  const [isImporting, setIsImporting] = useState(false); // 是否正在导入
  const fileInputRef = useRef<HTMLInputElement>(null); // 文件输入框引用

  // 使用React Three Fiber文件导入Hook
  const { state, uploadFiles, importFromUrl } = useR3FFileImport({
    maxFileSize: 100 * 1024 * 1024, // 100MB 最大文件大小
    onProgress: (progress) => {
      console.log(`导入进度: ${progress}%`);
    },
    onSuccess: (result) => {
      message.success(`成功导入文件: ${result.fileName}`);
    },
    onError: (error) => {
      message.error(`导入失败: ${error.message}`);
      onImportError?.(error.message);
    }
  });

  /**
   * 处理文件上传
   * @param files 要上传的文件列表
   */
  const handleFileUpload = useCallback(async (files: FileList | File[]) => {
    setIsImporting(true);
    try {
      const results = await uploadFiles(files);
      onImportSuccess?.(results);
      message.success(`成功导入 ${results.length} 个文件`);
      onClose(); // 导入成功后关闭面板
    } catch (error) {
      console.error('文件导入失败:', error);
    } finally {
      setIsImporting(false);
    }
  }, [uploadFiles, onImportSuccess, onClose]);

  /**
   * 处理URL导入
   */
  const handleUrlImport = useCallback(async () => {
    if (!urlValue.trim()) {
      message.error('请输入有效的URL');
      return;
    }

    setIsImporting(true);
    try {
      const result = await importFromUrl(urlValue);
      onImportSuccess?.([result]);
      message.success(`成功从URL导入: ${result.fileName}`);
      setUrlValue(''); // 清空URL输入框
      onClose(); // 导入成功后关闭面板
    } catch (error) {
      console.error('URL导入失败:', error);
    } finally {
      setIsImporting(false);
    }
  }, [urlValue, importFromUrl, onImportSuccess, onClose]);

  /**
   * 处理文件选择器变更
   * @param event 文件选择事件
   */
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  // Ant Design Upload 组件配置
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true, // 支持多文件选择
    accept: '.glb,.gltf,.obj,.fbx,.zip', // 接受的文件类型
    beforeUpload: () => false, // 阻止自动上传，由我们手动处理
    onChange: (info) => {
      // 处理文件变更事件
      const files = info.fileList.map(file => file.originFileObj).filter(Boolean) as File[];
      if (files.length > 0) {
        handleFileUpload(files);
      }
    },
    showUploadList: false, // 不显示上传列表
    disabled: isImporting // 导入时禁用上传
  };

  /**
   * 处理模态框关闭
   */
  const handleModalClose = useCallback(() => {
    if (!isImporting) {
      setUrlValue(''); // 清空URL输入框
      setActiveTab('file'); // 重置到文件上传标签页
      onClose();
    }
  }, [isImporting, onClose]);

  // 标签页配置
  const tabItems = [
    {
      key: 'file',
      label: (
        <span>
          <FileOutlined />
          文件上传
        </span>
      ),
      children: (
        <div style={{ padding: '20px 0' }} className="import-section">
          {/* 拖拽上传区域 */}
          <Dragger {...uploadProps} style={{ marginBottom: '16px' }}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">
              支持单个或批量上传。支持 GLB、GLTF、OBJ、FBX 格式和包含这些格式的 ZIP 文件
            </p>
          </Dragger>
          
          {/* 分割线 */}
          <div className="section-divider">
            <span className="divider-text">或者</span>
          </div>
          
          {/* 文件选择按钮 */}
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Button 
              type="default" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
            >
              选择文件
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".glb,.gltf,.obj,.fbx,.zip"
              multiple
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
          </div>
        </div>
      )
    },
    {
      key: 'url',
      label: (
        <span>
          <LinkOutlined />
          URL 导入
        </span>
      ),
      children: (
        <div style={{ padding: '20px 0' }} className="import-section">
          <Space direction="vertical" style={{ width: '100%' }}>
            {/* URL导入说明 */}
            <div>
              <Text strong>从URL导入3D模型</Text>
              <br />
              <Text type="secondary">请输入包含 GLB、GLTF、OBJ 或 FBX 文件的直链地址</Text>
            </div>
            
            {/* URL输入框 */}
            <Input
              placeholder="https://example.com/model.glb"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              onPressEnter={handleUrlImport}
              disabled={isImporting}
              size="large"
            />
            
            {/* URL导入按钮 */}
            <Button 
              type="primary" 
              size="large"
              onClick={handleUrlImport}
              disabled={!urlValue.trim() || isImporting}
              style={{ width: '100%' }}
            >
              {isImporting ? '导入中...' : '从URL导入'}
            </Button>
          </Space>
        </div>
      )
    }
  ];

  return (
    <Modal
      title="导入3D模型"
      open={visible}
      onCancel={handleModalClose}
      footer={null}
      width={600}
      maskClosable={!isImporting}
      closable={!isImporting}
      destroyOnClose
      className="import-panel-modal"
    >
      {state.isLoading && (
        <div style={{ marginBottom: '16px' }}>
          <Progress 
            percent={Math.round(state.progress)} 
            status={state.error ? 'exception' : 'active'}
            showInfo
          />
        </div>
      )}
      
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        centered
      />
    </Modal>
  );
};

export default ImportPanel;