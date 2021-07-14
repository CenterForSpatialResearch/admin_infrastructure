
var map;
var highlightColor = "#fa6614"
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
		//"zipcode",
		"policePrecinct",
		"congressionalDistrict",
		"stateAssemblyDistrict",
		"stateSenate",
		// "tract",
		"cityCouncil",
		//"schoolDistrict",
		"fireDivision"
	]
	var tempwords = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean urna erat, dictum vitae metus eu, vehicula consectetur tortor. Maecenas fermentum."
	var layerDefinition = {
		borough:"There are 5 boroughs in NYC",
		zipcode:"There are 145 zipcodes",
		policePrecinct:"There are 77 precincts ine NYC",
		congressionalDistrict:tempwords,
		stateAssemblyDistrict:tempwords,
		stateSenate:tempwords,
		tract:tempwords,
		schoolDistrict:tempwords,
		cityCouncil:tempwords,
		fireDivision:tempwords
	}
	
	var layersHover = [
		//"borough",
		//"zipcode_hover",
		"policePrecinct_hover",
		"congressionalDistrict_hover",
		"stateAssemblyDistrict_hover",
		"stateSenate_hover",
		// "tract",
		"cityCouncil_hover",
		//"schoolDistrict_hover",
		"fireDivision_hover"
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
		stateAssemblyDistrict:"State Assembly District",
		stateSenate:"State Senate District",
		tract:"Census Tract",
		schoolDistrict:"School District",
		cityCouncil:"City Council District",
		fireDivision:"Fire Division"
	}
	
	// var promises = []
//     for(var i in layers){
//     	promises.push(d3.json(root+layers[i]+".geojson"))
//     }
	
 var colors = {
 	borough:"#6ee14e",
 	zipcode:"#cfeb47",
 	policePrecinct:"#96b831",
 	congressionalDistrict:"#dfc239",
 	stateAssemblyDistrict:"#41cde2",
 	stateSenate:"#67e9b7",
 	//tract:"#688dcd",
 	schoolDistrict:"#a7e384",
 	cityCouncil:"#5eb47f",
 	fireDivision:"#dedb85"

 }
var layerSizes = {}
	
	console.log(window.innerWidth)
	d3.select("#map").style("width",(window.innerWidth-270)+"px")
 Promise.all([d3.json("intersections_2.json"),d3.csv("Adeline/02_Exports/boundaryIntersections.csv"),d3.json("geoData/policePrecinct.geojson")])
 .then(function(data){
	   var map = drawMap(data[0],data[1],data[2])
})
//click layer
//show a layer
//


function drawMap(intersections,newInter,geoTest){
	
	console.log(intersections)
	
	for(var j in intersections){
		console.log(intersections[j])
		layerSizes[j]=Object.keys(intersections[j]).length
	}
	console.log(layerSizes)
	//console.log("map")
	//console.log(newInter)
	
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
			dict[l1+"_"+id1] = {}
			if(Object.keys(dict[l1+"_"+id1]).indexOf(l2)==-1){
				dict[l1+"_"+id1][l2]=[]
				dict[l1+"_"+id1][l2].push(id2)
			}else{
				dict[l1+"_"+id1][l2].push(id2)
			}
			
			//dict[l1+"_"+id1].push(l2+"_"+id2)
		}else{
			// dict[l1+"_"+id1].push(l2+"_"+id2)
			if(Object.keys(dict[l1+"_"+id1]).indexOf(l2)==-1){
				dict[l1+"_"+id1][l2]=[]
				dict[l1+"_"+id1][l2].push(id2)
			}else{
				dict[l1+"_"+id1][l2].push(id2)
			}
		}
		
		if(Object.keys(dict).indexOf(l2+"_"+id2)==-1){
			dict[l2+"_"+id2] = {}
			if(Object.keys(dict[l2+"_"+id2]).indexOf(l2)==-1){
				dict[l2+"_"+id2][l1]=[]
				dict[l2+"_"+id2][l1].push(id1)
			}else{
				dict[l2+"_"+id2][l1].push(id1)
			}
			
			//dict[l1+"_"+id1].push(l2+"_"+id2)
		}else{
			// dict[l1+"_"+id1].push(l2+"_"+id2)
			if(Object.keys(dict[l2+"_"+id2]).indexOf(l1)==-1){
				dict[l2+"_"+id2][l1]=[]
				dict[l2+"_"+id2][l1].push(id1)
			}else{
				dict[l2+"_"+id2][l1].push(id1)
			}
		}
		
		
		links.push({source:l1+"_"+id1,sourceLayer:l1,sourceId:id1,target:l2+"_"+id2,targetLayer:l2,targetId:id2,})
	}
}
	//console.log(links)
	console.log(dict)
	
    // d3.select("#map").style("width",window.innerWidth+"px")
 //          .style("height",window.innerHeight+"px")

    mapboxgl.accessToken = "pk.eyJ1IjoiampqaWlhMTIzIiwiYSI6ImNpbDQ0Z2s1OTN1N3R1eWtzNTVrd29lMDIifQ.gSWjNbBSpIFzDXU2X5YCiQ"
    map = new mapboxgl.Map({
		container: 'map',
		style:"mapbox://styles/jjjiia123/cko6gwof42j1617kqh2r706sd",// ,//newest
		// style:"mapbox://styles/jjjiia123/ckoeh9hz9413117qhmh6w4mza",
		zoom: 10,
		preserveDrawingBuffer: true,
		minZoom:8,
		maxZoom:14,// ,
		// maxBounds: maxBounds
		center: [-73.95,40.71]
     });	 //
	 // map.on("mousemove",layers[0],function(d){
	 // 	console.log(d)
	 // })
	 
	// map.getCanvas().style.cursor = "unset";

