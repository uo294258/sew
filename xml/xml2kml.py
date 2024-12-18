import xml.etree.ElementTree as ET

class Kml(object):

    def __init__(self):
        self.raiz = ET.Element('kml', xmlns="http://www.opengis.net/kml/2.2")
        self.doc = ET.SubElement(self.raiz, 'Document')

    def addPlacemark(self, nombre, descripcion, long, lat, alt, modoAltitud):
        pm = ET.SubElement(self.doc, 'Placemark')
        ET.SubElement(pm, 'name').text = nombre
        ET.SubElement(pm, 'description').text = descripcion
        punto = ET.SubElement(pm, 'Point')
        ET.SubElement(punto, 'coordinates').text = f"{long},{lat},{alt}"
        ET.SubElement(punto, 'altitudeMode').text = modoAltitud

    def addLineString(self, nombre, extrude, tessellate, listaCoordenadas, modoAltitud, color, ancho):
        pm = ET.SubElement(self.doc, 'Placemark')
        ET.SubElement(pm, 'name').text = nombre
        ls = ET.SubElement(pm, 'LineString')
        ET.SubElement(ls, 'extrude').text = extrude
        ET.SubElement(ls, 'tessellate').text = tessellate
        ET.SubElement(ls, 'coordinates').text = listaCoordenadas
        ET.SubElement(ls, 'altitudeMode').text = modoAltitud

        estilo = ET.SubElement(pm, 'Style')
        linea = ET.SubElement(estilo, 'LineStyle')
        ET.SubElement(linea, 'color').text = color
        ET.SubElement(linea, 'width').text = ancho

    def escribir(self, nombreArchivoKML):
        arbol = ET.ElementTree(self.raiz)
        arbol.write(nombreArchivoKML, encoding='utf-8', xml_declaration=True)

    def ver(self):
        print("\nElemento raiz =", self.raiz.tag)
        print("Atributos =", self.raiz.attrib)
        for hijo in self.raiz.findall('.//'):
            print("\nElemento =", hijo.tag)
            print("Contenido =", hijo.text.strip() if hijo.text else None)
            print("Atributos =", hijo.attrib)

def procesar_xml_a_kml( ):
    xml_file='circuitoEsquema.xml'
    tree = ET.parse(xml_file)
    root = tree.getroot()
    nuevoKML = Kml()
    kml_file='circuito.kml'
    ns = {'ns': 'http://www.uniovi.es'}

    nombre_circuito = root.find('ns:nombre', ns).text
    localidad = root.find('ns:localidad', ns).text
    pais = root.find('ns:pais', ns).text
    coordLat = root.find('ns:coordenadas/ns:latitud', ns).text.strip()
    coordLong = root.find('ns:coordenadas/ns:longitud', ns).text.strip()
    coordAlt = root.find('ns:coordenadas/ns:altitud', ns).text.strip()

    coordLong = float(coordLong.strip())
    coordLat = float(coordLat.strip())
    coordAlt = float(coordAlt)


    nuevoKML.addPlacemark(nombre_circuito, "Localidad: {localidad}, País: {pais}", coordLong, coordLat, coordAlt, 'clampToGround')

    coordenadas = [f"{coordLong},{coordLat},{coordAlt}"]
    tramos = root.findall('ns:tramos/ns:tramo', ns)
    for tramo in tramos:
        coords = tramo.find('ns:coordenadasfinales', ns)
        latitud = coords.find('ns:latitud', ns).text.strip()
        longitud = coords.find('ns:longitud', ns).text.strip()
        altitud = coords.find('ns:altitud', ns).text.strip()

        longitud = float(longitud.replace('W', '').strip())
        latitud = float(latitud.replace('N', '').strip())
        altitud = float(altitud)

        coordenadas.append(f"{longitud},{latitud},{altitud}")

    lista_coordenadas = "\n".join(coordenadas)
    nuevoKML.addLineString("Trazado del circuito", "1", "1", lista_coordenadas, 'clampToGround', '#ff0000ff', "5")

    nuevoKML.escribir(kml_file)
    print(f"Archivo KML '{kml_file}' creado exitosamente.")


procesar_xml_a_kml()