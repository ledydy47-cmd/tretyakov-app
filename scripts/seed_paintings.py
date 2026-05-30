import asyncio
import asyncpg
import httpx
import json

# Подключение к базе данных
DB_URL = "postgresql://diana@localhost:5432/tretyakov"

# Список художников и картин
ARTISTS_AND_PAINTINGS = [
    {
        "artist": {
            "name_ru": "Илья Репин",
            "name_en": "Ilya Repin",
            "birth_year": 1844,
            "death_year": 1930,
            "movement": "Передвижники",
            "bio_short": "Илья Ефимович Репин — великий русский художник-реалист, мастер портрета и исторической живописи. Один из самых известных художников России XIX века.",
        },
        "paintings": [
            {
                "title_ru": "Иван Грозный и сын его Иван",
                "title_en": "Ivan the Terrible and His Son Ivan",
                "year_created": 1885,
                "technique": "Холст, масло",
                "genre": "историческая",
                "period": "XIX век",
                "style": "реализм",
                "description_short": "Одна из самых драматичных картин русской живописи. Репин изобразил момент, когда царь Иван Грозный осознал, что смертельно ранил своего сына в припадке гнева.",
                "description_full": "Картина была написана под впечатлением от двух событий — убийства Александра II и жестокого подавления народовольцев. Репин работал над полотном три года. Когда картина была выставлена, она произвела на зрителей настолько сильное впечатление, что один посетитель порезал её ножом. Модели для картины — художник Мясоедов (Иван Грозный) и писатель Гаршин (царевич).",
                "interesting_facts": json.dumps([
                    "Картина была запрещена к показу цензурой на три месяца",
                    "Посетитель Абрам Балашов порезал картину ножом в 1913 году",
                    "Репин использовал бычью кровь чтобы добиться нужного оттенка красного"
                ], ensure_ascii=False),
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Iv_grozny_i_syn.jpg/1024px-Iv_grozny_i_syn.jpg",
                "wikimedia_source": "https://commons.wikimedia.org/wiki/File:Iv_grozny_i_syn.jpg",
                "license_type": "PD",
                "difficulty": 1,
                "popularity_rank": 1,
            },
            {
                "title_ru": "Бурлаки на Волге",
                "title_en": "Barge Haulers on the Volga",
                "year_created": 1873,
                "technique": "Холст, масло",
                "genre": "жанровая",
                "period": "XIX век",
                "style": "реализм",
                "description_short": "Монументальное полотно показывает тяжёлый труд бурлаков — людей, которые тянули баржи против течения Волги. Картина стала символом народного страдания и силы.",
                "description_full": "Репин увидел бурлаков впервые на Неве в 1869 году и был поражён контрастом между отдыхающей публикой и измученными рабочими. Он специально ездил на Волгу чтобы изучить быт бурлаков. На картине изображены 11 конкретных людей — у каждого своя история и характер.",
                "interesting_facts": json.dumps([
                    "Репин ездил на Волгу дважды чтобы написать этюды с натуры",
                    "На картине изображены реальные люди — Репин знал каждого из них лично",
                    "Картина была куплена великим князем Владимиром Александровичем за огромную сумму"
                ], ensure_ascii=False),
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Ilya_Repin_Barge_Haulers_on_the_Volga.jpg/1280px-Ilya_Repin_Barge_Haulers_on_the_Volga.jpg",
                "wikimedia_source": "https://commons.wikimedia.org/wiki/File:Ilya_Repin_Barge_Haulers_on_the_Volga.jpg",
                "license_type": "PD",
                "difficulty": 1,
                "popularity_rank": 2,
            },
            {
                "title_ru": "Не ждали",
                "title_en": "They Did Not Expect Him",
                "year_created": 1884,
                "technique": "Холст, масло",
                "genre": "жанровая",
                "period": "XIX век",
                "style": "реализм",
                "description_short": "Картина изображает неожиданное возвращение политического ссыльного домой. Момент узнавания — один из самых психологически насыщенных в русской живописи.",
                "description_full": "Репин показывает возвращение революционера из ссылки. Реакция каждого члена семьи различна — мать узнаёт сына, жена в растерянности, дети по-разному реагируют на незнакомца. Картина отражала реалии эпохи народничества.",
                "interesting_facts": json.dumps([
                    "Репин написал два варианта картины — на первом возвращалась женщина",
                    "Выражение лица вернувшегося менялось несколько раз в процессе работы",
                    "Картина экспонировалась на XII передвижной выставке в 1884 году"
                ], ensure_ascii=False),
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Repin_They_did_not_expect_him.jpg/1024px-Repin_They_did_not_expect_him.jpg",
                "wikimedia_source": "https://commons.wikimedia.org/wiki/File:Repin_They_did_not_expect_him.jpg",
                "license_type": "PD",
                "difficulty": 2,
                "popularity_rank": 5,
            },
        ]
    },
    {
        "artist": {
            "name_ru": "Василий Суриков",
            "name_en": "Vasily Surikov",
            "birth_year": 1848,
            "death_year": 1916,
            "movement": "Передвижники",
            "bio_short": "Василий Иванович Суриков — мастер масштабных исторических полотен. Его картины воссоздают переломные моменты русской истории с невероятной психологической глубиной.",
        },
        "paintings": [
            {
                "title_ru": "Боярыня Морозова",
                "title_en": "Boyarina Morozova",
                "year_created": 1887,
                "technique": "Холст, масло",
                "genre": "историческая",
                "period": "XIX век",
                "style": "реализм",
                "description_short": "Грандиозное полотно изображает боярыню Феодосию Морозову — раскольницу, которую везут на допрос. Её поднятый перст стал символом несломленного духа.",
                "description_full": "Суриков работал над картиной 3 года. Образ Морозовой долго не давался художнику — пока он не встретил старообрядческую монахиню с фанатичным взглядом. Толпа вокруг саней — целая энциклопедия русских лиц XVII века. Картина поражает своими размерами: 587 × 304 см.",
                "interesting_facts": json.dumps([
                    "Размер картины 587 × 304 см — одна из самых больших в Третьяковке",
                    "Суриков искал натурщицу для Морозовой несколько лет",
                    "На картине более 50 персонажей, у каждого своё выражение лица"
                ], ensure_ascii=False),
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Boyarina_Morozova_%28Surikov%29.jpg/1280px-Boyarina_Morozova_%28Surikov%29.jpg",
                "wikimedia_source": "https://commons.wikimedia.org/wiki/File:Boyarina_Morozova_(Surikov).jpg",
                "license_type": "PD",
                "difficulty": 1,
                "popularity_rank": 3,
            },
            {
                "title_ru": "Утро стрелецкой казни",
                "title_en": "Morning of the Streltsy Execution",
                "year_created": 1881,
                "technique": "Холст, масло",
                "genre": "историческая",
                "period": "XIX век",
                "style": "реализм",
                "description_short": "Картина изображает утро перед казнью стрельцов после подавления бунта Петром I. Противостояние рыжебородого стрельца и молодого царя — центр композиции.",
                "description_full": "Суриков изобразил не саму казнь, а момент перед ней — прощание с близкими, молитвы, горе. Пётр I на коне смотрит холодным взглядом победителя. Рыжебородый стрелец смотрит на царя с ненавистью и вызовом — это противостояние двух воль стало главным нервом картины.",
                "interesting_facts": json.dumps([
                    "Суриков увидел образ картины во сне — горящую свечу на белом фоне",
                    "Работа над картиной заняла 3 года",
                    "Пётр I написан с реального портрета работы Поля Делароша"
                ], ensure_ascii=False),
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Surikov_streltsy.jpg/1280px-Surikov_streltsy.jpg",
                "wikimedia_source": "https://commons.wikimedia.org/wiki/File:Surikov_streltsy.jpg",
                "license_type": "PD",
                "difficulty": 2,
                "popularity_rank": 6,
            },
        ]
    },
    {
        "artist": {
            "name_ru": "Виктор Васнецов",
            "name_en": "Viktor Vasnetsov",
            "birth_year": 1848,
            "death_year": 1926,
            "movement": "Передвижники",
            "bio_short": "Виктор Михайлович Васнецов — художник, создавший образы русских богатырей и сказочных персонажей, ставшие каноническими для всей русской культуры.",
        },
        "paintings": [
            {
                "title_ru": "Богатыри",
                "title_en": "Three Heroes",
                "year_created": 1898,
                "technique": "Холст, масло",
                "genre": "историческая",
                "period": "XIX век",
                "style": "реализм",
                "description_short": "Три богатыря — Добрыня Никитич, Илья Муромец и Алёша Попович — стоят на страже родной земли. Картина стала символом мощи и духа русского народа.",
                "description_full": "Васнецов работал над картиной почти 20 лет — с 1881 по 1898 год. Илья Муромец написан с крестьянина Ивана Петрова, Добрыня — с самого Васнецова и его родственников. Картина была куплена Павлом Третьяковым в год её завершения.",
                "interesting_facts": json.dumps([
                    "Васнецов работал над картиной около 20 лет",
                    "Илья Муромец написан с владимирского крестьянина",
                    "Картина стала настолько популярной что её образы используются до сих пор"
                ], ensure_ascii=False),
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Vasnetsov_Bogatyrs.jpg/1280px-Vasnetsov_Bogatyrs.jpg",
                "wikimedia_source": "https://commons.wikimedia.org/wiki/File:Vasnetsov_Bogatyrs.jpg",
                "license_type": "PD",
                "difficulty": 1,
                "popularity_rank": 4,
            },
            {
                "title_ru": "Алёнушка",
                "title_en": "Alyonushka",
                "year_created": 1881,
                "technique": "Холст, масло",
                "genre": "сказочная",
                "period": "XIX век",
                "style": "реализм",
                "description_short": "Грустная девушка сидит у тёмного лесного пруда в ожидании братца Иванушки. Картина передаёт русскую народную печаль с удивительной поэтичностью.",
                "description_full": "Образ Алёнушки возник у Васнецова когда он увидел простую крестьянскую девушку с огромными грустными глазами. Картина вдохновлена русской сказкой о сестрице Алёнушке и братце Иванушке, но Васнецов создал образ вечной женской печали.",
                "interesting_facts": json.dumps([
                    "Натурщицей послужила крестьянская девушка из Ахтырки",
                    "Васнецов написал несколько этюдов с натуры перед созданием картины",
                    "Картина сразу была признана шедевром на VIII передвижной выставке"
                ], ensure_ascii=False),
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Vasnetsov_Alenushka.jpg/800px-Vasnetsov_Alenushka.jpg",
                "wikimedia_source": "https://commons.wikimedia.org/wiki/File:Vasnetsov_Alenushka.jpg",
                "license_type": "PD",
                "difficulty": 1,
                "popularity_rank": 7,
            },
        ]
    },
    {
        "artist": {
            "name_ru": "Исаак Левитан",
            "name_en": "Isaac Levitan",
            "birth_year": 1860,
            "death_year": 1900,
            "movement": "Передвижники",
            "bio_short": "Исаак Ильич Левитан — величайший русский пейзажист, создатель жанра 'пейзажа настроения'. Его работы наполнены тонкой лирикой и философской глубиной.",
        },
        "paintings": [
            {
                "title_ru": "Над вечным покоем",
                "title_en": "Above Eternal Peace",
                "year_created": 1894,
                "technique": "Холст, масло",
                "genre": "пейзаж",
                "period": "XIX век",
                "style": "реализм",
                "description_short": "Величественный пейзаж с бескрайним небом и маленькой церковью на обрыве — размышление о вечности, одиночестве человека перед лицом природы.",
                "description_full": "Сам Левитан называл эту картину самой своей заветной. Написана на озере Удомля. Маленькая церковь и погост на краю обрыва — символ хрупкости человеческого существования. Небо занимает три четверти полотна, создавая ощущение бесконечности.",
                "interesting_facts": json.dumps([
                    "Левитан называл эту картину 'самой моей заветной'",
                    "Написана в имении Ушаково на берегу озера Удомля",
                    "Небо на картине написано под впечатлением от музыки Бетховена"
                ], ensure_ascii=False),
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Levitan_IsaakIlyich_Above_Eternal_Peace.jpg/1280px-Levitan_IsaakIlyich_Above_Eternal_Peace.jpg",
                "wikimedia_source": "https://commons.wikimedia.org/wiki/File:Levitan_IsaakIlyich_Above_Eternal_Peace.jpg",
                "license_type": "PD",
                "difficulty": 2,
                "popularity_rank": 8,
            },
            {
                "title_ru": "Грачи прилетели",
                "title_en": "The Rooks Have Arrived",
                "year_created": 1871,
                "technique": "Холст, масло",
                "genre": "пейзаж",
                "period": "XIX век",
                "style": "реализм",
                "description_short": "Скромный пейзаж с берёзами и грачами стал символом русской весны. Саврасов сумел передать то неуловимое ощущение пробуждения природы.",
                "description_full": "Алексей Саврасов написал эту картину в Костромской губернии в 1871 году, переживая личную трагедию — незадолго до этого умерла его дочь. Несмотря на это, картина полна надежды и весенней радости. Она стала настоящим откровением для русской живописи.",
                "interesting_facts": json.dumps([
                    "Написана в феврале 1871 года в селе Молвитино",
                    "Саврасов написал картину за несколько дней",
                    "Картина выставлялась на I передвижной выставке и сразу стала знаменитой"
                ], ensure_ascii=False),
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Savrasov_rooks.jpg/800px-Savrasov_rooks.jpg",
                "wikimedia_source": "https://commons.wikimedia.org/wiki/File:Savrasov_rooks.jpg",
                "license_type": "PD",
                "difficulty": 1,
                "popularity_rank": 9,
            },
        ]
    },
    {
        "artist": {
            "name_ru": "Иван Шишкин",
            "name_en": "Ivan Shishkin",
            "birth_year": 1832,
            "death_year": 1898,
            "movement": "Передвижники",
            "bio_short": "Иван Иванович Шишкин — певец русского леса. Его картины передают мощь и величие родной природы с удивительной точностью и любовью.",
        },
        "paintings": [
            {
                "title_ru": "Утро в сосновом лесу",
                "title_en": "Morning in a Pine Forest",
                "year_created": 1889,
                "technique": "Холст, масло",
                "genre": "пейзаж",
                "period": "XIX век",
                "style": "реализм",
                "description_short": "Медведица с тремя медвежатами в утреннем сосновом лесу. Картина стала одной из самых узнаваемых в русском искусстве — её образ использовался на обёртке конфет.",
                "description_full": "Шишкин написал лес, а медведей по его просьбе дорисовал художник-анималист Константин Савицкий. Оба подписали картину, но Третьяков стёр подпись Савицкого. Медведи получились настолько живыми и точными, что стали неотделимы от образа картины.",
                "interesting_facts": json.dumps([
                    "Медведей написал не Шишкин, а художник Константин Савицкий",
                    "Третьяков стёр подпись Савицкого с картины",
                    "Изображение картины появилось на обёртке конфет 'Мишка косолапый' в 1913 году"
                ], ensure_ascii=False),
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Shishkin_morning.jpg/1280px-Shishkin_morning.jpg",
                "wikimedia_source": "https://commons.wikimedia.org/wiki/File:Shishkin_morning.jpg",
                "license_type": "PD",
                "difficulty": 1,
                "popularity_rank": 10,
            },
        ]
    },
]