//
	 map.addControl(new mapboxgl.NavigationControl(),'top-left');

      map.on("load",function(){
 	 // d3.selectAll(".mapboxgl-ctrl-bottom-right").remove()
//  	 d3.selectAll(".mapboxgl-ctrl-bottom-left").remove()

 		var activeLayer = ""
 		 var geocoder = new MapboxGeocoder({
 				 accessToken:mapboxgl.accessToken,
 				 bbox: [-74.274972,40.498509, -73.67484,40.92322],
 				 mapboxgl: mapboxgl,
				 flyTo:false,
				 marker:false
				 //limit:1
 			 })
		//https://docs.mapbox.com/mapbox-gl-js/example/mapbox-gl-geocoder-outside-the-map/
		//https://github.com/mapbox/mapbox-gl-geocoder/blob/master/API.md#parameters
		document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
		
//
// 	console.log(map.getStyle().layers)
//
//
		//.addTo(map);
		var filters = {}
// map.setLayoutProperty("tract",'visibility',"none");// //
// map.setLayoutProperty("tract_outline",'visibility',"none");// //
 // map.setPaintProperty("borough_hover",'fill-color',"#000");
 // map.setPaintProperty('borough_hover','fill-opacity',0.3);


 // map.setPaintProperty('background','color',"#fff");
// map.setPaintProperty('water','fill-color',"#fff");
	map.on("click","borough_hover",function(e){
		//https://docs.mapbox.com/mapbox-gl-js/example/mouse-position/
			// console.log(e.point)
	// 		console.log(e.lngLat.lat)
		// if(marker!=undefined){
		// marker.remove()
		//
		// }
		//d3.select(".mapboxgl-ctrl-geocoder--input input").attr("value","test")
	geocoder.clear()
			d3.selectAll(".mapboxgl-marker").remove()
		var marker = new mapboxgl.Marker({
			color:"#fa6614"
		})
			marker.setLngLat([e.lngLat.lng,e.lngLat.lat])
			.addTo(map);
			d3.select("#presentLocation")
				.html("<span class=\"highlight\">The clicked location </span> "+Math.round(e.lngLat.lng*10000)/10000
					+", "+Math.round(e.lngLat.lat*10000)/10000
					+" <span class=\"highlight\">is in:</span> ")

			//console.log(marker)
	})
	
	
	var clickedFeatures = []
	
	for(var i in layers){

		 // console.log(layers[i])
		// map.setFilter(layers[i]+"_hover",["==","",""])
 
		map.setPaintProperty(layers[i]+"_hover",'fill-opacity',0);
		// map.setPaintProperty(layers[i]+"_hover",'fill-color',colors[layers[i]]);



		map.setPaintProperty(layers[i],'fill-color',colors[layers[i]]);
		map.setPaintProperty(layers[i]+"_outline",'line-color',colors[layers[i]]);

 
		  map.setPaintProperty(layers[i]+"_outline",'line-width',1);
		// map.setPaintProperty(layers[i]+"_outline",'line-opacity',0);

		 // map.setPaintProperty(layers[i],'line-opacity',.1);		//
		//  map.setLayoutProperty("road",'visibility',"none");
	//	map.setPaintProperty(layers[i],'fill-opacity',0.2);

		map.on("click",layers[i]+"_hover",function(c){

			

			var feature = c.features[0]
		
			d3.selectAll(".shared").remove()
			d3.selectAll(".bars").style("border","none")

			var layerName = c.features[0].layer.id.replace("_hover","")
			var filterKey = layerUniqueIds[layerName]
			var filterValue = feature.properties[filterKey]

			if(clickedFeatures.length==layers.length){
	 			clickedFeatures = []
				 clickedFeatures.push(feature)
	 		}else{
				 clickedFeatures.push(feature)
	 		}
		
			if(layers.indexOf(layerName)==layers.length-1){
				drawList(clickedFeatures,dict,map)
			
			}

			//displayText+=layerName+" "+filterKey+": "+filterValue
			map.setLayoutProperty(layerName,'visibility',"visible");//
			map.setLayoutProperty(layerName+"_outline",'visibility',"visible");//

			filters[layerName] = {key:filterKey, value:filterValue}
			//console.log([layerName,filterValue])
			d3.select("#key").style("visibility","visible")
			d3.select("#"+layerName+"_text").html(layerName
			+"<br><span style=\"font-size:20px\"><strong>"+filterValue+"</strong></span>")

			//map.setPaintProperty(layerName+"_hover",'fill-opacity',.1);

			map.setPaintProperty(layerName+"_outline",'line-opacity',1);
			map.setPaintProperty(layerName,'fill-opacity',0.1);

			map.setFilter(layerName,["==",filterKey,filterValue])
			map.setFilter(layerName+"_outline",["==",filterKey,filterValue])
			//	console.log([layerName,filterValue])

			// map.setPaintProperty(layerName,'line-opacity',1);
			// map.setPaintProperty(layerName,'offset',i);
			//
			// currentAdmins[layerName]=intersections[layerName][filterValue]
			// currentAdmins[layerName]["gid"]=filterValue
  	    })
  	}
	
	
	//https://github.com/mapbox/mapbox-gl-geocoder/blob/master/API.md#parameters
	geocoder.on("results",function(result){
		d3.selectAll(".mapboxgl-marker").remove()
		for(var i in layers){
      		 map.setPaintProperty(layers[i],'fill-opacity',0);
			
		}
	})
 		geocoder.on('result', function(result) {
			// console.log("geo")
			//console.log(result)
			
			d3.select("#presentLocation")
				.html("The address"
					+result.result["place_name"]
					+" is in")
			
 			if(result!=null){
				var center = result.result.center
				var marker = new mapboxgl.Marker({
					color:highlightColor
				})
				marker.setLngLat(center)
					.addTo(map);
					
 				var coords = result.result.geometry.coordinates
 				var features = map.queryRenderedFeatures(map.project(coords), {layers:layersHover})
 				filterOnResult(map,features)
				drawList(features,dict,map)
 			}

 		});
 	// })
       return map
		 })
}
function drawList(features,dict,map){
	//console.log(features)
	d3.select("#list").remove()
		d3.select("#info")
			.append("div")
			.attr("id","list")
			//.style("margin-top","20px")
	
	for(var i in features){
		//console.log(features[i])
		var layerName = features[i].layer.id.replace("_hover","")
		var layerDisplayName = layerLabel[layerName]
		var keyName = layerUniqueIds[layerName]
		var value = features[i].properties[keyName]
		
		var capLayerName = layerName[0].toUpperCase()+layerName.substring(1)
		
		var key = capLayerName+"_"+value
		var intersections = dict[key]
		var intersectionsText = ""
		for(var l in intersections){
			//console.log(l)
			var formattedL = l[0].toLowerCase()+l.substring(1)
			if(intersections[l].length>1){
				intersectionsText+= intersections[l].length+" "+ layerLabel[formattedL]+"s<br>"	
			}else{
				intersectionsText+= intersections[l].length+" "+ layerLabel[formattedL]+"<br>"
			}
		}
		
		var row = d3.select("#list")
			.append("div")
			.attr("id","row")
		
		
		row.append("div").attr("class","listSubtitle")	
			.html(layerDisplayName+" "+value)
			.style("color",colors[layerName])
			//.style("color","#fff")
			.style("padding-left","5px")
			.style("cursor","pointer")
			.attr("id",layerName+"_"+value+"_"+keyName)
			.on("mouseover",function(){
				var id = d3.select(this).attr("id")
				var layer = id.split("_")[0]
				var value = id.split("_")[1]
				var key = id.split("_")[2]
				console.log([layer,value])
				map.setPaintProperty(layer,"fill-opacity",1)
			})
			.on("mouseout",function(){
				var id = d3.select(this).attr("id")
				var layer = id.split("_")[0]
				var value = id.split("_")[1]
				var key = id.split("_")[2]
				map.setPaintProperty(layer,"fill-opacity",.1)
			})
			//.style("border","1px solid "+colors[layerName])
		row.append("div").attr("class","listText")
		
			.html(
				// "There are <strong>"+layerSizes[layerName]+" "+ layerDisplayName.toLowerCase()
// 				+"s</strong> in New York City. <br><strong>"+
		
				//layerDisplayName+" "+value+"</strong> "
				"intersects with "+intersectionsText
			)
			.style("padding-left","5px")
			.style("padding-bottom","10px")
		
	}

}

function filterOnResult(map,features){
	for(var f in features){
			//console.log(features[f])
			 var layerName = features[f].layer.id.replace("_hover","")  	 	  
			 var idKey = layerUniqueIds[layerName]
			
			//console.log(idKey)
			 var gid = features[f]["properties"][idKey]
			//console.log([idKey,gid])
 			map.setFilter(layerName,["==",idKey,gid])
 			map.setFilter(layerName+"_outline",["==",idKey,gid])
   		 	map.setPaintProperty(layerName+"_outline",'line-opacity',1);
			map.setLayoutProperty(layerName,'visibility',"visible");//
			map.setLayoutProperty(layerName+"_outline",'visibility',"visible");//
		 

		 // map.setPaintProperty(layerName,'fill-color',colors[i]);
		 map.setPaintProperty(layerName,'fill-opacity',.1);
			//map.setFilter(layerName+"_hover",["!=",idKey,gid])
		}
}

