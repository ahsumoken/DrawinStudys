"use strict";
var BLOK = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/lib/blok/data.ts
  var data_exports = {};
  __export(data_exports, {
    FOCI: () => FOCI,
    TEMPLATES: () => TEMPLATES,
    TRACKS: () => TRACKS,
    WARMUPS: () => WARMUPS,
    trackById: () => trackById,
    warmupById: () => warmupById
  });
  var FOCI = [
    {
      id: "start",
      titel: "Begin op de stip",
      uitleg: "Zet je pen eerst stil op het beginpunt. Trek daarna in \xE9\xE9n beweging. Niet al tekenend zoeken waar je moet starten."
    },
    {
      id: "stop",
      titel: "Stop op de stip",
      uitleg: "De lijn mag precies op het eindpunt ophouden \u2014 niet ernaast, niet eroverheen. Mik, ghost in de lucht, en land."
    },
    {
      id: "recht",
      titel: "Houd de lijn recht",
      uitleg: "Geen boog vanuit je pols. Beweeg vanuit schouder of elleboog. Als de lijn kromt, ghost meer keren v\xF3\xF3r je de lijn zet."
    },
    {
      id: "ellips-raken",
      titel: "Ellips raakt alle vier de zijden",
      uitleg: "In een rechthoek moet de ellips de bovenkant, onderkant, links en rechts raken. Geen zwevende ovaal in het midden."
    },
    {
      id: "funnel-as",
      titel: "De as van de trechter blijft recht",
      uitleg: "Teken eerst een rechte middenlijn. Elke ellips staat haaks op die lijn, alsof je een buis van voren inkijkt."
    },
    {
      id: "degree",
      titel: "Ronder naar voren, smaller opzij",
      uitleg: "Een cirkel die je recht van voren ziet is rond. Draait hij van je weg, wordt hij een smallere ellips. In een trechter: de ellips dichter bij je is voller, die verder weg is smaller."
    },
    {
      id: "vp",
      titel: "Hoeveel verdwijnpunten zie je?",
      uitleg: "Kijk je pal tegen een vlak: 1 verdwijnpunt. Zie je een rib (twee vlakken): 2 punten. Zie je een hoekpunt (drie vlakken): 3 punten."
    },
    {
      id: "bal",
      titel: "Eerst de bal, dan de middenlijn",
      uitleg: "Teken de schedel als een bol. Zet daarna de gezichts-middenlijn erop (van kruin naar kin). Nog geen ogen of neus."
    },
    {
      id: "kaak",
      titel: "Het kaakvlak is een platte doos",
      uitleg: "Onder de bal hangt een wig: het kaakvlak. Dat vlak draait mee met de kop. Gok geen mond \u2014 construeer de kaak."
    },
    {
      id: "draai",
      titel: "Draai de kop zonder gezicht",
      uitleg: "Oefen alleen bal + middenlijn + kaak in andere standen (3/4, profiel, van onder). Features komen later."
    }
  ];
  var WARMUPS = [
    {
      id: "superimposed",
      naam: "Lijnen over elkaar",
      hoe: "Twee punten. Trek 8 keer dezelfde lijn eroverheen. Doel: de lijn blijft op de lijn, niet ernaast.",
      templateId: "superimposed"
    },
    {
      id: "ghosted",
      naam: "Ghosted lijnen",
      hoe: "Twee punten. Beweeg een paar keer in de lucht (ghosting). Zet dan \xE9\xE9n lijn. Niet bijwerken.",
      templateId: "ghosted"
    },
    {
      id: "planes",
      naam: "Vlakken met kruis",
      hoe: "Teken een rechthoek. Zet de diagonalen. Halveer. Oefening voor rechte lijnen in een vlak.",
      templateId: "planes"
    },
    {
      id: "table-ellipses",
      naam: "Tabel met ellipsen",
      hoe: "Rijen vakjes. Vul elk vak met twee of drie ellipsen die de randen raken. Geen spitsen.",
      templateId: "table-ellipses"
    },
    {
      id: "ellipses-planes",
      naam: "Ellips in het vlak",
      hoe: "In elk getekend vlak \xE9\xE9n ellips die alle vier de zijden raakt.",
      templateId: "ellipses-planes"
    },
    {
      id: "funnels",
      naam: "Trechters",
      hoe: "Twee gebogen zijden + rechte as. Stapel ellipsen haaks op de as. Dichter bij je: ronder. Verder: smaller.",
      templateId: "funnels"
    },
    {
      id: "arrows",
      naam: "Pijlen in de ruimte",
      hoe: "Een lint dat naar je toe en van je af draait. De randen blijven evenwijdig in de diepte.",
      templateId: "arrows"
    },
    {
      id: "sausages",
      naam: "Worstvormen",
      hoe: "Een cilinder met ronde kapjes. Draai ze in de ruimte. Geen contour-gokken: denk volume.",
      templateId: "sausages"
    },
    {
      id: "texture",
      naam: "Korte textuur",
      hoe: "E\xE9n klein vlak. Van compact (dichtbij) naar open (verder). Geen willekeurige krassen.",
      templateId: "texture"
    },
    {
      id: "plants",
      naam: "Plant-opbouw",
      hoe: "Stengel als worst, bladeren als vlakken. Eerst grote masses, dan pas details.",
      templateId: "plants"
    },
    {
      id: "insects",
      naam: "Insect-masses",
      hoe: "Drie volumes: kop, borst, achterlijf. Verbind ze. Geen pootjes tot de masses kloppen.",
      templateId: "insects"
    },
    {
      id: "cyl-boxes",
      naam: "Cilinders in dozen",
      hoe: "Teken eerst de doos. Ellipsen op de kapjes. De as van de cilinder volgt de diepte van de doos.",
      templateId: "cyl-boxes"
    },
    {
      id: "intersections",
      naam: "Vormen die elkaar snijden",
      hoe: "Twee eenvoudige volumes (doos, bol, cilinder) door elkaar. Teken de snijlijn.",
      templateId: "intersections"
    },
    {
      id: "head-rot",
      naam: "Kopdraaiingen",
      hoe: "Zes standen: vooraan, 3/4, profiel, iets omhoog, iets omlaag. Alleen constructie.",
      templateId: "loomis-grid"
    },
    {
      id: "manikin",
      naam: "Manikin 2 minuten",
      hoe: "Ribbenkorf, bekken, benen, armen als eenvoudige volumes. Geen spieren.",
      templateId: "manikin"
    },
    {
      id: "landmarks",
      naam: "Landmerken",
      hoe: "E\xE9n lichaamsdeel. Zet eerst botpunten (sleutelbeen, SIAS, knie). Spieren pas daarna.",
      templateId: "landmarks"
    },
    {
      id: "asaro",
      naam: "Vlakken van het gezicht",
      hoe: "Grote platte vlakken: voorhoofd, jukbeen, kaak, neus-zijde. Licht komt later.",
      templateId: "asaro"
    },
    {
      id: "values",
      naam: "Drie tonen",
      hoe: "Licht, midden, schaduw. Geen details. E\xE9n voorwerp of kop.",
      templateId: "values"
    },
    {
      id: "folds",
      naam: "Plooigroepen",
      hoe: "Stof hangt tussen twee punten. Teken de grote plooi eerst, niet elk rimpeltje.",
      templateId: "folds"
    }
  ];
  var TRACKS = [
    {
      id: 0,
      naam: "Basis \u2014 lijn en doos",
      kort: "Rechte lijnen, ellipsen en eenvoudige dozen. Loomis: alleen de bal.",
      waarom: "Als lijnen en dozen niet zitten, valt de rest om. Dit is het fundament.",
      dab: {
        titel: "Dozen (Drawabox les 1 / 250-challenge)",
        taak: "Teken 5 of 6 dozen in de ruimte. Niet meer. Stop als de tijd om is \u2014 ga niet \u2018nog even bijwerken\u2019.",
        voorbeeld: "Kies een hoekpunt. Trek drie lijnen uit die hoek (een Y). Verleng de ribben naar denkbeeldige verdwijnpunten. Sluit de achterkant. E\xE9n doos mag scheef staan, \xE9\xE9n mag bijna van voren, \xE9\xE9n van boven.",
        stappen: [
          "Zet een Y: drie lijnen vanuit \xE9\xE9n hoek.",
          "Bepaal of je 1, 2 of 3 verdwijnpunten ziet.",
          "Sluit de drie zichtbare vlakken.",
          "Controleer: evenwijdige ribben lopen naar hetzelfde punt.",
          "Stop na 5\u20136 stuks. Kwaliteit boven aantal."
        ],
        templateId: "boxes-y"
      },
      loomis: {
        titel: "Bal + middenlijn + kaakvlak",
        taak: "Teken koppen als constructie. Geen ogen, geen mond, geen haar.",
        voorbeeld: "Cirkel = schedel. Lichte ellips om de draaiing te zien. Verticale middenlijn van het gezicht. Onder de bal een wig voor de kaak. Als de kop draait, draait die wig mee.",
        stappen: [
          "Teken een cirkel (de bal).",
          "Zet een ellips die laat zien hoe ver de kop draait.",
          "Middenlijn van kruin naar kin.",
          "Kaakvlak als platte vorm onder de bal.",
          "Klaar. Geen features invullen."
        ],
        templateId: "loomis-ball"
      },
      warmupIds: ["superimposed", "ghosted", "planes", "table-ellipses", "ellipses-planes", "funnels"]
    },
    {
      id: 1,
      naam: "Ruimte en eenvoudige kop",
      kort: "Na de 250 dozen. Les 2: vormen in de ruimte. Koppen in meer standen.",
      waarom: "Je leert volume laten draaien, niet alleen platte contouren.",
      dab: {
        titel: "Organische vormen en pijlen",
        taak: "Teken worstvormen en pijlen die naar je toe en van je af buigen. Kort: \xE9\xE9n textuurvlak mag.",
        voorbeeld: "Een worst: twee ellipsen als kapjes, verbonden met zijden. De as buigt. Een pijl: een lint dat over de pagina draait, smaller in de diepte.",
        stappen: [
          "Teken de as (een lichte curve).",
          "Zet ellipsen haaks op die as.",
          "Verbind tot een volume.",
          "Controleer: het volume draait, het is geen worst-sticker."
        ],
        templateId: "sausages"
      },
      loomis: {
        titel: "Koppen in 3/4, profiel, van onder",
        taak: "Zelfde constructie, andere camera. Nog steeds geen features.",
        voorbeeld: "Profiel: je ziet een halve bal + de kaak als L-vorm. Van onder: de kaak is groot, de schedel kleiner. 3/4: middenlijn schuift opzij.",
        stappen: [
          "Kies een stand (niet vooraan).",
          "Bal + draai-ellips.",
          "Middenlijn volgt de draai.",
          "Kaakvlak in die stand."
        ],
        templateId: "loomis-grid"
      },
      warmupIds: ["arrows", "sausages", "texture"]
    },
    {
      id: 2,
      naam: "Constructie in de wereld",
      kort: "Les 3\u20135. Planten, insecten, manikin. Geen spiermatrix.",
      waarom: "Echte onderwerpen, nog steeds vanuit masses.",
      dab: {
        titel: "Plant of insect, vanuit masses",
        taak: "Kies \xE9\xE9n onderwerp. Bouw het uit 3\u20135 grote volumes. Contour en details pas als de masses kloppen.",
        voorbeeld: "Plant: pot = cilinder, stengel = worst, blad = plat vlak dat draait. Insect: drie ovalen achter elkaar, poten als eenvoudige cilinders.",
        stappen: [
          "Schets de grootste volume eerst.",
          "Voeg 2\u20134 volumes toe.",
          "Verbind ze overtuigend.",
          "Details: max \xE9\xE9n blad of \xE9\xE9n pootgroep."
        ],
        templateId: "plants"
      },
      loomis: {
        titel: "Manikin: ribbenkorf en bekken",
        taak: "Teken een pop van volumes. Geen spieren, geen gezicht.",
        voorbeeld: "Eivorm voor de ribbenkorf, omgekeerde eivorm voor het bekken, een korte cilinder als nek, worstvormen als ledematen. De as van de ruggengraat buigt.",
        stappen: [
          "Zet de lijn van hoofd tot bekken.",
          "Ribbenkorf.",
          "Bekken, gedraaid t.o.v. de borst.",
          "Armen en benen als volumes."
        ],
        templateId: "manikin"
      },
      warmupIds: ["plants", "insects"]
    },
    {
      id: 3,
      naam: "Cilinders en harde vormen",
      kort: "250 cylinders, les 6\u20137. Dozen met ronde volumes erin.",
      waarom: "Armen, nek, bekers, gebouwen: overal cilinders in perspectief.",
      dab: {
        titel: "Cilinders in dozen of snijvormen",
        taak: "Teken dozen en zet er cilinders in, of laat twee harde vormen elkaar snijden.",
        voorbeeld: "Doos in 2-puntsperspectief. Op het voorvlak een ellips, op het achtervlak een smallere. Verbind. De as wijst naar hetzelfde verdwijnpunt als de doos.",
        stappen: [
          "Teken de doos.",
          "Teken de as.",
          "Ellips voor en achter, haaks op de as.",
          "Verbind de zijden."
        ],
        templateId: "cyl-boxes"
      },
      loomis: {
        titel: "Kop als harde vormen",
        taak: "Voorhoofd als doos, kaak als wig, nek als cilinder.",
        voorbeeld: "Niet alleen een ronde bal: hak het voorhoofd plat, de zijkanten van de schedel, de kaak als driehoekig blok. De neus-brug is een smalle doos.",
        stappen: [
          "Bal.",
          "Hak vlakken in de bal (voorhoofd, zijkant).",
          "Kaak als wig.",
          "Nekcilinder onder de schedel."
        ],
        templateId: "asaro"
      },
      warmupIds: ["cyl-boxes", "intersections"]
    },
    {
      id: 4,
      naam: "Figuur serieus",
      kort: "Korte poses, Head and Hands, Hampton-achtige gesture.",
      waarom: "Beweging eerst, anatomie later.",
      dab: {
        titel: "Gesture 1\u20132 minuten of kop+handen",
        taak: "Korte poses: vang de actielijn. Of: \xE9\xE9n kop en \xE9\xE9n hand, constructie.",
        voorbeeld: "Gesture: \xE9\xE9n S-curve van hoofd tot voet, dan de schouders-as en heupen-as gekruist. Hand: doos van de palm, cilinders voor vingers \u2014 geen nagels.",
        stappen: [
          "Actielijn in 10 seconden.",
          "Schouders en heupen.",
          "Volumes eromheen.",
          "Stop als de timer gaat \u2014 niet \u2018afmaken\u2019."
        ],
        templateId: "manikin"
      },
      loomis: {
        titel: "Kopdraaiingen, kaak meedraaien",
        taak: "Een rijtje koppen die om hun as draaien. Kaakvlak volgt.",
        voorbeeld: "Zes koppen op \xE9\xE9n blad, van links profiel naar rechts profiel, met 3/4 en vooraan ertussen. De kaak is in profiel het grootst in silhouet.",
        stappen: [
          "Zet zes ballen.",
          "Middenlijn schuift per kop.",
          "Kaak volgt.",
          "Vergelijk: klopt de draai?"
        ],
        templateId: "loomis-grid"
      },
      warmupIds: ["head-rot", "manikin"]
    },
    {
      id: 5,
      naam: "Anatomie als laag",
      kort: "E\xE9n regio per week. Eerst landmerken, dan spieren.",
      waarom: "Spieren zonder bot zijn patroon, geen vorm.",
      dab: {
        titel: "Landmerk-drill, \xE9\xE9n regio",
        taak: "Kies nek, schouder, bekken of knie. Zet de botpunten. Spieren alleen als de punten kloppen.",
        voorbeeld: "Schouder: sleutelbeen als S, acromion als hoek, kop van de humerus als bol. De deltoideus hangt daaroverheen \u2014 niet andersom.",
        stappen: [
          "Kies \xE9\xE9n regio.",
          "Teken alleen botpunten.",
          "Check spiegelsymmetrie of foto.",
          "Optioneel: \xE9\xE9n spiervolume."
        ],
        templateId: "landmarks"
      },
      loomis: {
        titel: "Kop + nek-landmerken",
        taak: "Jukbeen, oorgat, kaakhoek, sternocleidomastoideus als cilinder \u2014 geen portret.",
        voorbeeld: "Het oor zit ter hoogte van wenkbrauw tot neusbasis. De kaakhoek ligt ongeveer onder het oor. De nek steekt niet uit het midden van de kin, maar meer naar achteren.",
        stappen: [
          "Bal + kaak.",
          "Oor op de juiste hoogte.",
          "Kaakhoek.",
          "Nekcilinders naar de schouder."
        ],
        templateId: "landmarks"
      },
      warmupIds: ["landmarks"]
    },
    {
      id: 6,
      naam: "Geavanceerd portret",
      kort: "Vlakken, features, gelijkens. Assen eerst.",
      waarom: "Gelijkens komt uit verhoudingen, niet uit wimpers.",
      dab: {
        titel: "Vlakken of feature-plaatsing",
        taak: "Asaro-achtige vlakken, of: zet ogen/neus/mond op de assen \u2014 zonder rendering.",
        voorbeeld: "De ogen liggen op de helft van de kop. De neusbasis op halverwege haarlijn\u2013kin. Mond op een derde van neusbasis tot kin. Teken die lijnen \xE9\xE9rst.",
        stappen: [
          "Bal + kaak + assen.",
          "Ooglijn, neuslijn, mondlijn.",
          "Blokvormen voor features.",
          "Geen schaduw tot de plaats klopt."
        ],
        templateId: "asaro"
      },
      loomis: {
        titel: "Gelijkens: meten v\xF3\xF3r tekenen",
        taak: "Kies een foto. Meet verhoudingen. Teken constructie tot het lijkt, dan pas details.",
        voorbeeld: "Is de afstand oog\u2013oog gelijk aan \xE9\xE9n oog? Hoe ver staat het oor van de kaakhoek? Noteer drie metingen voordat je een pupil zet.",
        stappen: [
          "Drie metingen opschrijven.",
          "Constructie.",
          "Vergelijk met de foto.",
          "Pas aan. Features laat."
        ],
        templateId: "loomis-ball"
      },
      warmupIds: ["asaro"]
    },
    {
      id: 7,
      naam: "Later \u2014 licht en scene",
      kort: "Gurney, plooi, compositie. Optioneel, als de rest zit.",
      waarom: "Licht leest als grote vlakken, niet als details.",
      dab: {
        titel: "Lichtplan of plooistudie",
        taak: "E\xE9n voorwerp of een stuk stof. Drie waarden. Of: een simpele compositie in twee tonen.",
        voorbeeld: "Een beker: licht vlak, midden, kernschaduw, reflex. Geen highlights-stippen tot de drie vlakken kloppen. Plooien: hangende stof tussen twee punten, grote dalen eerst.",
        stappen: [
          "Bepaal de lichtbron.",
          "Verdeel in licht / midden / schaduw.",
          "Geen vierde toon.",
          "E\xE9n accent (randlicht) maximaal."
        ],
        templateId: "values"
      },
      loomis: {
        titel: "Kop in licht, grote vlakken",
        taak: "Zelfde constructie, nu met drie tonen. Geen pori\xEBn, geen haarstrengen.",
        voorbeeld: "Licht op voorhoofd en jukbeen, schaduw onder de wenkbrauwboog en onder de kaak. De terminator (grens licht/schaduw) volgt de vlakken, niet de contour.",
        stappen: [
          "Constructie.",
          "Lichtbron kiezen.",
          "Drie vlakken vullen.",
          "Stop. Niet \u2018realistisch maken\u2019."
        ],
        templateId: "values"
      },
      warmupIds: ["values", "folds"]
    }
  ];
  var TEMPLATES = [
    {
      id: "superimposed",
      titel: "Lijnen over elkaar",
      groep: "Warmup",
      blurb: "Rijen met begin- en eindstip. Trek 8 keer dezelfde lijn.",
      printHint: "A4 liggend of staand. Gebruik een fineliner of potlood HB."
    },
    {
      id: "ghosted",
      titel: "Ghosted lijnen",
      groep: "Warmup",
      blurb: "Losse stippenparen. E\xE9n lijn per paar, na ghosting.",
      printHint: "Niet gummen. Slechte lijn laten staan."
    },
    {
      id: "planes",
      titel: "Vlakken (ghosted planes)",
      groep: "Warmup",
      blurb: "Rechthoeken klaar. Jij zet kruis, diagonalen en eventueel ellips.",
      printHint: "Eerst de lijnen, daarna pas een ellips in het vlak."
    },
    {
      id: "table-ellipses",
      titel: "Tabel met ellipsen",
      groep: "Warmup",
      blurb: "Vakjes in drie hoogtes. Vul met 2\u20133 ellipsen die de randen raken.",
      printHint: "Ellips uit de schouder, twee of drie keer over dezelfde baan."
    },
    {
      id: "ellipses-planes",
      titel: "Ellips in het vlak",
      groep: "Warmup",
      blurb: "Vlakken met kruis. E\xE9n ellips per vlak, vier zijden raken.",
      printHint: "De ellips mag het kruis niet negeren: centrum klopt."
    },
    {
      id: "funnels",
      titel: "Trechters",
      groep: "Warmup",
      blurb: "As + twee boogzijden. Stapel ellipsen. Dichterbij ronder.",
      printHint: "Teken de ellips haaks op de as, niet \u2018mooi in het midden\u2019."
    },
    {
      id: "boxes-y",
      titel: "Dozen \u2014 Y-methode",
      groep: "Dozen",
      blurb: "Kant-en-klare Y\u2019s. Maak er dozen van. Geen vakjes meer tekenen.",
      printHint: "5\u20136 dozen per sessie. Verleng ribben naar denkbeeldige punten."
    },
    {
      id: "boxes-grid",
      titel: "Dozen \u2014 1 verdwijnpunt",
      groep: "Dozen",
      blurb: "Horizon + verdwijnpunt. Voorkanten staan klaar, jij trekt de diepte.",
      printHint: "Alle dieptelijnen naar hetzelfde punt. Liniaal mag bij de eerste keer."
    },
    {
      id: "cyl-boxes",
      titel: "Cilinders in dozen",
      groep: "Dozen",
      blurb: "Dozen in perspectief. Zet ellipsen op de kapjes.",
      printHint: "As eerst. Ellips haaks op de as."
    },
    {
      id: "intersections",
      titel: "Snijvormen",
      groep: "Dozen",
      blurb: "Twee volumes per vak. Teken waar ze elkaar snijden.",
      printHint: "Eerst beide volumes af, dan de snijlijn."
    },
    {
      id: "arrows",
      titel: "Pijlen in de ruimte",
      groep: "Warmup",
      blurb: "Lichte S-assen. Bouw er een lint omheen.",
      printHint: "Breedte blijft logisch: dichterbij dikker."
    },
    {
      id: "sausages",
      titel: "Worstvormen",
      groep: "Warmup",
      blurb: "Assen klaar. Zet kap-ellipsen en verbind.",
      printHint: "Geen puntige uiteinden \u2014 het zijn volumes."
    },
    {
      id: "loomis-ball",
      titel: "Loomis-bal",
      groep: "Kop",
      blurb: "Cirkels klaar. Zet draai-ellips, middenlijn en kaakvlak.",
      printHint: "Geen ogen. Alleen constructie."
    },
    {
      id: "loomis-grid",
      titel: "Kopdraaiingen (6 standen)",
      groep: "Kop",
      blurb: "Zes cirkels. Elke kop een andere draai, van profiel naar profiel.",
      printHint: "Kaakvlak draait mee. Features weglaten."
    },
    {
      id: "asaro",
      titel: "Gezichts-vlakken",
      groep: "Kop",
      blurb: "Lichte kopcontour. Hak grote vlakken (voorhoofd, juk, kaak).",
      printHint: "Platte vlakken, geen ronding-gokken."
    },
    {
      id: "manikin",
      titel: "Manikin-poses",
      groep: "Figuur",
      blurb: "Actielijnen klaar. Zet ribbenkorf, bekken, ledematen.",
      printHint: "2 minuten per pose. Geen spieren."
    },
    {
      id: "landmarks",
      titel: "Landmerken",
      groep: "Figuur",
      blurb: "Silhouet van schouder of bekken. Zet botpunten.",
      printHint: "E\xE9n regio. Spieren optioneel."
    },
    {
      id: "plants",
      titel: "Plant-masses",
      groep: "Figuur",
      blurb: "Pot en as klaar. Bouw stengel en blad-vlakken.",
      printHint: "Grote masses eerst."
    },
    {
      id: "insects",
      titel: "Insect-masses",
      groep: "Figuur",
      blurb: "Drie ovaal-plaatsen. Verbind kop\u2013borst\u2013achterlijf.",
      printHint: "Poten pas als de drie masses kloppen."
    },
    {
      id: "texture",
      titel: "Textuur-overgang",
      groep: "Warmup",
      blurb: "Balk van dicht naar open. Vul met \xE9\xE9n textuur.",
      printHint: "Niet krassen: denk aan vorm die herhaalt."
    },
    {
      id: "values",
      titel: "Drie tonen",
      groep: "Figuur",
      blurb: "Vakken voor licht / midden / schaduw. Vul een eenvoudige kop of beker.",
      printHint: "Geen vierde toon. Potlood 2B is genoeg."
    },
    {
      id: "folds",
      titel: "Plooigroepen",
      groep: "Figuur",
      blurb: "Twee ophangpunten. Teken de grote plooien ertussen.",
      printHint: "Eerst dalen, dan pas kleine rimpels."
    }
  ];
  function warmupById(id) {
    return WARMUPS.find((w) => w.id === id);
  }
  function trackById(id) {
    return TRACKS.find((t) => t.id === id) ?? TRACKS[0];
  }
  return __toCommonJS(data_exports);
})();
