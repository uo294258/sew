import xml.etree.ElementTree as ET
def procesar_xml_a_svg(xml_file):
    tree = ET.parse(xml_file)
    root = tree.getroot()

    distancias = []
    altitudes = []
    tramos = root.findall('{http://www.uniovi.es}tramos/{http://www.uniovi.es}tramo')

    distanciaAcumulada=0
    distancias.append(distanciaAcumulada)
    altitud  = root.find('{http://www.uniovi.es}coordenadas/{http://www.uniovi.es}altitud').text.strip()
    altitud=float(altitud)
    altitudes.append(altitud)
    for tramo in tramos:
        coords = tramo.find('{http://www.uniovi.es}coordenadasfinales')
        dist = tramo.find('{http://www.uniovi.es}distancia').text.strip()
        altitud  = coords.find('{http://www.uniovi.es}altitud').text.strip()
        altitud = float(altitud)
        dist=float(dist)
        distanciaAcumulada+=dist
        distancias.append(distanciaAcumulada)
        altitudes.append(altitud)
        print(distanciaAcumulada, "dist", altitud, "alt.")
    svg_header = '''<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="500" viewBox="0 0 1000 500">
    <g fill="none" stroke="black" stroke-width="2">'''
    max_distancia = max(distancias)
    max_altitud = max(altitudes)
    min_altitud = min(altitudes)

    scaled_distancias = [d * 500 / max_distancia for d in distancias]
    scaled_altitudes = [(a - min_altitud) * 180 / (max_altitud - min_altitud) for a in altitudes]

    scaled_altitudes = [180 - a for a in scaled_altitudes]
    points = []
    for i in range(len(distancias)):
        points.append(f"{scaled_distancias[i]},{scaled_altitudes[i]}")  # Invertir las altitudes para que crezcan hacia arriba

    points.append(f"{scaled_distancias[0]},{scaled_altitudes[0]}")
    points_str = " ".join(points)

    svg_header = '''<svg xmlns="http://www.w3.org/2000/svg" height="220" width="800">
    <polyline points="'''

    svg_footer = '''" style="fill:white;stroke:red;stroke-width:4" />
    Su agente de usuario no soporta SVG
    </svg>'''

    with open('altimetria.svg', 'w') as file:
        file.write(svg_header + points_str + svg_footer)

    print("Archivo SVG generado: altimetria.svg")

procesar_xml_a_svg('circuitoEsquema.xml')