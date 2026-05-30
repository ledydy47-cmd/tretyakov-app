import httpx
import asyncio
import os

PAINTINGS = [
    {
        "filename": "repin_ivan_grozny.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/REPIN_Ivan_Terrible%26Ivan.jpg"
    },
    {
        "filename": "repin_burlaki.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/2/2e/Ilya_Repin_-_Barge_Haulers_on_the_Volga_-_Google_Art_Project.jpg"
    },
    {
        "filename": "repin_ne_jdali.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Repin-_Unexpected_visitors.jpg"
    },
    {
        "filename": "surikov_morozova.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/9/9c/Vasily_Surikov_-_%D0%91%D0%BE%D1%8F%D1%80%D1%8B%D0%BD%D1%8F_%D0%9C%D0%BE%D1%80%D0%BE%D0%B7%D0%BE%D0%B2%D0%B0_-_Google_Art_Project.jpg"
    },
    {
        "filename": "surikov_strelcy.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/5/5d/Vasily_Surikov_-_The_Morning_of_the_Streltsy_Execution_-_Google_Art_Project.jpg"
    },
    {
        "filename": "vasnetsov_bogatyri.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/4/4e/Viktor_Vasnetsov_-_%D0%91%D0%BE%D0%B3%D0%B0%D1%82%D1%8B%D1%80%D0%B8_-_Google_Art_Project.jpg"
    },
    {
        "filename": "vasnetsov_alenushka.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Vasnetsov_Alenushka_1881.jpg"
    },
    {
        "filename": "levitan_vechniy_pokoj.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/b/b5/LevitanAboveEternalPeace.jpg"
    },
    {
        "filename": "savrasov_grachi.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/f/fe/Savrasov_spring_rooks.jpg"
    },
    {
        "filename": "shishkin_utro.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/1/19/Shishkin%2C_Ivan_-_Morning_in_a_Pine_Forest.jpg"
    },
]

OUTPUT_DIR = "backend/static/paintings"

async def download_all():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    async with httpx.AsyncClient(timeout=30, follow_redirects=True) as client:
        for p in PAINTINGS:
            filepath = os.path.join(OUTPUT_DIR, p["filename"])
            
            if os.path.exists(filepath):
                print(f"⏭️  Уже есть: {p['filename']}")
                continue
            
            print(f"⬇️  Скачиваем: {p['filename']}...")
            try:
                response = await client.get(
                    p["url"],
                    headers={"User-Agent": "TretyakovApp/1.0 (educational project)"}
                )
                if response.status_code == 200:
                    with open(filepath, "wb") as f:
                        f.write(response.content)
                    size = len(response.content) // 1024
                    print(f"   ✅ Сохранено ({size} KB)")
                else:
                    print(f"   ❌ Ошибка {response.status_code}: {p['url']}")
            except Exception as e:
                print(f"   ❌ Ошибка: {e}")
    
    print("\n🎉 Готово!")

if __name__ == "__main__":
    asyncio.run(download_all())
