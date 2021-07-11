import os
import csv
from qgis.core import (
    QgsVectorLayer
)

rootPath = "G:\\My Drive\\2021Summer_CSR\\Boundaries\\data\\geojson\\"

fileName = "CityCouncil-PolicePrecinct1.geojson"
 
layer = QgsVectorLayer(rootPath + fileName)   

features = layer.getFeatures()
    
header = ['fileName', 'ID1', 'ID2']


with open('G:\\My Drive\\2021Summer_CSR\\Boundaries\\data\\geojson\\CityCouncil-PolicePrecinct1.csv', mode='w', encoding='UTF8', newline='') as csv_file:
    writer = csv.DictWriter(csv_file, fieldnames=header)
    writer.writeheader()
    
    for feat in features:
        attrs = feat.attributes()
#    print (fileName,attrs[0],attrs[3])
        writer.writerow({'fileName': fileName, 'ID1': attrs[0], 'ID2': attrs[3]})
