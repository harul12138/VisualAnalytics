// Parallel Coordinates
// Copyright (c) 2012, Kai Chang
// Released under the BSD License: http://opensource.org/licenses/BSD-3-Clause

//from ryb.js
var Points, RYB, display, generateColors, numberColors, __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) {
    for(var key in parent) {
      if(__hasProp.call(parent, key)) child[key] = parent[key];
    }

    function ctor() {
      this.constructor = child;
    }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };

RYB = {
  white: [1, 1, 1],
  red: [1, 0, 0],
  yellow: [1, 1, 0],
  blue: [0.163, 0.373, 0.6],
  violet: [0.5, 0, 0.5],
  green: [0, 0.66, 0.2],
  orange: [1, 0.5, 0],
  black: [0.2, 0.094, 0.0],
  rgb: function(r, y, b) {
    var i, _i, _results;
    _results = [];
    for(i = _i = 0; _i <= 2; i = ++_i) {
      _results.push(RYB.white[i] * (1 - r) * (1 - b) * (1 - y) + RYB.red[i] * r * (1 - b) * (1 - y) + RYB.blue[i] * (1 - r) * b * (1 - y) + RYB.violet[i] * r * b * (1 - y) + RYB.yellow[i] * (1 - r) * (1 - b) * y + RYB.orange[i] * r * (1 - b) * y + RYB.green[i] * (1 - r) * b * y + RYB.black[i] * r * b * y);
    }
    return _results;
  }
};

Points = (function(_super) {

  __extends(Points, _super);

  Points.name = 'Points';

  function Points(number) {
    var base, n, _i, _ref;
    base = Math.ceil(Math.pow(number, 1 / 3));
    for(n = _i = 0, _ref = Math.pow(base, 3); 0 <= _ref ? _i < _ref : _i > _ref; n = 0 <= _ref ? ++_i : --_i) {
      this.push([Math.floor(n / (base * base)) / (base - 1), Math.floor(n / base % base) / (base - 1), Math.floor(n % base) / (base - 1)]);
    }
    this.picked = null;
    this.plength = 0;
  }

  Points.prototype.distance = function(p1) {
    var _this = this;
    return [0, 1, 2].map(function(i) {
      return Math.pow(p1[i] - _this.picked[i], 2);
    }).reduce(function(a, b) {
      return a + b;
    });
  };

  Points.prototype.pick = function() {
    var index, pick, _, _ref, _this = this;
    if(this.picked == null) {
      pick = this.picked = this.shift();
      this.plength = 1;
    } else {
      _ref = this.reduce(function(_arg, p2, i2) {
        var d1, d2, i1;
        i1 = _arg[0], d1 = _arg[1];
        d2 = _this.distance(p2);
        if(d1 < d2) {
          return [i2, d2];
        } else {
          return [i1, d1];
        }
      }, [0, this.distance(this[0])]), index = _ref[0], _ = _ref[1];
      pick = this.splice(index, 1)[0];
      this.picked = [0, 1, 2].map(function(i) {
        return(_this.plength * _this.picked[i] + pick[i]) / (_this.plength + 1);
      });
      this.plength++;
    }
    return pick;
  };

  return Points;

})(Array);


generateColors = function(numberColors) {
  var b, color, el, g, i, number, point, points, r, _i, _ref, _results;
  number = numberColors;
  points = new Points(number);
  point = null;
  _results = [];
  _results[0] = $.Color(302, 1, 0.6, 0.6).toHslaString();
  _results[1] = $.Color(255, 0.6, 0.6, 0.6).toHslaString();
  for(i = _i = 2; 1 <= number ? _i <= number : _i >= number; i = 1 <= number ? ++_i : --_i) {
    point = points.pick(point);
    _ref = RYB.rgb.apply(RYB, point).map(function(x) {
      return Math.floor(255 * x);
    }), r = _ref[0], g = _ref[1], b = _ref[2];
    color = $.Color(r, g, b, 0.6).toHslaString();
    _results[i] = color;
  }
  return _results;
};


