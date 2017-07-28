////////////////////////////////////////////////////////////
//////////////////////// Set-up ////////////////////////////
////////////////////////////////////////////////////////////

//Chart variables
var startYear,
	years, //save height per year
	rectWidth,
	rectHeight,
	rectCorner,
	currentId = 6,
	chosenYear = currentId,
	chosenYearOld = currentId,
	optArray, //for search box
	inSearch = false, //is the search box being used - for tooltip
	selectedTitle, //for search box and highlighting
	updateDots; //function needed in global
	
//Width and Height of the SVG
var	wind = window,
	d = document,
	e = d.documentElement,
	g = d.getElementsByTagName('body')[0],
	maxWidth = 1124, //Maximum width of the chart, regardless of screen size
	maxHeight = 1470, //Maximum height of the chart, regardless of screen size
	w = Math.min(maxWidth, wind.innerWidth || e.clientWidth || g.clientWidth),
	h = Math.min(maxHeight, wind.innerHeight|| e.clientHeight|| g.clientHeight);

//Offsets needed to properly position elements
var xOffset = Math.max(0, ((wind.innerWidth || e.clientWidth || g.clientWidth)-maxWidth)/2),
	yOffset = Math.max(0, ((wind.innerHeight|| e.clientHeight|| g.clientHeight)-maxHeight)/2)

//Find the offsets due to other divs
var offsets = document.getElementById('chart').getBoundingClientRect();
	
//SVG locations
var margin = {top: 427, right: 73, bottom: 49, left: 70},
	padding = 35,
    width = w - margin.left - margin.right - padding,
    height = h - margin.top - margin.bottom - padding - offsets.top;

////////////////////////////////////////////////////////////
////////////////// Reposition elements /////////////////////
////////////////////////////////////////////////////////////

//Change note location
d3.select("#note")
	.style("top", (height + margin.top + margin.bottom + 40)+"px")
	.style("left", (xOffset + 20)+"px");
	
//Change intro location
d3.select("#intro")
	.style("left", (xOffset + 20)+"px");

//Change search box
// var searchWidth = Math.min(300,width/2);
// d3.select("#searchBoxWrapper")
// 	.style("left", (width/2 + xOffset + padding + margin.left - searchWidth/2)+"px")
// 	.style("width", searchWidth+"px");
	
//If the user us using a handheld, do not show the slider
var sliderWidth = 350;
if (handheld == false) {
	//Initiate slider
	d3.select('#slider')
		.style("left", (width/2 + xOffset + padding + margin.left - sliderWidth/2)+"px")
		.style("top", "120px")
		.style("width", sliderWidth+"px")
		.call(d3.slider().axis(d3.svg.axis().ticks(8).tickFormat(d3.format("d")))
				.min(0).max(currentId).step(1).value(currentId)
				.on("slide", function(evt, value) {
					//reset search
					inSearch = false;
					//Show new rectangles
					chosenYear = value;
					updateDots(chosenYear)
				}));
				
	//If the user clicks anywhere while in search mode, remove the search
	d3.select("body").on("click", function() { 
		if(inSearch) {
			inSearch = false;
			searchArtist("");
		}		
	});
} else {
	var handheldText = d3.select("#slider")
		  .style("left", (width/2 + xOffset + padding + margin.left - sliderWidth/2)+"px") 
		  .style("width", sliderWidth+"px")
		  .append('text')                                     
		  .attr("text-align", "center")
		   
}//else
	
//////////////////////////////////////////////////////
///////////// Initialize Axes & Scales ///////////////
//////////////////////////////////////////////////////
	
var x = d3.scale.linear()
        .range([0, width]);

