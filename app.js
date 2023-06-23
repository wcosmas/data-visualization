handleImport('jinja');

function handleImport(district) {
  d3.csv(`./data/${district}.csv`).then(function (districtData, err) {
    if (err) throw err;

    console.log('Data: ', districtData);
    const hardnessData = districtData.map((obj) => ({
      source: obj['Source Name'],
      hardness: parseFloat(obj['Total hardness ']),
    }));

    const phData = districtData.map((obj) => ({
      source: obj['Source Name'],
      ph: parseFloat(obj['pH ']),
    }));

    const electricityConductivityData = districtData.map((obj) => ({
      lab: obj['Lab Identifier Code'],
      electrical_conductivity: parseFloat(
        obj['Electrical Conductivity']
      ),
    }));
    console.log(
      'electricityConductivityData, ',
      electricityConductivityData
    );

    const scatterPlotData = districtData.map((obj) => ({
      x: parseFloat(obj['Total Alkalinity ']),
      y: parseFloat(obj['Calcium Hardardness ']),
    }));
    const areaPlotData = districtData.map((obj) => ({
      source: obj['Source Name'],
      value: parseFloat(obj['Total Alkalinity ']),
    }));

    const stackedBarData = districtData.map((obj) => ({
      source: obj['Source Name'],
      cloride: parseFloat(obj['Chloride ']),
      floride: parseFloat(obj['Flouride']),
      ammonium: parseFloat(obj['Ammonium-N ']),
      phosphates: parseFloat(obj['Phosphates-P ']),
      sodium: parseFloat(obj['Sodium ']),
      sulphate: parseFloat(obj['Sulphate ']),
    }));

    stackedDataKeys = [
      'cloride',
      'floride',
      'ammonium',
      'phosphates',
      'sodium',
      'sulphate',
    ];

    let maxHardness = 0;
    let maxpH = 0;

    for (let i = 0; i < districtData.length; i++) {
      const hardness = parseFloat(districtData[i]['Total hardness ']);
      const ph = parseFloat(districtData[i]['pH ']);

      if (hardness > maxHardness) {
        maxHardness = hardness;
      }

      if (ph > maxpH) {
        maxpH = ph;
      }
    }

    drawBarChart(hardnessData, maxHardness, district);
    drawLineChart(phData, maxpH, district);
    drawPieChart(electricityConductivityData, district);
    drawStackedBarChart(stackedBarData, stackedDataKeys);
    drawScatterPlot(scatterPlotData);
    drawAreaChart(areaPlotData);
  });
}

function handleChange(value) {
  removeSVG();
  handleImport(value);
}

function removeSVG() {
  const barSVG = document.querySelector('#svg-bar');
  if (barSVG != null) {
    barSVG.remove();
  }
  const lineSVG = document.querySelector('#svg-line');
  if (lineSVG != null) {
    lineSVG.remove();
  }
  const pieSVG = document.querySelector('#svg-pie');
  if (pieSVG != null) {
    pieSVG.remove();
  }

  for (let i = 1; i < 100; i++) {
    const stackedBar = document.getElementById('stacked-bar');
    const svgElement = stackedBar.querySelector(
      `svg:nth-child(${i})`
    );
    if (svgElement) {
      svgElement.style.display = 'none';
    }
  }
  for (let i = 1; i < 100; i++) {
    const scatterPlot = document.getElementById('scatter-plot');
    const svgElementScatterPlot = scatterPlot.querySelector(
      `svg:nth-child(${i})`
    );
    if (svgElementScatterPlot) {
      svgElementScatterPlot.style.display = 'none';
    }
  }
  for (let i = 1; i < 100; i++) {
    const areaChart = document.getElementById('area-chart');
    const svgElementAreaChart = areaChart.querySelector(
      `svg:nth-child(${i})`
    );
    if (svgElementAreaChart) {
      svgElementAreaChart.style.display = 'none';
    }
  }
}

const body = document.querySelector('body');

body.onresize = function () {
  const barSVG = document.querySelector('#svg-bar');
  if (barSVG != null) {
    barSVG.remove();
    drawBarChart();
  }
  const lineSVG = document.querySelector('#svg-line');
  if (lineSVG != null) {
    lineSVG.remove();
    drawBarChart();
  }
  const pieSVG = document.querySelector('#svg-pie');
  if (pieSVG != null) {
    pieSVG.remove();
  }
};

