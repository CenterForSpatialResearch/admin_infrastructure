
var map;
var clicked = false
var currentAdmins = {}
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
		"policePrecinct",
		"congressionalDistrict",
		"stateAssemblyDistrict",
		"stateSenate",
		// "tract",
		"cityCouncil",
		"schoolDistrict",
		"fireDivision"
	]
	var layerUniqueIds = {
		borough:"BoroName",
		zipcode:"ZIPCODE",
		policePrecinct:"Precinct",
		congressionalDistrict:"CongDist",
		stateAssemblyDistrict:"AssemDist",
		stateSenate:"StSenDist",
		tract:"BoroCT2010",
		schoolDistrict:"SchoolDist",
		cityCouncil:"CounDist",
		fireDivision:"FireDiv"
	}
	var layerLabel = {
		borough:"Borough",
		zipcode:"Zipcode",
		policePrecinct:"Police Precinct",
		congressionalDistrict:"Congressional District",
		stateAssemblyDistrict:"State Assemmbly District",
		stateSenate:"State Senate District",
		tract:"Census Tract",
		schoolDistrict:"School District",
		cityCouncil:"City Council District",
		fireDivision:"Fire Division"
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
	
	var colors = {
		borough:"#bb7051",
		zipcode:"#7b62cc",
		policePrecinct:"#78b642",
		congressionalDistrict:"#c163b9",
		stateAssemblyDistrict:"#50b189",
		stateSenate:"#d24c3c",
		tract:"#688dcd",
		schoolDistrict:"#cd9c3f",
		cityCouncil:"#c85782",
		fireDivision:"#73843b"
		
	}
	
	
 Promise.all([d3.json("intersections_2.json"),d3.csv("Adeline/02_Exports/boundaryIntersections.csv"),d3.json("geoData/policePrecinct.geojson")])
 .then(function(data){
	   var map = drawMap(data[0],data[1],data[2])
})
//click layer
//show a layer
//


function drawMap(intersections,newInter,geoTest){
//	console.log(intersections)
	//console.log("map")
	console.log(newInter)
	
	var links = []
	var dict = {}
	for(var i in newInter){
		if(newInter[i]["fileName"]!=undefined){
			
		var layerNames = newInter[i]["fileName"].replace(".geojson","")
		var l1 = layerNames.split("-")[0]
		var l2 = layerNames.split("-")[1]
		var id1 = newInter[i].ID1
		var id2 = newInter[i].ID2
			
		if(Object.keys(dict).indexOf(l1+"_"+id1)==-1){
			dict[l1+"_"+id1] = []
			dict[l1+"_"+id1].push(l2+"_"+id2)
		}else{
			dict[l1+"_"+id1].push(l2+"_"+id2)
		}
		
		links.push({source:l1+"_"+id1,sourceLayer:l1,sourceId:id1,target:l2+"_"+id2,targetLayer:l2,targetId:id2,})
	}
}
	console.log(links)
	console.log(dict)
	
    // d3.select("#map").style("width",window.innerWidth+"px")
 //          .style("height",window.innerHeight+"px")

    mapboxgl.accessToken = "pk.eyJ1IjoiampqaWlhMTIzIiwiYSI6ImNpbDQ0Z2s1OTN1N3R1eWtzNTVrd29lMDIifQ.gSWjNbBSpIFzDXU2X5YCiQ"
    map = new mapboxgl.Map({
         container: 'map',
        style:"mapbox://styles/jjjiia123/cko6gwof42j1617kqh2r706sd",// ,//newest
        // style:"mapbox://styles/jjjiia123/ckoeh9hz9413117qhmh6w4mza",
         zoom: 9.7,
 		    center:[-74, 40.7],
         preserveDrawingBuffer: true,
         minZoom:1,
 	   maxZoom:12,// ,
         // maxBounds: maxBounds
 		center: [-73.8,40.73]
     });	 //
	 // map.on("mousemove",layers[0],function(d){
	 // 	console.log(d)
	 // })
	 
	// map.getCanvas().style.cursor = "unset";

	 // var filters = {}
//
//
      map.on("load",function(){
 	//	 d3.selectAll(".mapboxgl-ctrl-bottom-right").remove()
 		// d3.selectAll(".mapboxgl-ctrl-bottom-left").remove()

 		var activeLayer = ""
 		 var geocoder = new MapboxGeocoder({
 				 accessToken:mapboxgl.accessToken,
 				 bbox: [-74.274972,40.498509, -73.67484,40.92322],
 				 mapboxgl: mapboxgl
 			 })

 		map.addControl(geocoder)
		 })
//
// 	console.log(map.getStyle().layers)
//
//
// 	 for(var i in layers){
//
// 		 console.log(layers[i])
//  		// map.setFilter(layers[i]+"_hover",["==","",""])
//    		 map.setPaintProperty(layers[i]+"_hover",'fill-opacity',0);
// 		 map.setPaintProperty(layers[i]+"_hover",'fill-color',colors[layers[i]]);
// 		 map.setPaintProperty(layers[i],'fill-opacity',.3);
//
// 		 map.on("click",layers[i],function(c){
// 			var feature = c.features[0]
// 			// console.log(feature)
// 			 d3.selectAll(".shared").remove()
// 			 d3.selectAll(".bars").style("border","none")
//
//  			var layerName = c.features[0].layer.id
// 			var filterKey = layerUniqueIds[layerName]
// 			var filterValue = feature.properties[filterKey]
// 			//displayText+=layerName+" "+filterKey+": "+filterValue
//
// 			filters[layerName] = {key:filterKey, value:filterValue}
// 			//console.log([layerName,filterValue])
// 			d3.select("#key").style("visibility","visible")
//
// 			d3.select("#"+layerName+"_text").html(layerName
// 				+"<br><span style=\"font-size:20px\"><strong>"+filterValue+"</strong></span>")
//
// 	   		 map.setPaintProperty(layerName+"_hover",'fill-opacity',.3);
//  			map.setFilter(layerName+"_hover",["==",filterKey,filterValue])
// 			 console.log([layerName,filterValue])
//
// 			 currentAdmins[layerName]=intersections[layerName][filterValue]
// 			 currentAdmins[layerName]["gid"]=filterValue
//  	    })
//  	}
// 		geocoder.on('results', function(results) {
// 			if(results!=null){
// 				var coords = results.features[0].center
// 				var features = map.queryRenderedFeatures(map.project(coords),{layers:layers})
// 				filterOnResult(map,features)
// 			}
//
// 		});
// 	 })
//
//       return map
}

function filterOnResult(map,features){
		console.log(features)
		for(var f in features){
			 var layerName = features[f].layer.id  	 	  
			 var idKey = layerUniqueIds[layerName]
			 var gid = features[f]["properties"][idKey]
			console.log([idKey,gid])
 		//	map.setFilter(layerName+"_hover",["==",filterKey,filterValue])
			map.setFilter(layerName+"_hover",["!=",idKey,gid])
		}
}

