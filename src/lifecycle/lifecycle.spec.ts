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
    const data = {
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
    const { typeMat } = new LifeCycleDiagram({ maxLine: 5 }).generate(data);
    expect(typeMat).toStrictEqual([
      [["root", "A"]],
      [["root", "A", "B"]],
      [["root", "A", "B", "C", "D"]],
      [["root", "A", "B"]],
      [["root", "A"]],
    ]);
  });

  test("one by one", () => {
    const data = {
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
    const { typeMat } = new LifeCycleDiagram({ maxLine: 5 }).generate(data);
    expect(typeMat).toStrictEqual([
      [["root", "A"]],
      [["root", "A", "B"]],
      [["root", "A", "C"]],
      [["root", "A", "D"]],
      [["root", "A"]],
    ]);
  });

  test("one tow one", () => {
    const data = {
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
    const { typeMat } = new LifeCycleDiagram({ maxLine: 5 }).generate(data);
    expect(typeMat).toStrictEqual([
      [
        ["root", "A"],
        ["root", "A"],
      ],
      [
        ["root", "A", "B"],
        ["root", "A", "C"],
      ],
      [
        ["root", "A", "D"],
        ["root", "A", "D"],
      ],
      [
        ["root", "A"],
        ["root", "A"],
      ],
      [
        ["root", "A"],
        ["root", "A"],
      ],
    ]);
  });

  test("case1", () => {
    const data = {
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
    const { typeMat } = new LifeCycleDiagram({}).generate(data);
    expect(typeMat).toStrictEqual([
      [
        ["root", "A", "B"],
        ["root", "A", "B"],
        ["root", "A", "B"],
        ["root", "A", "B"],
        ["root", "A", "B"],
        ["root", "A", "B"],
        ["root", "A", "B"],
        ["root", "A", "B"],
      ],
      [
        ["root", "A", "B"],
        ["root", "A", "B"],
        ["root", "A", "B"],
        ["root", "A", "B"],
        ["root", "A", "B"],
        ["root", "A", "B"],
        ["root", "A", "B"],
        ["root", "A", "B"],
      ],
      [
        ["root", "A", "B"],
        ["root", "A", "B"],
        ["root", "A", "B"],
        ["root", "A", "B"],
        ["root", "A", "B"],
        ["root", "A", "B"],
        ["root", "A", "B"],
        ["root", "A", "B"],
      ],
      [
        ["root", "A", "B", "C", "D"],
        ["root", "A", "B", "C", "D"],
        ["root", "A", "B", "C", "D"],
        ["root", "A", "B", "C", "D"],
        ["root", "A", "B", "E", "F", "G"],
        ["root", "A", "B", "E", "F", "H"],
        ["root", "A", "B", "E", "I"],
        ["root", "A", "B", "E", "I"],
      ],
      [
        ["root", "A", "B", "E", "J"],
        ["root", "A", "B", "E", "J"],
        ["root", "A", "B", "E", "J"],
        ["root", "A", "B", "E", "J"],
        ["root", "A", "B", "E", "K"],
        ["root", "A", "B", "E", "K"],
        ["root", "A", "B", "E", "K"],
        ["root", "A", "B", "E", "K"],
      ],
      [
        ["root", "A", "B"],
        ["root", "A", "B"],
        ["root", "A", "B"],
        ["root", "A", "B"],
        ["root", "A", "B"],
        ["root", "A", "B"],
        ["root", "A", "B"],
        ["root", "A", "B"],
      ],
      [
        ["root", "A", "B"],
        ["root", "A", "B"],
        ["root", "A", "B"],
        ["root", "A", "B"],
        ["root", "A", "B"],
        ["root", "A", "B"],
        ["root", "A", "B"],
        ["root", "A", "B"],
      ],
      [
        ["root", "A"],
        ["root", "A"],
        ["root", "A"],
        ["root", "A"],
        ["root", "A"],
        ["root", "A"],
        ["root", "A"],
        ["root", "A"],
      ],
      [
        ["root", "A"],
        ["root", "A"],
        ["root", "A"],
        ["root", "A"],
        ["root", "A"],
        ["root", "A"],
        ["root", "A"],
        ["root", "A"],
      ],
      [
        ["root"],
        ["root"],
        ["root"],
        ["root"],
        ["root"],
        ["root"],
        ["root"],
        ["root"],
      ],
    ]);
  });

  test("color matrix", () => {
    const data = {
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

    const lc = new LifeCycleDiagram({
      maxLine: 5,
      colorMap: {
        A: "rgb(100, 100, 100)",
        B: "rgb(200, 200, 200)",
        C: "rgb(0, 0,0)",
        D: "rgb(50, 50, 50)",
      },
    });
    const { colorMat } = lc.generate(data);
    expect(colorMat).toStrictEqual([
      ["rgb(100, 100, 100)", "rgb(100, 100, 100)"],
      ["rgb(150, 150, 150)", "rgb(50, 50, 50)"],
      ["rgb(75, 75, 75)", "rgb(75, 75, 75)"],
      ["rgb(100, 100, 100)", "rgb(100, 100, 100)"],
      ["rgb(100, 100, 100)", "rgb(100, 100, 100)"],
    ]);
  });
});