var y = d3.scale.linear()
    .range([height, -250]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
	.tickFormat(d3.format("d"));
	
//Create colors
var hexLocation = [
	{color:"#007F24", text: "1 - 49", position: d3.range(1,50)},
	{color:"#62BF18", text: "50 - 99", position: d3.range(50,100)},
	{color:"#FFC800", text: "100 - 499", position: d3.range(100,500)},
	{color:"#FF5B13", text: "500 - 999", position: d3.range(500,1000)},
	{color:"#E50000", text: "1000 - 2000", position: d3.range(1000,2000)}
];
var hexKey = [];
hexLocation.forEach(function(d,i) {
	hexKey[d.color] = i;
})
	
var color = d3.scale.linear()
	.domain([1,50,100,500,1000,2000])
	.range(hexLocation.map(function(d) { return d.color; }));

////////////////////////////////////////////////////////////	
///////////////////// Initiate SVG /////////////////////////
////////////////////////////////////////////////////////////
	
//Initiate outer chart SVG
var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
//Container for all the rectangles
var dotContainer = svg.append("g").attr("class","dotContainer");
	
	switch(chosenYear){
		case 6:
		var yearTitle = svg.append('text')                                     
	  .attr('x', width/3) 
	  .attr('y', -350)	  
	  .attr("class", "yearTitle")
	 .text("keypad-based/mid-size smartphones"); 
	 break;
       case 5:
       var yearTitle = svg.append('text')                                     
	  .attr('x', width/3) 
	  .attr('y', -350)	  
	  .attr("class", "yearTitle")
	 .text("high-performance smartphones"); 
       break;
       case 4:
       var yearTitle = svg.append('text')                                     
	  .attr('x', width/3) 
	  .attr('y', -350)	  
	  .attr("class", "yearTitle")
	 .text("high-performance tablets"); 
       break;
       case 3:
       var yearTitle = svg.append('text')                                     
	  .attr('x', width/3) 
	  .attr('y', -350)	  
	  .attr("class", "yearTitle")
	 .text("PDAs and early-stage tablets"); 
       break;
       case 2:
       var yearTitle = svg.append('text')                                     
	  .attr('x', width/3) 
	  .attr('y', -350)	  
	  .attr("class", "yearTitle")
	 .text("wide-screen smartphones"); 
       break;
       case 1:
       var yearTitle = svg.append('text')                                     
	  .attr('x', width/3) 
	  .attr('y', -350)	  
	  .attr("class", "yearTitle")
	 .text("mid-performance smartphones"); 
       break;
       case 0:
       var yearTitle = svg.append('text')                                     
	  .attr('x', width/3) 
	  .attr('y', -350)	  
	  .attr("class", "yearTitle")
	 .text("feature phones/early- stage smartphones"); 
       break;
  }
//window.alert(chosenYear);
////////////////////////////////////////////////////////////	
///////////////////// Read in data /////////////////////////
////////////////////////////////////////////////////////////

d3.csv("data/"+fileName, function(error, data) {

	//Convert to numeric values
	//data.forEach(function(d) {
	for(var i = 0; i < data.length; i++) { //Faster?
		data[i].title = "" + data[i].title;
		data[i].yearr = +data[i].yearr;
		
		
	}//for i
	//});

	//Check for data errors
	// data.forEach(function (d,i) {
	// 	if (isNaN(d.release)) console.log(d);
	// })

	//Crossfilter
	var cf = crossfilter(data);
	// Create a dimension by political party
    var cfYear = cf.dimension(function(d) { return +d.id; });
		
	//Calculate domains of chart
	startYear = d3.min(data, function(d) { return d.yearr; });
	x.domain([startYear-0.5,d3.max(data, function(d) { return d.yearr; })+0.5]);//.nice();
	y.domain([0,240]).nice();
	
	//Keeps track of the height of each year
	years = d3.range(d3.min(x.domain()),d3.max(x.domain()))
		.map(function(d,i) {
		  return {
			id: d,
			number: 1
		  };
		});

	//Size of the "song" rectangles
	rectWidth = Math.floor(x.range()[1]/100);
	rectHeight = Math.min(3,Math.floor(y.range()[0]/100));
	rectCorner = rectHeight/2;



	//Create x axis
	svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis)
		.append("text")
		  .attr("class", "label")
		  .attr("x", width/2)
		  .attr("y", 40)
		  .style("text-anchor", "middle")
		  .text("Year of Release")
		  .style("font-size","15px");

	//Create y axis
	svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)
		.append("text")
		  .attr("class", "label")
		  .attr("transform", "rotate(-90)")
		  .attr("x", 270)
		  .attr("y", 10)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text("Amount of devices")
		  .style("font-size","15px");
	
	//Create the legend
	createLegend();

	//Change the market when moving the slider
	updateDots = function (chosenYear) {
		
		//Filter the chosen year from the total dataset
		var yearData = cfYear.filterExact(+chosenYear);

		//Update the search box with only the names available in the chosen year
		//updateSearchbox(yearData.top(Infinity));
		
		//Reset the heights
		years.forEach(function(value, index) {
			years[index].number = 1;
		});
	
		//DATA JOIN
		//Join new data with old elements, if any.
		var dots = dotContainer.selectAll(".dot")
					.data(yearData
							.top(Infinity)
							.sort(function(a, b) {return a.position - b.position}) 
							, function(d) { return d.position; });
		
		//ENTER
		dots.enter().append("rect")
			  .attr("class", "dot")
			  .attr("width", rectWidth)
			  .attr("height", rectHeight)
			  .attr("rx", rectCorner)
			  .attr("ry", rectCorner)
			  .style("fill", function(d) { return color(d.position); })
			  .on("mouseover", showTooltip)
			  .on("mouseout", hideTooltip)
			  .attr("x", function(d) { return (x(d.yearr) - rectWidth/2); })
			  .attr("y", function(d) {return y(0);})
			  .style("opacity",0);

		//EXIT
		dots.exit()
			.transition().duration(500)
			.attr("y", function(d) { return y(0); })
			.style("opacity",0)
			.remove();
			
		//UPDATE
		//First drop all rects to the zero y-axis and make them invisible
		//Then set them all to the correct new release year (x-axis)
		//Then let them grow to the right y locations again and make the visible
		dots
			.transition().duration(500)
			.attr("y", function(d) { return y(0); })
			.style("opacity",0)
			.call(endall, function() {
				dots
					.attr("x", function(d) { return (x(d.yearr) - rectWidth/2); })
					.attr("y", function(d) { return locateY(d); })
					.transition().duration(10).delay(function(d,i) { return i/2; })
					.style("opacity",1);
			});
			
		//Change year title
		switch(chosenYear){
			case 6:
			yearTitle.text("keypad-based/mid-size smartphones");
			break;
			case 5:
			yearTitle.text("high-performance smartphones");
            break;
            case 4:
            yearTitle.text("high-performance tablets");
            break;
            case 3:
            yearTitle.text("PDAs and early-stage tablets");
            break;
            case 2:
            yearTitle.text("wide-screen smartphones");
            break;
            case 1:
            yearTitle.text("mid-performance smartphones");
            break;
            case 0:
            yearTitle.text("feature phones/early- stage smartphones");
            break;
		}
		
		
		//Save the current year
		chosenYearOld = chosenYear;
		
	}//function updateDots
	
	//Call first time
	updateDots(chosenYear);
	
});