var width = document.body.clientWidth,
  height = d3.max([document.body.clientHeight - 440, 500]);

var m = [60, 0, 10, 0],
  w = width - m[1] - m[3],
  h = height - m[0] - m[2],
  xscale = d3.scale.ordinal().rangePoints([0, w], 1),
  yscale = {},
  dragging = {},
  line = d3.svg.line(),
  axis = d3.svg.axis().orient("left").ticks(5, d3.format("s")),
  data, foreground, background, highlighted, dimensions, legend, render_speed = 50,
  brush_count = 0,
  excluded_groups = [];

//Set the total number of unique markers/colours
var countOfColors = 36;
var colorMap = [];

colorMap = generateColors(countOfColors);

var colors = {
  //NOT AN ACTUAL CATEOGRY, JUST FOR THE AVERAGE LINE
  "Average": colorMap[22],
  //USED FOR ANY MAPPING NOT DEFINED
  // "other": colorMap[1],

  // USER defined color mappings here:
  "0": colorMap[9],
  "1": colorMap[3],
  "2": colorMap[4],
  "3": colorMap[5],
  "4": colorMap[6],
  "5": colorMap[7],
  "6": colorMap[8],
  // "Estonia": colorMap[9],
  // "Finland": colorMap[10],
  // "France": colorMap[11],
  // "Germany": colorMap[12],
  // "Ireland": colorMap[13],
  // "Psion Siena": colorMap[14],
  // "Mexico": colorMap[15],
  // "New Zealand": colorMap[16],
  // "Norway": colorMap[17],
  // "Poland": colorMap[18],
  // "Spain": colorMap[19],
  // "Sweden": colorMap[20],
  // "Switzerland": colorMap[21],
  // "United Kingdom": colorMap[22],
  // "United States": colorMap[23],
  // "Greece": colorMap[24],
  // "Hungary": colorMap[25],
  // "Iceland": colorMap[26],
  // "Israel": colorMap[27],
  // "Italy": colorMap[28],
  // "Korea": colorMap[29],
  // "Luxembourg": colorMap[30],
  // "Netherlands": colorMap[31],
  // "Portugal": colorMap[32],
  // "Slovak Republic": colorMap[33],
  // "Slovenia": colorMap[34],
  // "Turkey": colorMap[35] 
};

// Scale chart and canvas height
d3.select("#chart").style("height", (h + m[0] + m[2]) + "px")

d3.selectAll("canvas").attr("width", w).attr("height", h).style("padding", m.join("px ") + "px");


// Foreground canvas for primary view
foreground = document.getElementById('foreground').getContext('2d');
foreground.globalCompositeOperation = "destination-over";
foreground.strokeStyle = "rgba(0,100,160,0.1)";
foreground.lineWidth = 1.7;
foreground.fillText("Loading data for rendering...", w / 2.2, h / 2);

// Highlight canvas for temporary interactions
highlighted = document.getElementById('highlight').getContext('2d');
highlighted.strokeStyle = "rgba(0,100,160,1)";
highlighted.lineWidth = 4;

// Background canvas
background = document.getElementById('background').getContext('2d');
background.strokeStyle = "rgba(0,100,160,0.1)";
background.lineWidth = 1.7;

// SVG for ticks, labels, and interactions
var svg = d3.select("svg").attr("width", w + m[1] + m[3]).attr("height", h + m[0] + m[2]).append("svg:g").attr("transform", "translate(" + m[3] + "," + m[0] + ")");

