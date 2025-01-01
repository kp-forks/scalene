import { memory_consumed_str, time_consumed_str } from "./utils";

export const Lightning = "&#9889;"; // lightning bolt (for optimizing a line)
export const Explosion = "&#128165;"; // explosion (for optimizing a region)
export const WhiteLightning = `<span style="opacity:0">${Lightning}</span>`; // invisible but same width as lightning bolt
export const WhiteExplosion = `<span style="opacity:0">${Explosion}</span>`; // invisible but same width as lightning bolt
export const RightTriangle = "&#9658"; // right-facing triangle symbol (collapsed view)
export const DownTriangle = "&#9660"; // downward-facing triangle symbol (expanded view)


function makeTooltip(title, value) {
  // Tooltip for time bars, below
  let secs = (value / 100) * globalThis.profile.elapsed_time_sec;
  return (
    `(${title}) ` +
    value.toFixed(1) +
    "%" +
    " [" +
    time_consumed_str(secs * 1e3) +
    "]"
  );
}

export function makeBar(python, native, system, params) {
  // Make a time bar
  const widthThreshold1 = 20;
  const widthThreshold2 = 10;
  // console.log(`makeBar ${python} ${native} ${system}`);
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    config: {
      view: {
        stroke: "transparent",
      },
    },
    autosize: {
      contains: "padding",
    },
    width: params.width,
    height: params.height,
    padding: 0,
    data: {
      values: [
        {
          x: 0,
          y: python.toFixed(1),
          c: makeTooltip("Python", python),
          d:
            python >= widthThreshold1
              ? python.toFixed(0) + "%"
              : python >= widthThreshold2
                ? python.toFixed(0)
                : "",
          q: python / 2,
        },
        {
          x: 0,
          y: native.toFixed(1),
          c: makeTooltip("native", native),
          d:
            native >= widthThreshold1
              ? native.toFixed(0) + "%"
              : native >= widthThreshold2
                ? native.toFixed(0)
                : "",
          q: python + native / 2,
        },
        {
          x: 0,
          y: system.toFixed(1),
          c: makeTooltip("system", system),
          d:
            system >= widthThreshold1
              ? system.toFixed(0) + "%"
              : system >= widthThreshold2
                ? system.toFixed(0)
                : "",
          q: python + native + system / 2,
        },
      ],
    },
    layer: [
      {
        mark: { type: "bar" },
        encoding: {
          x: {
            aggregate: "sum",
            field: "y",
            axis: false,
            stack: "zero",
            scale: { domain: [0, 100] },
          },
          color: {
            field: "c",
            type: "nominal",
            legend: false,
            scale: { range: ["darkblue", "#6495ED", "blue"] },
          },
          tooltip: [{ field: "c", type: "nominal", title: "time" }],
        },
      },
      {
        mark: {
          type: "text",
          align: "center",
          baseline: "middle",
          dx: 0,
        },
        encoding: {
          x: {
            aggregate: "sum",
            field: "q",
            axis: false,
          },
          text: { field: "d" },
          color: { value: "white" },
          tooltip: [{ field: "c", type: "nominal", title: "time" }],
        },
      },
    ],
  };
}

export function makeGPUPie(util, gpu_device, params) {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    config: {
      view: {
        stroke: "transparent",
      },
    },
    autosize: {
      contains: "padding",
    },
    width: params.width, // 30,
    height: params.height, // 20,
    padding: 0,
    data: {
      values: [
        {
          category: 1,
          value: util.toFixed(1),
          c: "in use: " + util.toFixed(1) + "%",
        },
      ],
    },
    mark: "arc",
    encoding: {
      theta: {
        field: "value",
        type: "quantitative",
        scale: { domain: [0, 100] },
      },
      color: {
        field: "c",
        type: "nominal",
        legend: false,
        scale: { range: ["goldenrod", "#f4e6c2"] },
      },
      tooltip: [{ field: "c", type: "nominal", title: gpu_device }],
    },
  };
}

export function makeGPUBar(util, gpu_device, params) {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    config: {
      view: {
        stroke: "transparent",
      },
    },
    autosize: {
      contains: "padding",
    },
    width: params.width,
    height: params.height,
    padding: 0,
    data: {
      values: [
        {
          x: 0,
          y: util.toFixed(0),
          q: (util / 2).toFixed(0),
          d: util >= 20 ? util.toFixed(0) + "%" : "",
          dd: "in use: " + util.toFixed(0) + "%",
        },
      ],
    },
    layer: [
      {
        mark: { type: "bar" },
        encoding: {
          x: {
            aggregate: "sum",
            field: "y",
            axis: false,
            scale: { domain: [0, 100] },
          },
          color: {
            field: "dd",
            type: "nominal",
            legend: false,
            scale: { range: ["goldenrod", "#f4e6c2"] },
          },
          tooltip: [{ field: "dd", type: "nominal", title: gpu_device + ":" }],
        },
      },
      {
        mark: {
          type: "text",
          align: "center",
          baseline: "middle",
          dx: 0,
        },
        encoding: {
          x: {
            aggregate: "sum",
            field: "q",
            axis: false,
          },
          text: { field: "d" },
          color: { value: "white" },
          tooltip: [{ field: "dd", type: "nominal", title: gpu_device + ":" }],
        },
      },
    ],
  };
}

