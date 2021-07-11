from qgis.core import (
    QgsVectorLayer
)

import os

import itertools

rootPath = "G:\\My Drive\\2021Summer_CSR\\Boundaries\\data\\"

fileNames =["AssemblyDistricts.shp", "BoroughBoundaries.shp","CityCouncil.shp", "CongressionalDistrict.shp", "PolicePrecinct1.shp", "StateSenate.shp", "FireDivision.shp"]

#fileNames =["BoroughBoundaries.shp","CityCouncil.shp","CongressionalDistrict.shp"]#

layers = []

for fileName in fileNames:
    layers.append(QgsVectorLayer(rootPath + fileName))

#itertools.combinations(iterable, r)
result = itertools.combinations (layers,2)

for i, item in enumerate(result): 
    layerName0 = os.path.splitext(os.path.basename(item[0].source()))[0]
    layerName1 = os.path.splitext(os.path.basename(item[1].source()))[0]
    print("intersecting " + layerName0 + " and " + layerName1)
    processing.run("qgis:intersection", {"INPUT" : item[0], "OVERLAY": item [1], "OUTPUT": rootPath + "\\geojson\\" + layerName0 + "-" + layerName1 + ".geojson"})