
//"F_THEME1","F_THEME2", "F_THEME3", "F_THEME4"
var map;
var clicked = false
// var files = [// "block.geojson",
//  "cityCouncil.geojson",
//   "congressionalDistricts.geojson",
//   // "electionDistricts.geojson",
//  "policePrecincts.geojson",
//   "stateAssemblyDistricts.geojson",
//   "stateSenate.geojson",
//   "tracts.geojson",
//  "zipcode.geojson",
// "borough.geojson"
// ]
	
	var root = "geoData/"
	var layers = [
		//"borough",
		"zipcode",
		"policePrecincts",
		"congressionalDistricts",
		"stateAssemblyDistricts",
		"stateSenate",
		"tracts",
		"cityCouncil",
		"schoolDistricts"
	]
	var layerUniqueIds = {
		borough:"BoroName",
		zipcode:"ZIPCODE",
		policePrecincts:"Precinct",
		congressionalDistricts:"CongDist",
		stateAssemblyDistricts:"AssemDist",
		stateSenate:"StSenDist",
		tracts:"BoroCT2010",
		schoolDistricts:"SchoolDist",
		cityCouncil:"CounDist"
	}
	
	var promises = []
    for(var i in layers){
    	promises.push(d3.json(root+layers[i]+".geojson"))
    }	
var colors = ["#bb7051",
"#7b62cc",
"#78b642",
"#c163b9",
"#50b189",
"#d24c3c",
"#688dcd",
"#cd9c3f",
"#c85782",
"#73843b"] 
	
 Promise.all([d3.json("intersections.json")])
 .then(function(data){
	   var map = drawMap(data[0])
})
//
// 	var allFormattedData = {}
// 	for(var i in data){
// 		var layerName = layers[i]
// 	//	var formatted = formatData(data[i].features,layerName)
// 		//console.log(formatted)
// 		//allFormattedData[layerName]=formatted
// 		allFormattedData[layerName]=data[i]
// 	}
//     ready(allFormattedData)
//
// })
// function formatData(data,layerName){
// 	var dict = {}
// 	for(var i in data){
// 		var key = layerUniqueIds[layerName]
//  		var keyId = data[i].properties[key]
// 		dict[keyId]= data[i]
//
// 	}
// 	return dict
// }
// function ready(data){
     
	//}