export function makeMemoryPie(native_mem, python_mem, params) {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: params.width,
    height: 20,
    padding: 0,
    data: {
      values: [
        {
          category: 1,
          value: native_mem.toFixed(1),
          c: "native: " + native_mem.toFixed(1) + "%",
        },
        {
          category: 2,
          value: python_mem.toFixed(1),
          c: "Python: " + python_mem.toFixed(1) + "%",
        },
      ],
    },
    mark: "arc",
    encoding: {
      theta: {
        field: "value",
        type: "quantitative",
        scale: { domain: [0, 100] },
      },
      color: {
        field: "c",
        type: "nominal",
        legend: false,
        scale: { range: ["darkgreen", "#50C878"] },
      },
      tooltip: [{ field: "c", type: "nominal", title: "memory" }],
    },
  };
}

export function makeMemoryBar(
  memory,
  title,
  python_percent,
  total,
  color,
  params,
) {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    config: {
      view: {
        stroke: "transparent",
      },
    },
    autosize: {
      contains: "padding",
    },
    width: params.width,
    height: params.height,
    padding: 0,
    data: {
      values: [
        {
          x: 0,
          y: python_percent * memory,
          c: "(Python) " + memory_consumed_str(python_percent * memory),
          d:
            python_percent * memory > total * 0.2
              ? memory_consumed_str(python_percent * memory)
              : "",
          q: (python_percent * memory) / 2,
        },
        {
          x: 0,
          y: (1.0 - python_percent) * memory,
          c: "(native) " + memory_consumed_str((1.0 - python_percent) * memory),
          d:
            (1.0 - python_percent) * memory > total * 0.2
              ? memory_consumed_str((1.0 - python_percent) * memory)
              : "",
          q: python_percent * memory + ((1.0 - python_percent) * memory) / 2,
        },
      ],
    },
    layer: [
      {
        mark: { type: "bar" },
        encoding: {
          x: {
            aggregate: "sum",
            field: "y",
            axis: false,
            scale: { domain: [0, total] },
          },
          color: {
            field: "c",
            type: "nominal",
            legend: false,
            scale: { range: [color, "#50C878", "green"] },
          },
          // tooltip: [{ field: "c", type: "nominal", title: title }],
        },
      },
      {
        mark: {
          type: "text",
          align: "center",
          baseline: "middle",
          dx: 0,
        },
        encoding: {
          x: {
            aggregate: "sum",
            field: "q",
            axis: false,
          },
          text: { field: "d" },
          color: { value: "white" },
        },
      },
    ],
  };
}

export function makeSparkline(
  samples,
  max_x,
  max_y,
  leak_velocity = 0,
  params,
) {
  const values = samples.map((v) => {
    let leak_str = "";
    if (leak_velocity != 0) {
      leak_str = `; possible leak (${memory_consumed_str(leak_velocity)}/s)`;
    }
    return {
      x: v[0],
      y: v[1],
      y_text:
        memory_consumed_str(v[1]) +
        " (@ " +
        time_consumed_str(v[0] / 1e6) +
        ")" +
        leak_str,
    };
  });
  let leak_info = "";
  if (leak_velocity != 0) {
    leak_info = "possible leak";
    params.height -= 10; // FIXME should be actual height of font
  }

  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    data: { values: values },
    width: params.width,
    height: params.height,
    padding: 0,
    title: {
      text: leak_info,
      baseline: "line-bottom",
      color: "red",
      offset: 0,
      lineHeight: 10,
      orient: "bottom",
      fontStyle: "italic",
    },
    encoding: {
      x: {
        field: "x",
        type: "quantitative",
        title: "",
        axis: {
          tickCount: 10,
          tickSize: 0,
          labelExpr: "",
        },
        scale: {
          domain: [0, max_x],
        },
      },
    },
    layer: [
      {
        encoding: {
          y: {
            field: "y",
            type: "quantitative",
            axis: null,
            scale: {
              domain: [0, max_y],
            },
          },
          color: {
            field: "c",
            type: "nominal",
            legend: null,
            scale: {
              range: ["darkgreen"],
            },
          },
        },

        layer: [
          { mark: "line" },
          {
            transform: [{ filter: { param: "hover", empty: false } }],
            mark: "point",
          },
        ],
      },

      {
        mark: "rule",
        encoding: {
          opacity: {
            condition: { value: 0.3, param: "hover", empty: false },
            value: 0,
          },
          tooltip: [{ field: "y_text", type: "nominal", title: "memory" }],
        },
        params: [
          {
            name: "hover",
            select: {
              type: "point",
              fields: ["y"],
              nearest: true,
              on: "mousemove",
            },
          },
        ],
      },
    ],
  };
}