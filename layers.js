//test
//test2
var root = "geoData/"
var files = [// "block.geojson",
 "cityCouncil.geojson",
  // "communityDistricts.geojson",
  "congressionalDistricts.geojson",
  "electionDistricts.geojson",
  // "fireCompanies.geojson",
 "policePrecincts.geojson",
  "stateAssemblyDistricts.geojson",
  "stateSenate.geojson",
 // "tracts.geojson",
 "zipcode.geojson",
"borough.geojson"]

var promises = []
//
 for(var i in files){
 	promises.push(d3.json(root+files[i]))
 }

Promise.all(promises)
    .then(function(data){ 
		ready(data)
    })

var colors = ["#8ca996",
// "#dbe627",
"#56c3ab",
"#76db3b",
"#92a571",
"#bcca41",
"#65ca84",
"#c7c36a",
"#72cf60",
"#6d8b36"]    
	var width = 900
	var height = 400    
	
	  
function ready(all) {
//	console.log(all)

	var padding = 30
	var center = d3.geoCentroid(all[0])
		console.log(center)
	var projection = d3.geoAlbers()
		.fitExtent([[padding,padding],[width-padding,height-padding]],all[0])
		//.center(center)
		//.scale(100000)
		//.rotate([-4,0])	
	    var path = d3.geoPath().projection(projection);
		
        //var bounds  = path.bounds(all[0]);
		// var offset  = [width - (bounds[0][0] + bounds[1][0])/2,
//                       height - (bounds[0][1] + bounds[1][1])/2];
// 	projection.translate(offset)
// //	projection.tilt(20)
	var data = {}
	for(var i in files){
		var key = files[i].replace(".geojson","")
		data[key]=all[i]
		var color = colors[i]
		drawOutline(i,key,all[i],projection,color) 
		//break
	}

	
  
};

function drawOutline(index,key,geo,projection,color){
	
	var svg = d3.select("body").append("div").attr("id",key)
	.style("position","absolute")
	.style("top",index*100+"px")
	.style("transform", "rotateX(70deg) rotate(10deg)")
	.style("z-index",100-index)//.style("background-color","black")
    .append("svg")
    .attr("width",width)
    .attr("height", height)
		
    var path = d3.geoPath().projection(projection);
      //
   // var max = d3.max(Object.keys(ems), function(d) { return ems[d].length; })
   // var min = d3.min(Object.keys(ems), function(d) { return ems[d].length; })

    // var c = d3.scaleLinear().domain([0,min,max]).range(["#ffffff","#dafff3","#00b25d"])
	
	svg.append("text").text(key).attr("x",width-20).attr("y",40).attr("fill",color).style("font-size","36px")
	.attr("text-anchor","end")
svg.append("g")
    .selectAll("path")
    .data(geo.features)
    .enter()
    .append("path")
      // draw each country
      .attr("d", d3.geoPath()
        .projection(projection)
      )
	  .attr("class","map")
      // set the color of each country
      .attr("fill", color)
	  .attr("fill-opacity",.9)
	  .attr("stroke","white")
	  .attr("stroke-opacity",1)
	  .attr("stroke-width",.5)
      .on("mouseover",function(event, d){
         })
      .on("mouseout",function(event, d){
     })   
}