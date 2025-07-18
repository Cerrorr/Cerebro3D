import React, { useState, useCallback, useEffect } from 'react';
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
  EyeInvisibleOutlined,
} from '@ant-design/icons';
import type { TreeDataNode } from 'antd';
import { SceneNode, SceneTreeProps } from './types';
import './styles/SceneTree.scss';

/**
 * 场景树组件
 * 显示3D场景的层级结构，支持节点搜索、展开/折叠、可见性切换等功能
 * @param props 组件属性
 * @returns 场景树React组件
 * @author Cerror
 * @since 2025-07-08 */
const SceneTree: React.FC<SceneTreeProps> = ({
  sceneData,
  selectedNodeId,
  onNodeSelect,
  onNodeVisibilityChange,
}) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['scene']);

  /**
   * 根据节点类型获取对应的图标
   * @param node 场景节点
   * @param expanded 是否展开状态（用于文件夹图标）
   * @returns 对应的图标React组件
   */
  const getNodeIcon = useCallback(
    (node: SceneNode, expanded?: boolean): React.ReactNode => {
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
    },
    []
  );

  /**
   * 将场景数据转换为Ant Design Tree组件需要的数据格式
   * @param nodes 场景节点数组
   * @returns 转换后的树形数据
   */
  const convertToTreeData = useCallback(
    (nodes: SceneNode[]): TreeDataNode[] => {
      if (!nodes || !Array.isArray(nodes)) {
        return [];
      }
      return nodes.map(node => {
        const isExpanded = expandedKeys.includes(node.id);

        return {
          key: node.id,
          title: (
            <div className="scene-tree-node">
              <Tooltip title={node.name} placement="top" mouseEnterDelay={0.5}>
                <span className="scene-tree-node__label">{node.name}</span>
              </Tooltip>
              <div className="scene-tree-node__actions">
                {/* 相机节点不显示可见性按钮 */}
                {node.type !== 'camera' && (
                  <Tooltip
                    title={node.visible !== false ? '隐藏 (H)' : '显示 (H)'}
                  >
                    <button
                      className={`visibility-btn ${node.visible !== false ? 'visible' : 'hidden'}`}
                      onClick={e => {
                        e.stopPropagation();
                        const newVisibility = !(node.visible !== false);
                        onNodeVisibilityChange?.(node.id, newVisibility);
                      }}
                    >
                      {node.visible !== false ? (
                        <EyeOutlined />
                      ) : (
                        <EyeInvisibleOutlined />
                      )}
                    </button>
                  </Tooltip>
                )}
              </div>
            </div>
          ),
          icon: getNodeIcon(node, isExpanded),
          children: node.children
            ? convertToTreeData(node.children)
            : undefined,
          disabled: node.visible === false,
          className: node.visible === false ? 'node-hidden' : '',
        };
      });
    },
    [expandedKeys, getNodeIcon, onNodeVisibilityChange]
  );

  /**
   * 根据搜索文本过滤树形数据
   * @param data 原始树形数据
   * @param searchText 搜索文本
   * @returns 过滤后的树形数据
   */
  const getFilteredData = useCallback(
    (data: TreeDataNode[], searchText: string): TreeDataNode[] => {
      if (!searchText) return data;

      /**
       * 递归过滤节点的内部函数
       * @param node 树节点
       * @returns 过滤后的节点或null
       */
      const filterNode = (node: TreeDataNode): TreeDataNode | null => {
        // 从原始场景数据中获取节点名称
        const findNodeName = (nodeKey: string): string => {
          const findInNodes = (nodes: SceneNode[]): string => {
            for (const sceneNode of nodes) {
              if (sceneNode.id === nodeKey) {
                return sceneNode.name;
              }
              if (sceneNode.children) {
                const childResult = findInNodes(sceneNode.children);
                if (childResult) return childResult;
              }
            }
            return '';
          };
          return findInNodes(sceneData || []);
        };

        const nodeName = findNodeName(node.key as string);
        const matches = nodeName
          .toLowerCase()
          .includes(searchText.toLowerCase());

        let filteredChildren: TreeDataNode[] = [];
        if (node.children) {
          filteredChildren = node.children
            .map(child => filterNode(child))
            .filter(Boolean) as TreeDataNode[];
        }

        if (matches || filteredChildren.length > 0) {
          return {
            ...node,
            children:
              filteredChildren.length > 0 ? filteredChildren : undefined,
          };
        }

        return null;
      };

      return data
        .map(node => filterNode(node))
        .filter(Boolean) as TreeDataNode[];
    },
    [sceneData]
  );

  /**
   * 处理搜索输入变更
   * @param value 搜索文本
   */
  const handleSearch = useCallback(
    (value: string) => {
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
    },
    [sceneData]
  );

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
  const handleSelect = useCallback(
    (selectedKeys: React.Key[]) => {
      if (selectedKeys.length > 0) {
        onNodeSelect?.(selectedKeys[0] as string);
      }
    },
    [onNodeSelect]
  );

  /**
   * 键盘快捷键处理
   */
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // 按 H 键切换选中节点的可见性
      if (
        event.key.toLowerCase() === 'h' &&
        selectedNodeId &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.metaKey
      ) {
        // 确保不是在输入框中按的 H 键
        const target = event.target as HTMLElement;
        if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.contentEditable === 'true'
        ) {
          return;
        }

        event.preventDefault();

        // 查找选中的节点
        const findNode = (nodes: SceneNode[], id: string): SceneNode | null => {
          for (const node of nodes) {
            if (node.id === id) return node;
            if (node.children) {
              const found = findNode(node.children, id);
              if (found) return found;
            }
          }
          return null;
        };

        const selectedNode = findNode(sceneData || [], selectedNodeId);
        if (selectedNode) {
          const newVisibility = !(selectedNode.visible !== false);
          onNodeVisibilityChange?.(selectedNodeId, newVisibility);
        }
      }
    };

    // 添加键盘事件监听
    document.addEventListener('keydown', handleKeyPress);

    // 清理事件监听
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [selectedNodeId, sceneData, onNodeVisibilityChange]);

  // 转换和过滤数据
  const treeData = convertToTreeData(sceneData || []);
  const filteredData = getFilteredData(treeData, searchValue);

  return (
    <div className="scene-tree">
      <div className="scene-tree-header">
        <div className="search-box">
          <Input
            className="search-input"
            placeholder="搜索节点..."
            prefix={<SearchOutlined className="search-icon" />}
            value={searchValue}
            onChange={e => handleSearch(e.target.value)}
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
          virtual={true}
        />
      </div>
    </div>
  );
};

export default SceneTree;