function drawMap(intersections){
	console.log(intersections)
	console.log("map")
    d3.select("#map").style("width",window.innerWidth+"px")
          .style("height",window.innerHeight+"px")
    mapboxgl.accessToken = "pk.eyJ1IjoiampqaWlhMTIzIiwiYSI6ImNpbDQ0Z2s1OTN1N3R1eWtzNTVrd29lMDIifQ.gSWjNbBSpIFzDXU2X5YCiQ"
    map = new mapboxgl.Map({
         container: 'map',
        style:"mapbox://styles/jjjiia123/cko6gwof42j1617kqh2r706sd",//newest
         zoom: 11,
		center: [-73.93084002469617,40.69449906527412]
     });
	 
	 map.getCanvas().style.cursor = "unset";

	 var filters = {}
     
	 
     map.on("load",function(){
		 
		// var index = 0
	//      for(var i in data){
	// 		 var color = colors[index]
	// 		 index+=1
	//
	// 		 console.log(color)
	//   	   console.log(i)
	//   	   console.log(data[i])
	//
	//   	   map.addSource(i,{
	//   	             "type":"geojson",
	//   	             "data":data[i]
	//   	         })
	//
	//   			 map.addLayer({
	//   		            'id': i+"_hover",
	//   		            'type': 'fill',
	//   		            'source': i,
	//   		            'paint': {
	//   		            'fill-color': color,
	//   		                'fill-opacity':0.1,
	//   						"fill-opacity-transition": {
	//   						  "duration": 6000,
	//   							"delay": 0
	//   						}//,
	//   						//'fill-opacity':1
	//   		            }
	//   					//,
	//   		            // 'filter': ['==', '$type', 'Polygon']
	//   		        });
	//
	// 			 map.setPaintProperty(
	// 			 i,//+'_hover',
	// 			 'fill-opacity',
	// 			0
	// 			 );
	//
	//      }
		 
		//console.log(map.getStyle().layers)		 
      //  map.addControl(new mapboxgl.NavigationControl(),'bottom-right');
   // map.dragRotate.disable();
   
   
  
         // map.addLayer({
  //            'id': 'counties',
  //            'type': 'fill',
  //            'source': 'counties',
  //            'paint': {
  //            'fill-color': "white",
  //                'fill-opacity':0
  //            },
  //            'filter': ['==', '$type', 'Polygon']
  //        },"ST-OUTLINE");
  //
          // map.setFilter("county-name",["==","STATEFP",stateToNumber[pub.startState]])
    
    

    // map.on("mouseenter","statesenate-5lzxwd",function(c){
 //
 // 		var layerName = c.features[0].sourceLayer
 //
 // 		console.log(["statesenate-5lzxwd",c.features[0].properties])
 //
 // 		var id = c.features[0].properties.OBJECTID
 //
 // 		map.setFilter("statesenate-5lzxwd",["==","OBJECTID",id])
 //    })
	
	
		var displayText = ""
	 for(var i in layers){
 			//map.setFilter(layers[i]+"_hover",["==","",""])
		d3.select("#info").append("div").attr("id",layers[i])
		 .style("padding","5px")
		 .style("height","30px")
		 
		 d3.select("#"+layers[i]).append("div").attr("id",layers[i]+"_box")
		 .style("width","10px")
		 .style("height","10px")
		 .style("padding","4px")
		 .style("background-color",colors[i])
		 .style("display","inline-block")
		 .style("vertical-align","top")
		 
		 d3.select("#"+layers[i]).append("div").attr("id",layers[i]+"_text")
		 .style("display","inline-block")
		 .style("vertical-align","top")
		 .style("padding-left","4px")
		 .style("height","10px")
		 .html(layers[i])
		 .style("color",colors[i])
		 
		 
 		//map.setFilter(layers[i]+"_hover",["==","",""])
		 map.setPaintProperty(layers[i]+"_hover",'fill-opacity',.3);
		 // map.setPaintProperty(layers[i]+"_hover",'line-color',"black");
		 // map.setPaintProperty(layers[i]+"_hover",'line-width',2);
 // 
		 map.setPaintProperty(layers[i]+"_hover",'fill-color',colors[i]);
		 map.setPaintProperty(layers[i],'fill-opacity',0);
		 
 		//console.log(layers[i])
 			//map.setFilter(layers[i],["==","OBJECTID",""])
			
		//	console.log([layerName,filterValue,filterKey])
		//	addPolygon(layerName,filterKey,filterValue)
		 
		map.on("mousemove",layers[i],function(c){
			var feature = c.features[0]
			//console.log(feature)

 			var layerName = c.features[0].layer.id
			var filterKey = layerUniqueIds[layerName]
			var filterValue = feature.properties[filterKey]
			displayText+=layerName+" "+filterKey+": "+filterValue
			
			filters[layerName] = {key:filterKey, value:filterValue}
			//console.log([layerName,filterValue])
			d3.select("#"+layerName+"_text").html(layerName
				+"<br><span style=\"font-size:20px\"><strong>"+filterValue+"</strong></span>")
 			//console.log([layerName,id])
		//	filters.push([layerName,id])
 					map.setFilter(layerName+"_hover",["==",filterKey,filterValue])
				
 	    })
		
		
		
 	}
	
		//
	// for(var f in filters){
	// 	map.setFilter(filters[f][0],["!=","OBJECTID",filters[f][1]])
	// }
	//
	 })
	 
    map.on('click', "borough", function(e) {
        var feature = e.features[0]
		console.log(filters)
		clicked = true
		for(var f in filters){
			console.log(f)
   		 map.setPaintProperty(f+"_hover",'fill-opacity',.6);
			
		}
		
    })
     
	 // for(var i in layers){
// 			 map.on("mouseleave",'counties',function(){
//  			var layerName = c.features[0].layer.id
// 			var filterKey = layerUniqueIds[layerName]
//
//  			map.setFilter(layerName+"_hover",["==",filterKey,"xxx"])
//
//
// 			    // d3.select("#mapPopup").style("visibility","hidden")
// 			 })
//  		}
//
      return map
}

function addPolygon(layerName,filterKey,filterValue){
	
}