async def seed():
    print("🌱 Начинаем заполнение базы данных...")
    conn = await asyncpg.connect(DB_URL)

    for item in ARTISTS_AND_PAINTINGS:
        # Добавляем художника
        artist = item["artist"]
        artist_id = await conn.fetchval("""
            INSERT INTO artists (name_ru, name_en, birth_year, death_year, movement, bio_short)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT DO NOTHING
            RETURNING id
        """, artist["name_ru"], artist["name_en"],
            artist["birth_year"], artist["death_year"],
            artist["movement"], artist["bio_short"])

        if not artist_id:
            artist_id = await conn.fetchval(
                "SELECT id FROM artists WHERE name_ru = $1", artist["name_ru"]
            )

        print(f"✅ Художник: {artist['name_ru']} (id={artist_id})")

        # Добавляем картины художника
        for p in item["paintings"]:
            painting_id = await conn.fetchval("""
                INSERT INTO paintings (
                    artist_id, title_ru, title_en, year_created, technique,
                    genre, period, style, description_short, description_full,
                    interesting_facts, image_url, wikimedia_source, license_type,
                    difficulty, popularity_rank, is_published
                ) VALUES (
                    $1, $2, $3, $4, $5,
                    $6, $7, $8, $9, $10,
                    $11, $12, $13, $14,
                    $15, $16, TRUE
                )
                ON CONFLICT DO NOTHING
                RETURNING id
            """,
                artist_id, p["title_ru"], p["title_en"], p["year_created"], p["technique"],
                p["genre"], p["period"], p["style"], p["description_short"], p["description_full"],
                p["interesting_facts"], p["image_url"], p["wikimedia_source"], p["license_type"],
                p["difficulty"], p["popularity_rank"]
            )
            print(f"   🖼️  Картина: {p['title_ru']} (id={painting_id})")

    await conn.close()
    print("\n🎉 База данных заполнена! Добавлено художников и картин.")


if __name__ == "__main__":
    asyncio.run(seed())
