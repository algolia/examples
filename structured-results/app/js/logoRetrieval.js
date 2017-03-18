const https = require('https');
const algoliasearch = require('algoliasearch');

const logos = [
  'Samsung',
  'Insignia',
  'Apple',
  'Sony',
  'Metra',
  'HP',
  'Dynex',
  'LG',
  'Speck',
  'Canon',
  'Logitech',
  'OtterBox',
  'Frigidaire',
  'PNY',
  'Belkin',
  'Platinum',
  'GE',
  'Modal',
  'Microsoft',
  'Epson',
  'Griffin Technology',
  'kate spade new york',
  'SanDisk',
  'Bose',
  'Rocketfish',
  'Nikon',
  'Asus',
  'Garmin',
  'mophie',
  'Targus',
  'LifeProof',
  'Brother',
  'Beats by Dr. Dre',
  'Energizer',
  'Keurig',
  'Isaac Mizrahi',
  'Incase',
  'Lenovo',
  'Dell',
  'AudioQuest',
  'NETGEAR',
  'DigiPower',
  'Monster',
  'Case-Mate',
  'KitchenAid',
  'Panasonic',
  'Skullcandy',
  'Hamilton Beach',
  'Lowepro',
  'Motorola',
  'Conair',
  'Kicker',
  'Nanette Lepore',
  'Cuisinart',
  'GoPro',
  'Seagate',
  'Pioneer',
  'Fitbit',
  'JBL',
  'Case Logic',
  'Insignia',
  'Sharp',
  'SodaStream',
  'Memorex',
  'Bosch',
  'Best Buy',
  'LeapFrog',
  'Sanus',
  'Bowers & Wilkins',
  'Honeywell',
  'JVC',
  'Kenwood',
  'Lenmar',
  'Ballistic',
  'Rayovac',
  'BISSELL',
  'Dyson',
  'Jensen',
  'Scosche',
  'Hoover',
  'Contigo',
  'Jam',
  'Amazon',
  'Razer',
  'Studio C',
  'ADOPTED',
  'Definitive Technology',
  'Philips',
  'Alpine',
  'Fujifilm',
  'myCharge',
  'LUNATIK',
  'Native Union',
  'Acer',
  'Bower',
  'Duracell',
  'EMTEC',
  'Oster',
  'Polk Audio',
];

const logoObjects = [];
const client = algoliasearch('VC519DRAY3', '1cf1ee243804bd1eba6cad805049cf6e');
const index = client.initIndex('altCorrecTest_logos');

logos.map(logo => {
  const obj = {};

  https.get(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${logo}`, res => {
    let data = '';
    res.on('data', body => {
      data += body;
    });

    res.on('end', () => {
      const responseObject = JSON.parse(data)[0];
      logoObjects.push({name: logo, url: responseObject.logo});
      if (logoObjects.length === logos.length) {
        console.log(logoObjects);

        index.addObjects(logoObjects);
      }
    });
  });
});