// Load the data and visualization
d3.csv("2012oecd.csv", function(raw_data) {
  // Convert quantitative scales to floats
  data = [];
  for(i = 0; i < raw_data.length; i++) {
    d = raw_data[i];
    for(var k in d) {
      //exclude name and idcolumn
      if(!_.isNaN(raw_data[0][k] - 0) && k != 'id' && k != 'Country') {
        d[k] = parseFloat(d[k]) || 0;
      }
    };
    show_ticks();
    data[i] = d;
  };

  // Extract the list of numerical dimensions and create a scale for each.
  xscale.domain(dimensions = d3.keys(data[0]).filter(function(k) {

    if(k == "Est. Downloads*" || k == "Reviews") {
      return(_.isNumber(data[0][k])) && (yscale[k] = d3.scale.log().domain(d3.extent(data, function(d) {
        return +d[k];
      })).range([h, 0]));
    }
    return(_.isNumber(data[0][k])) && (yscale[k] = d3.scale.linear().domain(d3.extent(data, function(d) {
      return +d[k];
    })).range([h, 0]));
  }));

  // Add a group element for each dimension.
  var g = svg.selectAll(".dimension").data(dimensions).enter().append("svg:g").attr("class", "dimension").attr("transform", function(d) {
    return "translate(" + xscale(d) + ")";
  })

  // Add an axis and title.
  each = g.append("svg:g").attr("class", "axis").attr("transform", "translate(0,0)").each(function(d) {
    d3.select(this).call(axis.scale(yscale[d]));
  })

  each.append("svg:text").attr("text-anchor", "middle").attr("y", -20).attr("transform", "rotate(0) translate(-6,-8)").attr("x", 3).attr("class", "label").text(String)
  each.append("svg:text").attr("id", function(d) {
    return "column-" + dimensions.indexOf(d)
  }).attr("text-anchor", "middle").attr("y", -4).attr("x", 3).attr("transform", "rotate(0) translate(-6,-8)").attr("class", "label-average")

  // Add and store a brush for each axis.
  g.append("svg:g").attr("class", "brush").each(function(d) {
    d3.select(this).call(yscale[d].brush = d3.svg.brush().y(yscale[d]).on("brush", brush));
  }).selectAll("rect").style("visibility", null).attr("x", -15).attr("width", 30).append("title").text("Drag up or down to brush along this axis");

  g.selectAll(".extent").append("title").text("Drag or resize this filter");


  legend = create_legend(colors, brush);

  // Render full foreground
  brush();

});

// copy one canvas to another, grayscale

function gray_copy(source, target) {
  var pixels = source.getImageData(0, 0, w, h);
  target.putImageData(grayscale(pixels), 0, 0);
}

// http://www.html5rocks.com/en/tutorials/canvas/imagefilters/

function grayscale(pixels, args) {
  var d = pixels.data;
  for(var i = 0; i < d.length; i += 4) {
    var r = d[i];
    var g = d[i + 1];
    var b = d[i + 2];
    // CIE luminance for the RGB
    // The human eye is bad at seeing red and blue, so we de-emphasize them.
    var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    d[i] = d[i + 1] = d[i + 2] = v
  }
  return pixels;
};

function create_legend(colors, brush) {
  // create legend
  var legend_data = d3.select("#legend").html("").selectAll(".row").data(_.difference(_.keys(colors), ["Average"]).sort())

  // filter by group
  var legend = legend_data.enter().append("div").attr("title", "Hide group").on("click", function(d) {
    // toggle category
    if(_.contains(excluded_groups, d)) {
      excluded_groups = _.difference(excluded_groups, [d]);
      brush();
    } else {
      excluded_groups.push(d);
      brush();
    }
  });

  legend.append("span").style("background", function(d, i) {
    return color(d, 0.85)
  }).attr("class", "color-bar");

  legend.append("span").attr("class", "tally").text(function(d, i) {
    return 0
  });

  legend.append("span").text(function(d, i) {
    return " devices --- Cluster "+d
  });

  return legend;
}

// render polylines i to i+render_speed 

function render_range(selection, i, max, opacity) {
  range = selection.slice(i, max)
  for(i = 0; i < range.length; i++) {
    d = range[i]
    path(d, foreground, color(d.id, opacity));
  }
};

// simple data table

function data_table(sample) {
  // sort by first column
  var sample = sample.sort(function(a, b) {
    var col = d3.keys(a)[0];
    return a[col] < b[col] ? -1 : 1;
  });

  var table = d3.select("#category-list").html("").selectAll(".row").data(sample).enter().append("div").attr("class", "data-row").on("mouseover", highlight).on("mouseout", unhighlight);

  table.append("span").attr("class", "color-block").style("background", function(d) {
    return color(d.id, 0.85)
  })

  table.append("span").text(function(d) {
    return d.Country;
  })
}

