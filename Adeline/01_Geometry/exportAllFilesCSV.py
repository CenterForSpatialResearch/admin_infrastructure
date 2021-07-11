import os
import csv
from qgis.core import (
    QgsVectorLayer
)


rootPath = "G:\\My Drive\\2021Summer_CSR\\Boundaries\\data\\geojson\\"

header = ['fileName', 'ID1', 'ID2']

csv_file = open(rootPath + "output.csv", mode='w', encoding='UTF8', newline='')
writer = csv.DictWriter(csv_file, fieldnames=header)
writer.writeheader()

files = os.listdir(rootPath)
    
for f in files:
    if(f[-4:] == 'json'):
        layer = QgsVectorLayer(rootPath + f)
        features = layer.getFeatures()
        for feat in features:
            attrs = feat.attributes()
            writer.writerow({'fileName': f, 'ID1': attrs[0], 'ID2': attrs[3]})