function drawBarChart(barData, maxHardness, district) {
  const area = document.querySelector('#bar');
  const margin = { y: 40, x: 60 },
    width = area.offsetWidth - 2 * margin.x,
    height = area.offsetHeight - 2 * margin.y;
  const svg = d3.select(area).append('svg');
  svg
    .attr('width', width + 2 * margin.x)
    .attr('height', height + 2 * margin.y)
    .attr('id', 'svg-bar');
  const chart = svg
    .append('g')
    .attr('transform', `translate(${margin.x},${margin.y})`);

  const yScale = d3
    .scaleLinear()
    .range([height, 0])
    .domain([0, maxHardness]);

  chart.append('g').attr('class', 'axis').call(d3.axisLeft(yScale));

  const xScale = d3
    .scaleBand()
    .range([0, width])
    .domain(barData.map((d) => d.source))
    .padding(0.2);

  chart
    .append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

  //Draw grid
  chart
    .append('g')
    .attr('class', 'grid-hline')
    .call(
      d3
        .axisLeft()
        .scale(yScale)
        .tickSize(-width, 0, 0)
        .tickFormat('')
    );
  //End Draw grid

  //Top Title
  svg
    .append('text')
    .attr('x', width / 2 + margin.x)
    .attr('y', margin.y / 2)
    .attr('class', 'title')
    .attr('text-anchor', 'middle')
    .text(
      `Bar chart showing the disrtibution of Total Hardness across water sources in ${district} district`
    );
  //End Top Title

  //x Axis Title
  svg
    .append('text')
    .attr('x', width / 2 + margin.x)
    .attr('y', margin.y * 2)
    .attr('transform', `translate(0,${height - margin.y / 4})`)
    .attr('class', 'title')
    .text('Source Name');
  //End x axis title

  //y Axis Title
  svg
    .append('text')
    .attr('class', 'title')
    .attr('x', -(height / 2) - margin.y)
    .attr('y', margin.x / 2.4)
    .attr('transform', 'rotate(-90)')
    .text('Total Hradness');
  //End y Axis Title

  chart
    .selectAll()
    .data(barData)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (d) => xScale(d.source))
    .attr('y', (d) => yScale(d.hardness))
    .attr('height', (d) => height - yScale(d.hardness))
    .attr('width', xScale.bandwidth())
    .on('mouseenter', function () {
      d3.select(this).attr('class', 'hover-bar');
    })
    .on('mouseleave', function () {
      d3.select(this).attr('class', 'bar');
    });
}

function drawLineChart(phData, maxpH, district) {
  let minpH = Infinity;

  phData.forEach((entry) => {
    if (entry.ph < minpH) {
      minpH = entry.ph;
    }
  });
  const area = document.querySelector('#line');
  const margin = { y: 40, x: 60 },
    width = area.offsetWidth - 2 * margin.x,
    height = area.offsetHeight - 2 * margin.y;
  const svg = d3.select(area).append('svg');
  svg
    .attr('width', width + 2 * margin.x)
    .attr('height', height + 2 * margin.y)
    .attr('id', 'svg-line');
  const chart = svg
    .append('g')
    .attr('transform', `translate(${margin.x},${margin.y})`);

  const yScale = d3
    .scaleLinear()
    .range([height, 0])
    .domain([minpH, maxpH]);

  chart.append('g').attr('class', 'axis').call(d3.axisLeft(yScale));

  const xScale = d3
    .scaleBand()
    .range([0, width])
    .domain(phData.map((d) => d.source))
    .padding(0.2);

  chart
    .append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

  //Draw grid
  chart
    .append('g')
    .attr('class', 'grid-hline')
    .call(
      d3
        .axisLeft()
        .scale(yScale)
        .tickSize(-width, 0, 0)
        .tickFormat('')
    );
  //End Draw grid

  //Top Title
  svg
    .append('text')
    .attr('x', width / 2 + margin.x)
    .attr('y', margin.y / 2)
    .attr('class', 'title')
    .attr('text-anchor', 'middle')
    .text(
      `Line Graph showing the disrtibution of pH across water sources in ${district} district`
    );
  //End Top Title

  //x Axis Title
  svg
    .append('text')
    .attr('x', width / 2 + margin.x)
    .attr('y', margin.y * 2)
    .attr('transform', `translate(0,${height - margin.y / 4})`)
    .attr('class', 'title')
    .text('Source Name');
  //End x axis title

  //y Axis Title
  svg
    .append('text')
    .attr('class', 'title')
    .attr('x', -(height / 2) - margin.y)
    .attr('y', margin.x / 2.4)
    .attr('transform', 'rotate(-90)')
    .text('pH');
  //End y Axis Title

  const line = d3
    .line()
    .x(function (d, i) {
      return xScale(d.source);
    })
    .y(function (d, i) {
      return yScale(d.ph);
    })
    .curve(d3.curveMonotoneX);

  chart
    .append('path')
    .datum(phData)
    .attr('class', 'line')
    .attr('d', line);
}

