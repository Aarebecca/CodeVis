import {
  findNode,
  pipeline,
  maxDepth,
  lifeCycleData2HierarchyNode,
  getNodesByDepth,
  getNodesCollapseState,
  hierarchyNode2LifeCycleData,
} from "../../src/lifecycle/utils";
import type { LifeCycleData } from "../../src/lifecycle/types";

const testData: LifeCycleData = {
  node: { start: 1, end: 8, type: "A" }, // depth 1
  collapse: false,
  children: [
    {
      node: { start: 2, end: 2, type: "B" }, // depth 2
      collapse: false,
      children: [],
    },
    {
      node: { start: 2, end: 2, type: "C" }, // depth 2
      collapse: true,
      children: [],
    },
    {
      node: { start: 3, end: 3, type: "D" }, // depth 2
      collapse: true,
      children: [],
    },
    {
      node: { start: 4, end: 5, type: "E" }, // depth 2
      collapse: false,
      children: [
        {
          node: { start: 5, end: 5, type: "EA" }, // depth 2
          collapse: true,
          children: [],
        },
        {
          node: { start: 5, end: 5, type: "EB" }, // depth 2
          collapse: false,
          children: [],
        },
      ],
    },
    {
      node: { start: 4, end: 5, type: "F" }, // depth 2
      collapse: false,
      children: [
        {
          node: { start: 5, end: 5, type: "FA" }, // depth 2
          collapse: false,
          children: [
            {
              node: { start: 5, end: 5, type: "FAA" }, // depth 2
              collapse: false,
              children: [],
            },
            {
              node: { start: 5, end: 5, type: "FAB" }, // depth 2
              collapse: true,
              children: [],
            },
          ],
        },
      ],
    },
    {
      node: { start: 7, end: 8, type: "G" }, // depth 2
      collapse: true,
      children: [],
    },
  ],
};

const hierarchyNode = lifeCycleData2HierarchyNode(testData);

describe("utils", () => {
  it("findNode", () => {
    expect(findNode(hierarchyNode, { start: 1, end: 8, type: "A" })).toEqual(
      hierarchyNode
    );

    expect(findNode(hierarchyNode, { start: 2, end: 2, type: "B" })).toEqual(
      hierarchyNode.children[1]
    );

    expect(findNode(hierarchyNode, { start: 5, end: 5, type: "EA" })).toEqual(
      hierarchyNode.children[3].children[1]
    );
  });

  it("maxDepth", () => {
    expect(maxDepth(hierarchyNode)).toEqual(3);
  });

  it("getNodesByDepth", () => {
    const nodes = getNodesByDepth(testData);

    expect(nodes.length).toEqual(4);

    /**
     * 第 0 层展开，保留深度为 1 的展开节点 A 以及折叠的节点 C D G
     */
    expect(nodes[0].children.length).toEqual(3);
    expect(nodes[0].children[0].data.node.type).toEqual("C");
    expect(nodes[0].children[1].data.node.type).toEqual("D");
    expect(nodes[0].children[2].data.node.type).toEqual("G");

    /**
     * 第 1 层展开，保留深度为 2 的展开节点 B E 及其后续节点中的折叠节点 EA
     */
    expect(nodes[1].children.length).toEqual(3);
    expect(nodes[1].children[0].data.node.type).toEqual("B");
    expect(nodes[1].children[1].data.node.type).toEqual("E");
    expect(nodes[1].children[1].children.length).toEqual(1);
    expect(nodes[1].children[1].children[0].data.node.type).toEqual("EA");
    expect(nodes[1].data.node.type).toEqual("transparent");
    expect(nodes[1].children[2].data.node.type).toEqual("F");
    expect(nodes[1].children[2].children.length).toEqual(0);

    /**
     * 第 2 层展开，保留深度为 3 的展开节点 EB 及其后续节点中的折叠节点
     */
    expect(nodes[2].children.length).toEqual(2);
    expect(nodes[2].children[0].children[0].data.node.type).toEqual("EB");
    expect(nodes[2].data.node.type).toEqual("transparent");
    expect(nodes[2].children[0].data.node.type).toEqual("transparent");
    expect(nodes[2].children[1].data.node._type).toEqual("F");
    expect(nodes[2].children[1].data.node.type).toEqual("transparent");
    expect(nodes[2].children[1].children[0].data.node.type).toEqual("FA");

    /**
     * 第 3 层展开
     */
    expect(nodes[3].children.length).toEqual(1);
    expect(nodes[3].children[0].children[0].children[0].data.node.type).toEqual(
      "FAA"
    );
  });

  it("hierarchyNode2LifeCycleData", () => {
    const lifeCycleData = hierarchyNode2LifeCycleData(hierarchyNode);
    expect(lifeCycleData.node).toStrictEqual(testData.node);
    expect(lifeCycleData.children.length).toEqual(testData.children.length);
    lifeCycleData.children.forEach(({ node }, index) => {
      expect(node).toStrictEqual(testData.children[index].node);
    });

    // reserve collapse attr
    const collapseData = hierarchyNode2LifeCycleData(hierarchyNode);
    expect(collapseData.collapse).toEqual(false);
    expect(collapseData.children[0].collapse).toEqual(false);
    expect(collapseData.children[1].collapse).toEqual(true);
    expect(collapseData.children[2].collapse).toEqual(true);
    expect(collapseData.children[3].collapse).toEqual(false);
    expect(collapseData.children[3].children[0].collapse).toEqual(true);
    expect(collapseData.children[3].children[1].collapse).toEqual(false);
    expect(collapseData.children[4].collapse).toEqual(false);
    expect(collapseData.children[5].collapse).toEqual(true);
  });

  it("getNodesCollapseState", () => {
    const collapseState = getNodesCollapseState(testData);
    expect(collapseState.length).toEqual(12);
  });

  it("pipeline", () => {
    const results = pipeline(testData);
    console.log(results);
  });
});
