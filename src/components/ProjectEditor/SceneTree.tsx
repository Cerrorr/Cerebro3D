import React, { useState, useCallback } from 'react';
import { Input, Tree, Tooltip } from 'antd';
import {
  SearchOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  AppstoreOutlined,
  BulbOutlined,
  VideoCameraOutlined,
  BgColorsOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons';
import type { TreeDataNode } from 'antd';
import { SceneNode, SceneTreeProps } from './types';
import './styles/SceneTree.scss';

/**
 * 场景树组件
 * 显示3D场景的层级结构，支持节点搜索、展开/折叠、可见性切换等功能
 * @param props 组件属性
 * @returns 场景树React组件
 */
const SceneTree: React.FC<SceneTreeProps> = ({
  sceneData,
  selectedNodeId,
  onNodeSelect,
  onNodeVisibilityChange
}) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['scene']);

  /**
   * 根据节点类型获取对应的图标
   * @param node 场景节点
   * @param expanded 是否展开状态（用于文件夹图标）
   * @returns 对应的图标React组件
   */
  const getNodeIcon = useCallback((node: SceneNode, expanded?: boolean): React.ReactNode => {
    switch (node.type) {
      case 'folder':
      case 'scene':
        return expanded ? <FolderOpenOutlined /> : <FolderOutlined />;
      case 'mesh':
      case 'geometry':
        return <AppstoreOutlined />;
      case 'light':
        return <BulbOutlined />;
      case 'camera':
        return <VideoCameraOutlined />;
      case 'material':
        return <BgColorsOutlined />;
      default:
        return <AppstoreOutlined />;
    }
  }, []);

  /**
   * 将场景数据转换为Ant Design Tree组件需要的数据格式
   * @param nodes 场景节点数组
   * @returns 转换后的树形数据
   */
  const convertToTreeData = useCallback((nodes: SceneNode[]): TreeDataNode[] => {
    if (!nodes || !Array.isArray(nodes)) {
      return [];
    }
    return nodes.map(node => {
      const isExpanded = expandedKeys.includes(node.id);
      
      return {
        key: node.id,
        title: (
          <div className="scene-tree-node">
            <span className="node-label">{node.name}</span>
            <div className="node-actions">
              <Tooltip title={node.visible !== false ? "隐藏 (H)" : "显示 (H)"}>
                <button
                  className="visibility-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNodeVisibilityChange?.(node.id, !(node.visible !== false));
                  }}
                >
                  {node.visible !== false ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                </button>
              </Tooltip>
            </div>
          </div>
        ),
        icon: getNodeIcon(node, isExpanded),
        children: node.children ? convertToTreeData(node.children) : undefined,
        disabled: node.visible === false,
        className: node.visible === false ? 'node-hidden' : ''
      };
    });
  }, [expandedKeys, getNodeIcon, onNodeVisibilityChange]);

  /**
   * 根据搜索文本过滤树形数据
   * @param data 原始树形数据
   * @param searchText 搜索文本
   * @returns 过滤后的树形数据
   */
  const getFilteredData = useCallback((data: TreeDataNode[], searchText: string): TreeDataNode[] => {
    if (!searchText) return data;
    
    /**
     * 递归过滤节点的内部函数
     * @param node 树节点
     * @returns 过滤后的节点或null
     */
    const filterNode = (node: TreeDataNode): TreeDataNode | null => {
      const nodeTitle = typeof node.title === 'string' ? node.title : '';
      const matches = nodeTitle.toLowerCase().includes(searchText.toLowerCase());
      
      let filteredChildren: TreeDataNode[] = [];
      if (node.children) {
        filteredChildren = node.children
          .map(child => filterNode(child))
          .filter(Boolean) as TreeDataNode[];
      }
      
      if (matches || filteredChildren.length > 0) {
        return {
          ...node,
          children: filteredChildren.length > 0 ? filteredChildren : undefined
        };
      }
      
      return null;
    };
    
    return data.map(node => filterNode(node)).filter(Boolean) as TreeDataNode[];
  }, []);

  /**
   * 处理搜索输入变更
   * @param value 搜索文本
   */
  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
    if (value && sceneData) {
      // 搜索时展开所有匹配的节点
      /**
       * 递归获取所有节点的key
       * @param nodes 节点数组
       * @returns 所有节点key的数组
       */
      const getAllKeys = (nodes: SceneNode[]): string[] => {
        let keys: string[] = [];
        nodes.forEach(node => {
          keys.push(node.id);
          if (node.children) {
            keys = keys.concat(getAllKeys(node.children));
          }
        });
        return keys;
      };
      setExpandedKeys(getAllKeys(sceneData));
    }
  }, [sceneData]);

  /**
   * 处理树节点展开/折叠
   * @param keys 展开的节点key数组
   */
  const handleExpand = useCallback((keys: React.Key[]) => {
    setExpandedKeys(keys);
  }, []);

  /**
   * 处理树节点选择
   * @param selectedKeys 选中的节点key数组
   */
  const handleSelect = useCallback((selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      onNodeSelect?.(selectedKeys[0] as string);
    }
  }, [onNodeSelect]);

  // 转换和过滤数据
  const treeData = convertToTreeData(sceneData || []);
  const filteredData = getFilteredData(treeData, searchValue);

  return (
    <div className="scene-tree">
      <div className="scene-tree-header">
        <h3>场景</h3>
        <div className="search-box">
          <Input
            className="search-input"
            placeholder="搜索节点..."
            prefix={<SearchOutlined className="search-icon" />}
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
          />
        </div>
      </div>

      <div className="scene-tree-content">
        <Tree
          showIcon
          expandedKeys={expandedKeys}
          selectedKeys={selectedNodeId ? [selectedNodeId] : []}
          treeData={filteredData}
          onExpand={handleExpand}
          onSelect={handleSelect}
          virtual={false}
        />
      </div>

    </div>
  );
};

export default SceneTree; 