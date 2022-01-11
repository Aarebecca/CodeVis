import { LifeCycleDiagram } from "./lifecycle";

describe("LifeCycleDiagram", () => {
  test("init", () => {
    const lifeCycle = new LifeCycleDiagram({
      width: 100,
      height: 101,
      depth: 10,
      padding: {
        left: 10,
      },
      maxCols: 20,
      colorMap: {
        Identifier: "red",
      },
    });

    expect(lifeCycle.get("width")).toBe(100);
    expect(lifeCycle.get("height")).toBe(101);
    expect(lifeCycle.get("depth")).toBe(10);
    expect(lifeCycle.get("padding").left).toBe(10);
    expect(lifeCycle.get("padding").top).toBe(0);
    expect(lifeCycle.get("padding").right).toBe(0);
    expect(lifeCycle.get("padding").bottom).toBe(0);
    expect(lifeCycle.get("maxCols")).toBe(20);
    expect(lifeCycle.get("colorMap").Identifier).toBe("red");
  });

  test("one", () => {
    const config = {
      node: { start: 1, end: 5, type: "A" }, // depth 1
      children: [
        {
          node: { start: 2, end: 4, type: "B" }, // depth 2
          children: [
            {
              node: { start: 3, end: 3, type: "C" }, // depth 3
              children: [
                {
                  node: { start: 3, end: 3, type: "D" }, // depth 4
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    };

    // @ts-ignore
    const mat = new LifeCycleDiagram({ maxLine: 5 }).mixMat(config);
    expect(mat).toStrictEqual([
      [["A"]],
      [["A", "B"]],
      [["A", "B", "C", "D"]],
      [["A", "B"]],
      [["A"]],
    ]);
  });

  test("one by one", () => {
    const config = {
      node: { start: 1, end: 5, type: "A" }, // depth 1
      children: [
        {
          node: { start: 2, end: 2, type: "B" }, // depth 2
          children: [],
        },
        {
          node: { start: 3, end: 3, type: "C" }, // depth 2
          children: [],
        },
        {
          node: { start: 4, end: 4, type: "D" }, // depth 2
          children: [],
        },
      ],
    };

    // @ts-ignore
    const mat = new LifeCycleDiagram({ maxLine: 5 }).mixMat(config);
    expect(mat).toStrictEqual([
      [["A"]],
      [["A", "B"]],
      [["A", "C"]],
      [["A", "D"]],
      [["A"]],
    ]);
  });

  test("one tow one", () => {
    const config = {
      node: { start: 1, end: 5, type: "A" }, // depth 1
      children: [
        {
          node: { start: 2, end: 2, type: "B" }, // depth 2
          children: [],
        },
        {
          node: { start: 2, end: 2, type: "C" }, // depth 2
          children: [],
        },
        {
          node: { start: 3, end: 3, type: "D" }, // depth 2
          children: [],
        },
      ],
    };

    // @ts-ignore
    const mat = new LifeCycleDiagram({ maxLine: 5 }).mixMat(config);
    console.log(mat);
    expect(mat).toStrictEqual([
      [["A"], ["A"]],
      [
        ["A", "B"],
        ["A", "C"],
      ],
      [
        ["A", "D"],
        ["A", "D"],
      ],
      [["A"], ["A"]],
      [["A"], ["A"]],
    ]);
  });

  test("case1", () => {
    const config = {
      node: { start: 1, end: 9, type: "A" }, // depth 1
      children: [
        {
          node: { start: 1, end: 7, type: "B" }, // depth 2
          children: [
            {
              node: { start: 4, end: 4, type: "C" }, // depth 3
              children: [
                {
                  node: { start: 4, end: 4, type: "D" }, // depth 4
                  children: [],
                },
              ],
            },
            {
              node: { start: 4, end: 5, type: "E" }, // depth 3
              children: [
                {
                  node: { start: 4, end: 4, type: "F" }, // depth 4
                  children: [
                    {
                      node: { start: 4, end: 4, type: "G" }, // depth 5
                      children: [],
                    },
                    {
                      node: { start: 4, end: 4, type: "H" }, // depth 5
                      children: [],
                    },
                  ],
                },
                {
                  node: { start: 4, end: 4, type: "I" }, // depth 4
                  children: [],
                },
                {
                  node: { start: 5, end: 5, type: "J" }, // depth 4
                  children: [],
                },
                {
                  node: { start: 5, end: 5, type: "K" }, // depth 4
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    };

    // @ts-ignore
    const mat = new LifeCycleDiagram({}).mixMat(config);
    expect(mat).toStrictEqual([
      [
        ["A", "B"],
        ["A", "B"],
        ["A", "B"],
        ["A", "B"],
        ["A", "B"],
        ["A", "B"],
        ["A", "B"],
        ["A", "B"],
      ],
      [
        ["A", "B"],
        ["A", "B"],
        ["A", "B"],
        ["A", "B"],
        ["A", "B"],
        ["A", "B"],
        ["A", "B"],
        ["A", "B"],
      ],
      [
        ["A", "B"],
        ["A", "B"],
        ["A", "B"],
        ["A", "B"],
        ["A", "B"],
        ["A", "B"],
        ["A", "B"],
        ["A", "B"],
      ],
      [
        ["A", "B", "C", "D"],
        ["A", "B", "C", "D"],
        ["A", "B", "C", "D"],
        ["A", "B", "C", "D"],
        ["A", "B", "E", "F", "G"],
        ["A", "B", "E", "F", "H"],
        ["A", "B", "E", "I"],
        ["A", "B", "E", "I"],
      ],
      [
        ["A", "B", "E", "J"],
        ["A", "B", "E", "J"],
        ["A", "B", "E", "J"],
        ["A", "B", "E", "J"],
        ["A", "B", "E", "K"],
        ["A", "B", "E", "K"],
        ["A", "B", "E", "K"],
        ["A", "B", "E", "K"],
      ],
      [
        ["A", "B"],
        ["A", "B"],
        ["A", "B"],
        ["A", "B"],
        ["A", "B"],
        ["A", "B"],
        ["A", "B"],
        ["A", "B"],
      ],
      [
        ["A", "B"],
        ["A", "B"],
        ["A", "B"],
        ["A", "B"],
        ["A", "B"],
        ["A", "B"],
        ["A", "B"],
        ["A", "B"],
      ],
      [["A"], ["A"], ["A"], ["A"], ["A"], ["A"], ["A"], ["A"]],
      [["A"], ["A"], ["A"], ["A"], ["A"], ["A"], ["A"], ["A"]],
      [["A"], ["A"], ["A"], ["A"], ["A"], ["A"], ["A"], ["A"]],
    ]);
  });
});