// Adjusts rendering speed 

function optimize(timer) {
  var delta = (new Date()).getTime() - timer;
  render_speed = Math.max(Math.ceil(render_speed * 40 / delta), 15);
  render_speed = Math.min(render_speed, 400);
  return(new Date()).getTime();
}

// Feedback on rendering progress

function render_stats(i, n, render_speed) {
  d3.select("#rendered-count").text(i);
  d3.select("#rendered-bar").style("width", (100 * i / n) + "%");
  d3.select("#render-speed").text(render_speed);
}

// Feedback on selection

function selection_stats(opacity, n, total) {
  d3.select("#data-count").text(total);
  d3.select("#selected-count").text(n);
  d3.select("#selected-bar").style("width", (100 * n / total) + "%");
  d3.select("#opacity").text(("" + (opacity * 100)).slice(0, 4) + "%");
}

// Highlight single polyline

function highlight(d) {
  d3.select("#foreground").style("opacity", "0.25");
  d3.selectAll(".row").style("font-weight", function(p) {
    return(d.Country == p) ? "bold" : null
  }).style("opacity", function(p) {
    return(d.Country == p) ? null : "0.3"
  });
  path(d, highlighted, color(d.Country, 1));
}

// Remove highlight

function unhighlight() {
  d3.select("#foreground").style("opacity", null);
  d3.selectAll(".row").style("font-weight", null).style("opacity", null);
  highlighted.clearRect(0, 0, w, h);
}

// Draw a single polyline

function path(d, ctx, color) {
  if(color) ctx.strokeStyle = color;
  var x = xscale(0) - 15;
  y = yscale[dimensions[0]](d[dimensions[0]]); // left edge
  x_orig = -1
  ctx.beginPath();
  for(i = 0; i < dimensions.length; i++) {
    p = dimensions[i];
    x = xscale(p), y = yscale[p](d[p]);

    if(x_orig != -1) {
      ctx.bezierCurveTo(x_orig + 65, y_orig, x - 65, y, x, y);
    } else {
      ctx.moveTo(x, y);
    }
    x_orig = x
    y_orig = y
  };
  ctx.stroke();
}

function color(d, a) {


  var c = colors[d];

  return  $.Color(c).alpha(a).toHslaString();
}

function position(d) {
  var v = dragging[d];
  return v == null ? xscale(d) : v;
}

// Handles a brush event, toggling the display of foreground lines.

