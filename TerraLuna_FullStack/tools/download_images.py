# Downloads one photo per Earth site into wwwroot/img/<site-id>.jpg
# Run:  python tools/download_images.py   (needs internet + Python 3, no extra packages)
import json, os, urllib.parse, urllib.request
QUERY = {
    "atacama": "Atacama Desert",
    "haughton": "Haughton impact structure",
    "death-valley": "Death Valley National Park",
    "mcmurdo": "McMurdo Dry Valleys",
    "mauna-kea": "Mauna Kea",
    "iceland-holuhraun": "Askja",
    "rio-tinto": "Rio Tinto river Spain Huelva",
    "lonar-crater": "Lonar crater",
    "ladakh-puga": "Ladakh",
    "deccan-traps": "Deccan Traps",
    "thar-desert": "Thar Desert",
    "sambhar-lake": "Sambhar Lake"
}
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'TerraLuna.Presentation', 'wwwroot', 'img')
UA = {'User-Agent': 'TerraLunaHackathon/1.0 (student project)'}
def get(u): return urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=40).read()
os.makedirs(OUT, exist_ok=True)
for sid, q in QUERY.items():
    try:
        api = ('https://en.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrlimit=1'
               '&prop=pageimages&piprop=thumbnail&pithumbsize=1000&gsrsearch=' + urllib.parse.quote(q))
        page = list(json.loads(get(api))['query']['pages'].values())[0]
        open(os.path.join(OUT, sid + '.jpg'), 'wb').write(get(page['thumbnail']['source']))
        print('OK  ', sid, '<-', page['title'])
    except Exception as e:
        print('FAIL', sid, e)
