import * as d3 from "d3";
import { cloneDeep } from "lodash";
import type {
  LifeCycleData,
  LifeCycleNode,
  NodeMatrix,
} from "./types";

/**
 * start, end, type 属性能够唯一标识一个节点
 */
export type NodePos = LifeCycleNode;

type HierarchyNode = d3.HierarchyNode<LifeCycleData>;

type CollapseCfg = [NodePos, boolean][];

export const TRANSPARENT_FLAG = "transparent";

/**
 * 判断给定节点是否是满足位置描述信息的节点
 */
export function matchNode(
  { start, end, type, _type }: LifeCycleNode,
  node: NodePos
): boolean {
  return (
    start === node.start &&
    end === node.end &&
    (type !== TRANSPARENT_FLAG ? node.type === type : node._type === _type)
  );
}

/**
 * 从生命周期图数据结构中根据位置信息查找节点
 */
export function findNode(node: HierarchyNode, pos: NodePos) {
  const result = node
    .descendants()
    .filter(({ data: { node } }) => matchNode(node, pos));
  if (result.length !== 1) return undefined;
  return result[0];
}

/**
 * 判断节点是否折叠
 * true - 折叠：（未指定collapse）默认, 指定collapse为true
 * false - 展开：collapse 为false
 */
export function isCollapse(node: HierarchyNode) {
  return node.data.collapse === false;
}

/**
 * 将 pos 位置的节点折叠或展开
 */
export function setCollapse(
  data: HierarchyNode,
  pos: NodePos,
  collapse: boolean
) {
  const node = findNode(data, pos);
  if (node) {
    node.data.collapse = collapse;
  }
}

/**
 * calculate the max depth of node
 */
export function maxDepth(node: HierarchyNode): number {
  let d = 0;
  node.descendants().forEach((datum, i) => {
    d = Math.max(d, datum.depth);
  });
  return d;
}

/**
 * 生成第 depth 层的数据
 * 取该层所有 collapse 属性不为 false 的节点 （折叠）
 * 注：
 * 折叠\展开只针对于节点的子节点
 * 如果一个节点要展开，那么他所有的祖先节点都是展开的
 * 如果一个节点是折叠的，那么不需要再关注他的任意子节点7
 */
export function getNodesByDepth(node: LifeCycleData) {
  const root = d3.hierarchy(node);
  const depth = maxDepth(root);
  const results: HierarchyNode[] = [];

  /**
   * 该节点到父节点的路径是否有被折叠的节点，没有的话即展开的
   */
  const isNodeExpand = (node: HierarchyNode) => {
    return !node
      .ancestors()
      .map((a) => a.data.collapse)
      .includes(true);
  };

  const setTransparent = (node: HierarchyNode) => {
    if (node.data.node.type !== TRANSPARENT_FLAG)
      node.data.node._type = node.data.node.type;
    node.data.node.type = TRANSPARENT_FLAG;
  };

  for (let i = 0; i <= depth; i++) {
    const tree = d3.hierarchy(cloneDeep(node));
    tree.descendants().forEach((d) => {
      d.children = d.children?.filter((c) => {
        if (i === 0) return c.data.collapse;
        // 如果最小深度都小于 depth, 就不保留
        if (maxDepth(c) < i) return false;
        // // 深度小的，如果都是展开的，那么就保留
        // 如果深度小，如果都是展开的，且有深度大于等于i的后续展开节点
        // 如果已经折叠过，则不保留节点
        if (c.depth <= i) {
          const reserve = isNodeExpand(c);
          const _ = c.descendants().filter((n) => {
            if (n.depth >= i && n.data.collapse === false) return true;
            return false;
          });

          if (_.length === 0) return false;

          if (reserve && c.depth === i) {
            // 将前置节点标记为透明类型
            // 比如当前深度为 i，就需要将深度小于 i 的节点标记为透明类型
            c.ancestors().slice(1).forEach(setTransparent);
          }
          return reserve;
        }
        // 如果深度大于显示层数，则判断节点是否展开，如果展开，则不保留节点
        return !isNodeExpand(c);
      });
    });

    // 如果只剩下根节点，且深度不为 0，则置为透明
    if (tree.descendants().length === 1 && i !== 0) {
      setTransparent(tree);
    }
    results.push(tree);
  }
  return results;
}

/**
 * convert hierarchy node to life cycle data
 */
export function hierarchyNode2LifeCycleData(
  hierarchyNode: HierarchyNode,
  reserveExtraAttr: boolean = true
): LifeCycleData {
  const nodesList: LifeCycleData[] = [];
  const createNode = ({
    node,
    children,
    ...extraAttr
  }: LifeCycleData): LifeCycleData => {
    return {
      node,
      ...(reserveExtraAttr ? extraAttr : {}),
      children: [],
    };
  };
  const _ = (n: LifeCycleData["node"]) => {
    return nodesList.filter(({ node }) => matchNode(node, n));
  };
  hierarchyNode.descendants().forEach((d) => {
    const node = createNode(d.data);
    if (d.parent) {
      const parent = _(d.parent.data.node)[0];
      parent.children.push(node);
    }
    nodesList.push(node);
  });
  return nodesList[0];
}

/**
 * 默认 collapse 状态
 */
function defaultCollapseCfg(index: number, type?: string) {
  return index === 0 ? false : true;
}

export function lifeCycleData2HierarchyNode(
  node: LifeCycleData,
  collapseCfg?: CollapseCfg
): HierarchyNode {
  const root = d3.hierarchy(cloneDeep(node));
  // init collapse attribute
  root.descendants().forEach((d, i) => {
    // 根节点默认展开
    !d.data.hasOwnProperty("collapse") &&
      (d.data.collapse = defaultCollapseCfg(i));
  });

  if (collapseCfg) {
    /**
     * 2. 配置折叠属性
     */
    collapseCfg.forEach(([pos, collapse]) => {
      setCollapse(root, pos, collapse);
    });
  }

  return root;
}

/**
 *
 * @param node 获得节点的初始状态
 */
export function getNodesCollapseState(
  node: LifeCycleData
): [LifeCycleNode, boolean][] {
  const hierarchyNode = lifeCycleData2HierarchyNode(node);
  return hierarchyNode.descendants().map(({ data: { node, collapse } }, i) => {
    return [node, collapse];
  });
}

/**
 * 流程
 * 1. 输入 LifeCycleData 以及展开参数
 * 2. 输出用于绘制的 LifeCycleData 数组
 *
 */
export function pipeline(node: LifeCycleData, collapseCfg?: CollapseCfg) {
  /**
   * 1. 将 LifeCycleData 转换为 HierarchyNode
   */
  const hierarchyNode = lifeCycleData2HierarchyNode(node, collapseCfg);

  const collapseData = hierarchyNode2LifeCycleData(hierarchyNode);

  /**
   * 2. 导出结果
   */
  const results = getNodesByDepth(collapseData);

  /**
   * 3. 转化为 LifeCycleData
   */
  return results.map((r) => hierarchyNode2LifeCycleData(r));
}

export function nodeMatrix2TypeMatrix(nodeMat: NodeMatrix) {
  return nodeMat.map((a) => a.map((b) => b.map((c) => c.type)));
}
