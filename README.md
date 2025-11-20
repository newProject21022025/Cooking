# Cooking
Діапазон,         Кількість карток,    min-width,max-width
Великі Десктопи,  5,                   ≥1440px
Ноутбуки,         4,                   1024px - 1439px
Планшети,         3,                   768px - 1023px
Мобільні,         2,                   ≤767px


POST http://localhost:3000/articles
{
  "title": {
    "ua": "Про українську кухню",
    "en": "About Ukrainian Cuisine"
  },
  "description": {
    "ua": "Відкрийте традиції української кухні та історії смаку",
    "en": "Discover the traditions of Ukrainian cuisine and the taste of history"
  },
  "photo": "https://example.com/ukrainian-food.jpg",
  "blocks": [
    {
      "title": {
        "ua": "Українська кухня: традиції, смак і душа народу",
        "en": "Ukrainian cuisine: traditions, taste and the soul of the people"
      },
      "description": {
        "ua": "Українська кухня – це не лише їжа, а справжня культурна спадщина, що відображає історію та традиції нашого народу. Вона поєднує простоту інгредієнтів із багатством смаку, а кожна страва несе в собі частинку сімейного тепла та гостинності.",
        "en": "Ukrainian cuisine is not just food, but a true cultural heritage that reflects the history and traditions of our people. It combines simple ingredients with rich flavors, and every dish carries a piece of family warmth and hospitality."
      }
    },
    {
      "title": {
        "ua": "Борщ — символ української кухні",
        "en": "Borshch — the symbol of Ukrainian cuisine"
      },
      "description": {
        "ua": "Немає, мабуть, страви, яка б так асоціювалася з Україною, як борщ. Смачний, ароматний, яскраво-червоний завдяки буряку — він увійшов до списку нематеріальної культурної спадщини ЮНЕСКО. І хоч рецепти борщу існує сотні – з квасолею, грибами, копченостями чи пампушками з часником – кожна господиня готує його по-своєму, вкладаючи душу.",
        "en": "There is probably no dish that is as strongly associated with Ukraine as borshch. Tasty, aromatic, bright red thanks to beetroot — it has been included in the UNESCO list of intangible cultural heritage. And although there are hundreds of recipes — with beans, mushrooms, smoked meat or garlic pampushky — every cook prepares it in their own way, putting their soul into it."
      }
    },
    {
      "title": {
        "ua": "Козацькі страви та сила традицій",
        "en": "Cossack dishes and the power of tradition"
      },
      "description": {
        "ua": "Здавна українці славилися вмінням обирати якісні продукти. Тому в кухні багато страв із зернових та бобових: куліш, узвар, вареники. Козацький куліш із поковзом часто готували в походах — просто, але поживно: каша з пшона та мʼяса. Ця страва й досі залишається традиційною для свят і пікніків біля вогнища.",
        "en": "Ukrainians have long been known for choosing quality products. Therefore, the cuisine is rich in dishes made from grains and legumes: kulesh, uzvar, varenyky. The Cossack kulesh with bacon was often cooked during campaigns — simple but hearty: millet porridge with meat. This dish is still traditional for holidays and outdoor gatherings."
      }
    },
    {
      "title": {
        "ua": "Вареники та пироги — кулінарна магія",
        "en": "Varenyky and pies — culinary magic"
      },
      "description": {
        "ua": "Вареники – одна з найулюбленіших страв українців. З картоплею, сиром, капустою, вишнями чи маком – їх різноманітність вражає. А пироги, особливо з хрусткою скоринкою та соковитою начинкою, часто готували на свята, весілля чи вшанування предків.",
        "en": "Varenyky are one of the most beloved Ukrainian dishes. With potatoes, cheese, cabbage, cherries or poppy seeds — their variety is impressive. Pies with a crispy crust and juicy filling were often prepared for holidays, weddings or ancestor remembrance."
      }
    },
    {
      "title": {
        "ua": "Цінності української кухні",
        "en": "The values of Ukrainian cuisine"
      },
      "description": {
        "ua": "Основою українських страв завжди були традиції. Страви готуються з простих, сезонних продуктів: овочів, злаків, мʼяса, молочних продуктів. Вони символізують гостинність, єдність, культуру спільної трапези, коли за столом збирається вся родина.",
        "en": "Ukrainian dishes have always been based on traditions. Meals are prepared from simple, seasonal products: vegetables, grains, meat, dairy. They symbolize hospitality, unity, and the culture of shared meals when the whole family gathers at the table."
      }
    },
    {
      "title": {
        "ua": "Чому українська кухня підкорює світ?",
        "en": "Why is Ukrainian cuisine conquering the world?"
      },
      "description": {
        "ua": "Сьогодні українська кухня стала відомою у всьому світі. Борщ, вареники чи деруни можна знайти в меню ресторанiв різних країн. Її популярність зростає, адже вона поєднує давнi рецепти та багатство нашої землi та щедрiсть українського народу.",
        "en": "Today, Ukrainian cuisine has become known all over the world. Borshch, varenyky or potato pancakes can be found on menus in different countries. Its popularity grows because it combines ancient recipes, the richness of our land and the generosity of the Ukrainian people."
      }
    }
  ]
}