function drawPieChart(electricityConductivityData, district) {
  const good_datas = [];
  let total = 0;
  for (let i = 0; i < electricityConductivityData.length; i++) {
    total =
      +electricityConductivityData[i].electrical_conductivity +
      +total;
  }
  for (let i = 0; i < electricityConductivityData.length; i++) {
    good_datas.push({
      value:
        electricityConductivityData[i].electrical_conductivity /
        total,
      color: '#AA' + Math.ceil(Math.random() * 10000),
      title: electricityConductivityData[i].lab,
    });
  }

  const area = document.querySelector('#pie');
  const margin = { y: 40, x: 60 },
    width = area.offsetWidth - 2 * margin.x,
    height = area.offsetHeight - 2 * margin.y;
  const svg = d3.select(area).append('svg');
  svg
    .attr('width', width + 2 * margin.x)
    .attr('height', height + 2 * margin.y)
    .attr('id', 'svg-pie');
  const chart = svg
    .append('g')
    .attr(
      'transform',
      `translate(${(width + 2 * margin.x) / 4},${
        (height + 2 * margin.y) / 2
      })`
    );
  const legend = svg
    .append('g')
    .attr(
      'transform',
      `translate(${(width + 2 * margin.x) / 2},${margin.y})`
    );

  //Top Title
  svg
    .append('text')
    .attr('x', width / 2 + margin.x)
    .attr('y', margin.y / 2)
    .attr('class', 'title')
    .attr('text-anchor', 'middle')
    .text(
      `Pie Chart showing the disrtibution of Electrical Conductivity across Labs in ${district} district`
    );
  //End Top Title

  const radius = width < height ? width / 2 : height / 2;

  const arc = d3.arc().innerRadius(radius).outerRadius(0);

  const pie = d3.pie().value(function (d, i) {
    return d.value;
  });

  chart
    .selectAll('arc')
    .data(pie(good_datas))
    .enter()
    .append('path')
    .attr('d', arc)
    .style('fill', function (d, i) {
      return good_datas[i].color;
    });
  legend
    .selectAll('circle')
    .data(good_datas)
    .enter()
    .append('circle')
    .attr('r', 5)
    .attr('cx', 20)
    .attr('cy', function (d, i) {
      return i * 20;
    })
    .attr('fill', function (d, i) {
      return d.color;
    });
  legend
    .selectAll('text')
    .data(good_datas)
    .enter()
    .append('text')
    .attr('class', 'title')
    .attr('x', 50)
    .attr('y', function (d, i) {
      return 5 + i * 20;
    })
    .text(function (d, i) {
      return d.title;
    });
}