function brush() {
  brush_count++;
  var actives = dimensions.filter(function(p) {
    return !yscale[p].brush.empty();
  }),

    extents = new Array(actives.length);
  for(i = 0; i < extents.length; i++) {
    extents[i] = yscale[actives[i]].brush.extent()
  }

  // hack to hide ticks beyond extent
  var b = d3.selectAll('.dimension')[0];
  for(i = 0; i < b.length; i++) {
    element = b[i];
    var dimension = d3.select(element).data()[0];
    d3.select(element).selectAll('text').style('font-size', null).style('font-weight', null).style('display', null);
    d3.select(element).selectAll('.label').style('display', null);
  };

  // bold dimensions with label
  d3.selectAll('.label').style("font-weight", function(dimension) {
    if(_.include(actives, dimension)) return "bold";
    return null;
  });

  // Get lines within extents
  var selected = [];
  filtered_data = data.filter(function(d) {
    return !_.contains(excluded_groups, d.id);
  })
  for(i = 0; i < filtered_data.length; i++) {
    d = filtered_data[i];
    actives.every(function(p, dimension) {
      return extents[dimension][0] <= d[p] && d[p] <= extents[dimension][1];
    }) ? selected.push(d) : null;
  }
  averageLine = {};
  var formatter = d3.format("0.3s")
  var currencyFormatter = d3.format(",.2f")
  _.each(dimensions, function(d, i) {
    average = _.reduce(selected, function(memo, num) {
      return memo + num[d];
    }, 0) / selected.length
    averageLine[d] = average
    displayedAverage = average
    if(d == "Price") {
      d3.select("#column-" + i).text("$" + currencyFormatter(average))
    } else {
      d3.select("#column-" + i).text(formatter(average))
    }
  });
  window.averageLine = averageLine
  // free text search
  var query = d3.select("#search")[0][0].value;
  if(query.length > 0) {
    selected = search(selected, query);
  }

  // total by categories
  var tallies = _(selected).groupBy(function(d) {
    return d.id;
  })

  // include empty groups
  _(colors).each(function(v, k) {
    tallies[k] = tallies[k] || [];
  });

  legend.style("text-decoration", function(d) {
    return _.contains(excluded_groups, d) ? "line-through" : null;
  }).attr("class", function(d) {
    return(tallies[d].length > 0) ? "row" : "row off";
  });
  maximumLength = d3.max(_.map(tallies, function(d) {
    return d.length
  }));
  legend.selectAll(".color-bar").style("width", function(d) {
    return Math.ceil(300 * tallies[d].length / (maximumLength + 1)) + "px"
  });

  legend.selectAll(".tally").text(function(d, i) {
    return tallies[d].length
  });

  // Render selected lines
  paths(selected, foreground, brush_count, true);

  path(averageLine, foreground, color("Average", 1))
  show_ticks()
}

// render a set of polylines on a canvas

function paths(selected, ctx, count) {
  var n = selected.length,
    i = 0,
    opacity = d3.min([2 / Math.pow(n, 0.3), 1]),
    timer = (new Date()).getTime();

  selection_stats(opacity, n, data.length)

  shuffled_data = _.shuffle(selected);

  data_table(shuffled_data.slice(0, 2903));

  ctx.clearRect(0, 0, w + 1, h + 1);

  // render all lines until finished or a new brush event

  function animloop() {
    if(i >= n || count < brush_count) return true;
    var max = d3.min([i + render_speed, n]);
    render_range(shuffled_data, i, max, opacity);
    render_stats(max, n, render_speed);
    i = max;
    timer = optimize(timer); // adjusts render_speed
    path(averageLine, foreground, color("Average", 1))
  };

  d3.timer(animloop);
}

// transition ticks for reordering, rescaling and inverting

function update_ticks(d, extent) {
  // update brushes
  if(d) {
    var brush_el = d3.selectAll(".brush").filter(function(key) {
      return key == d;
    });
    // single tick
    if(extent) {
      // restore previous extent
      brush_el.call(yscale[d].brush = d3.svg.brush().y(yscale[d]).extent(extent).on("brush", brush));
    } else {
      brush_el.call(yscale[d].brush = d3.svg.brush().y(yscale[d]).on("brush", brush));
    }
  } else {
    // all ticks
    d3.selectAll(".brush").each(function(d) {
      d3.select(this).call(yscale[d].brush = d3.svg.brush().y(yscale[d]).on("brush", brush));
    })
  }

  brush_count++;

  // update axes
  d3.selectAll(".axis").each(function(d, i) {

    // transition axis numbers
    d3.select(this).transition().duration(720).call(axis.scale(yscale[d]));

    // bring lines back
    d3.select(this).selectAll('line').transition().delay(800).style("display", null);

    d3.select(this).selectAll('text').style('font-weight', null).style('font-size', null).style('display', null);
  });
}

// Rescale to new dataset domain

function rescale() {

  // Render selected data
  averageLine = {};
  _.each(dimensions, function(d, i) {
    average = _.reduce(selected, function(memo, num) {
      return memo + num[d];
    }, 0) / selected.length
    averageLine[d] = average
  });
  paths(data, foreground, brush_count);

  path(averageLine, foreground, color("Average", 1))

  update_ticks();
}

// Get polylines within extents

function actives() {
  var actives = dimensions.filter(function(p) {
    return !yscale[p].brush.empty();
  }),
    extents = new Array(actives.length);
  for(i = 0; i < extents.length; i++) {
    extents[i] = yscale[actives[i]].brush.extent()
  }
  // filter extents and excluded groups
  var selected = [];
  data.filter(function(d) {
    return !_.contains(excluded_groups, d.id);
  })
  for(i = 0; i < data.length; i++) {
    d = data[i]
    actives.every(function(p, i) {
      return extents[i][0] <= d[p] && d[p] <= extents[i][1];
    }) ? selected.push(d) : null;
  }

  // free text search
  var query = d3.select("#search")[0][0].value;
  if(query > 0) {
    selected = search(selected, query);
  }

  return selected;
}

// scale to window size
window.onresize = function() {
  width = document.body.clientWidth, height = d3.max([document.body.clientHeight - 500, 500]);

  w = width - m[1] - m[3], h = height - m[0] - m[2];

  d3.select("#chart").style("height", (h + m[0] + m[2]) + "px")

  d3.selectAll("canvas").attr("width", w).attr("height", h).style("padding", m.join("px ") + "px");

  d3.select("svg").attr("width", w + m[1] + m[3]).attr("height", h + m[0] + m[2]).select("g").attr("transform", "translate(" + m[3] + "," + m[0] + ")");

  xscale = d3.scale.ordinal().rangePoints([0, w], 1).domain(dimensions);
  dimensions.forEach(function(d) {
    yscale[d].range([h, 0]);
  });

  d3.selectAll(".dimension").attr("transform", function(d) {
    return "translate(" + xscale(d) + ")";
  })
  // update brush placement
  d3.selectAll(".brush").each(function(d) {
    d3.select(this).call(yscale[d].brush = d3.svg.brush().y(yscale[d]).on("brush", brush));
  })
  brush_count++;

  // update axis placement
  axis = axis.ticks(1 + height / 50), d3.selectAll(".axis").each(function(d) {
    d3.select(this).call(axis.scale(yscale[d]).ticks(5, d3.format("s")));
  });

  // render data
  brush();
  path(averageLine, foreground, color("Average", 1))

};

function remove_axis(d, g) {
  dimensions = _.difference(dimensions, [d]);
  xscale.domain(dimensions);
  g.attr("transform", function(p) {
    return "translate(" + position(p) + ")";
  });
  g.filter(function(p) {
    return p == d;
  }).remove();
  update_ticks();
}

d3.select("#search").on("keyup", brush);

d3.select("#dark-theme").on("click", dark_theme);
d3.select("#light-theme").on("click", light_theme);
d3.select("#remove-filters").on("click", resetFilters);
d3.select("#unselect-all").on("click", unselectAll);
d3.select("#select-all").on("click", selectAll);

function resetFilters() {
  update_ticks()
  brush();
}

function unselectAll() {
  excluded_groups = _.keys(colors);
  d3.selectAll("#select-all").attr("disabled", null);
  d3.selectAll("#unselect-all").attr("disabled", "disabled");
  brush();
}

function selectAll() {
  excluded_groups = [];
  d3.selectAll("#select-all").attr("disabled", "disabled");
  d3.selectAll("#unselect-all").attr("disabled", null);
  brush();
}

function show_ticks() {
  d3.selectAll(".axis g").style("display", "inline");
  //d3.selectAll(".axis path").style("display", null);
  d3.selectAll(".background").style("visibility", null);
};

function dark_theme() {
  d3.select("body").attr("class", "dark");
  d3.selectAll("#dark-theme").attr("disabled", "disabled");
  d3.selectAll("#light-theme").attr("disabled", null);
}

function light_theme() {
  d3.select("body").attr("class", null);
  d3.selectAll("#light-theme").attr("disabled", "disabled");
  d3.selectAll("#dark-theme").attr("disabled", null);
}

function search(selection, str) {
  pattern = new RegExp(str, "i");
  _.each(dimensions, function(d, i) {
    d3.select("#column-" + i).text(" ");
  });
  return _(selection).filter(function(d) {
    return pattern.exec(d.Country);
  });
}