function drawStackedBarChart(stackedBarData, stackedDataKeys) {
  // Chart dimensions
  const area = document.querySelector('#stacked-bar');
  const margin = { top: 40, right: 20, bottom: 50, left: 50 };
  const width = area.offsetWidth - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Create SVG container
  const svg = d3
    .select('#stacked-bar')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Define the stack generator
  const stack = d3.stack().keys(stackedDataKeys);

  // Generate the stacked data
  const stackedData = stack(stackedBarData);
  console.log('stackedData: ', stackedData);

  // Define x and y scales
  const xScale = d3
    .scaleBand()
    .domain(stackedBarData.map((d) => d.source))
    .range([0, width])
    .padding(0.1);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(stackedData, (d) => d3.max(d, (d) => d[1]))])
    .range([height, 0]);

  // Define color scale
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Create groups for each stack
  const stacks = svg
    .selectAll('g')
    .data(stackedData)
    .enter()
    .append('g')
    .style('fill', (d, i) => color(i));

  // Draw the bars within each stack
  stacks
    .selectAll('rect')
    .data((d) => d)
    .enter()
    .append('rect')
    .attr('x', (d) => xScale(d.data.source))
    .attr('y', (d) => yScale(d[1]))
    .attr('height', (d) => yScale(d[0]) - yScale(d[1]))
    .attr('width', xScale.bandwidth());

  // Add x-axis
  svg
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

  // Add y-axis
  svg.append('g').attr('class', 'y-axis').call(d3.axisLeft(yScale));

  // Add x-axis label
  svg
    .append('text')
    .attr('class', 'x-axis-label')
    .attr('x', width / 2)
    .attr('y', height + margin.bottom - 10)
    .style('text-anchor', 'middle')
    .text('Source Name');

  // Add y-axis label
  svg
    .append('text')
    .attr('class', 'y-axis-label')
    .attr('x', -height / 2)
    .attr('y', -margin.left + 10)
    .attr('transform', 'rotate(-90)')
    .style('text-anchor', 'middle')
    .text('Chemical Composition');

  // Add title
  svg
    .append('text')
    .attr('class', 'chart-title')
    .attr('x', width / 2)
    .attr('y', -margin.top / 2)
    .style('text-anchor', 'middle')
    .text('Stacked Bar Chart');

  // Create a legend or scale for the stacks
  const legend = svg
    .append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(0, ${height + 20})`); // Adjust the positioning as needed

  const stackKeys = stack.keys(); // Get the stack keys

  // Create color rectangles for each stack
  legend
    .selectAll('.legend-item')
    .data(stackKeys)
    .enter()
    .append('rect')
    .attr('class', 'legend-item')
    .attr('x', (d, i) => i * 80) // Adjust the spacing between items
    .attr('y', 0)
    .attr('width', 10)
    .attr('height', 10)
    .style('fill', (d, i) => color(i));

  // Add labels for each stack
  legend
    .selectAll('.legend-label')
    .data(stackKeys)
    .enter()
    .append('text')
    .attr('class', 'legend-label')
    .attr('x', (d, i) => i * 80 + 15) // Adjust the spacing between items and the position of the text
    .attr('y', 9)
    .text((d) => d);
}

function drawScatterPlot(data) {
  // Set up the dimensions and margins of the graph
  const area = document.querySelector('#scatter-plot');
  const margin = { top: 40, right: 20, bottom: 50, left: 50 };
  const width = area.offsetWidth - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Append the SVG element to the scatterPlot div
  const svg = d3
    .select('#scatter-plot')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr(
      'transform',
      'translate(' + margin.left + ',' + margin.top + ')'
    );

  // Set up the scale for x-axis
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.x)])
    .range([0, width]);

  // Set up the scale for y-axis
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.y)])
    .range([height, 0]);

  // Add the x-axis
  svg
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(xScale));

  // Add the y-axis
  svg.append('g').call(d3.axisLeft(yScale));

  // Add x-axis label
  svg
    .append('text')
    .attr('class', 'axis-label')
    .attr('x', width / 2)
    .attr('y', height + margin.bottom - 10)
    .attr('text-anchor', 'middle')
    .text('Total Alkalinity');

  // Add y-axis label
  svg
    .append('text')
    .attr('class', 'axis-label')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', -margin.left + 20)
    .attr('text-anchor', 'middle')
    .text('Calcium Hardardness');

  // Add scatter plot dots
  svg
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d) => xScale(d.x))
    .attr('cy', (d) => yScale(d.y))
    .attr('r', 5)
    .attr('fill', 'steelblue');

  // Add title for the scatter plot
  svg
    .append('text')
    .attr('class', 'plot-title')
    .attr('x', width / 2)
    .attr('y', -margin.top / 2)
    .attr('text-anchor', 'middle')
    .text(
      'Scatter Plot showing the relationship between Total Alkalinity and Calcium Hardardness'
    );
}

function drawAreaChart(data) {
  // Set up dimensions and margins
  var area = document.querySelector('#area-chart');

  // Set up dimensions and margins
  var margin = { top: 20, right: 30, bottom: 30, left: 50 };
  var width = area.offsetWidth - margin.left - margin.right;
  var height = 400 - margin.top - margin.bottom;

  // Create SVG element
  var svg = d3
    .select('#area-chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr(
      'transform',
      'translate(' + margin.left + ',' + margin.top + ')'
    );

  // Set up scales
  var xScale = d3
    .scaleBand()
    .domain(
      data.map(function (d) {
        return d.source;
      })
    )
    .range([0, width])
    .padding(0.2);

  var yScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function (d) {
        return d.value;
      }),
    ])
    .range([height, 0]);

  // Define the area
  var area = d3
    .area()
    .x(function (d) {
      return xScale(d.source) + xScale.bandwidth() / 2;
    })
    .y0(height)
    .y1(function (d) {
      return yScale(d.value);
    });

  // Create the area path
  svg
    .append('path')
    .datum(data)
    .attr('class', 'area')
    .attr('d', area)
    .style('fill', '#5290E9');

  // Add the X axis
  svg
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(xScale));

  // Add the Y axis
  svg.append('g').call(d3.axisLeft(yScale));

  // Add title
  svg
    .append('text')
    .attr('x', width / 2)
    .attr('y', -5)
    .attr('text-anchor', 'middle')
    .style('font-size', '12px')
    .text(
      'Area Chart showing variation of toatal alkalinity across water sources'
    );

  // Add x-axis label
  svg
    .append('text')
    .attr('x', width / 2)
    .attr('y', height + margin.bottom)
    .attr('text-anchor', 'middle')
    .style('font-size', '12px')
    .text('Source Name');

  // Add y-axis label
  svg
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', 0 - height / 2)
    .attr('y', 0 - margin.left)
    .attr('dy', '1em')
    .style('font-size', '12px')
    .text('Total Alkalinity');
}
