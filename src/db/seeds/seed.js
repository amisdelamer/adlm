const uuid = require('uuid');

const levels = [
  {
    id: uuid.v4(),
    name: 'Niveau 1',
    shortname: 'N1',
    supervisedDepth: 20,
    independentDepth: 0,
    description: '',
  },
  {
    id: uuid.v4(),
    name: 'Niveau 2',
    shortname: 'N2',
    supervisedDepth: 40,
    independentDepth: 20,
    description: '',
  },
  {
    id: uuid.v4(),
    name: 'Niveau 3',
    shortname: 'N3',
    supervisedDepth: 60,
    independentDepth: 60,
    description: '',
  },
  {
    id: uuid.v4(),
    name: 'Niveau 4',
    shortname: 'N4',
    supervisedDepth: 60,
    independentDepth: 60,
    description: '',
  },
  {
    id: uuid.v4(),
    name: 'Niveau 5',
    shortname: 'N5',
    supervisedDepth: 60,
    independentDepth: 60,
    description: '',
  },
  {
    id: uuid.v4(),
    name: 'RIFAP',
    shortname: 'RIFAP',
    supervisedDepth: 0,
    independentDepth: 0,
    description: '',
  },
  {
    id: uuid.v4(),
    name: 'Nitrox Simple',
    shortname: 'Nx Simple',
    supervisedDepth: 0,
    independentDepth: 0,
    description: '',
  },
  {
    id: uuid.v4(),
    name: 'Nitrox Confirmé',
    shortname: 'Nx Confirmé',
    supervisedDepth: 0,
    independentDepth: 0,
    description: '',
  },
  {
    id: uuid.v4(),
    name: 'Initiateur',
    shortname: 'Init',
    supervisedDepth: 0,
    independentDepth: 0,
    description: '',
  },
  {
    id: uuid.v4(),
    name: 'Moniteur Fédéral 1',
    shortname: 'MF1',
    supervisedDepth: 0,
    independentDepth: 0,
    description: '',
  },
  {
    id: uuid.v4(),
    name: 'Moniteur Fédéral 2',
    shortname: 'MF2',
    supervisedDepth: 0,
    independentDepth: 0,
    description: '',
  },
  {
    id: uuid.v4(),
    name: 'Biologie 1',
    shortname: 'Bio1',
    supervisedDepth: 0,
    independentDepth: 0,
    description: '',
  },
  {
    id: uuid.v4(),
    name: 'Biologie 2',
    shortname: 'Bio2',
    supervisedDepth: 0,
    independentDepth: 0,
    description: '',
  },
];

function diverStatus(knex) {
  return knex('DiverStatus')
    .del()
    .then(function() {
      return knex('DiverStatus').insert([
        { value: 'LEADER' },
        { value: 'MEMBER' },
        { value: 'FOLLOWER' },
      ]);
    });
}

function divingTeamKind(knex) {
  return knex('DivingTeamKind')
    .del()
    .then(function() {
      return knex('DivingTeamKind').insert([
        { value: 'EXPLORATION' },
        { value: 'FORMATION' },
      ]);
    });
}

function divingSessionKind(knex) {
  return knex('DivingSessionKind')
    .del()
    .then(function() {
      return knex('DivingSessionKind').insert([
        { value: 'BEACH' },
        { value: 'BOAT' },
      ]);
    });
}

function vehicleKind(knex) {
  return knex('VehicleKind')
    .del()
    .then(function() {
      return knex('VehicleKind').insert([{ value: 'CAR' }, { value: 'TRUCK' }]);
    });
}

function level(knex) {
  return knex('Level')
    .del()
    .then(function() {
      return knex('Level').insert(levels);
    });
}

function settings(knex) {
  return knex('Settings').insert([
    {
      id: uuid.v4(),
      googleMapsApiKey: '',
      levelN1Id: levels[0].id,
      levelN2Id: levels[1].id,
      levelN3Id: levels[2].id,
      levelN4Id: levels[3].id,
      levelN5Id: levels[4].id,
      levelRifapId: levels[5].id,
      levelNitroxSimpleId: levels[6].id,
      levelNitroxComplexId: levels[7].id,
      levelInitId: levels[8].id,
      levelMF1Id: levels[9].id,
      levelMF2Id: levels[10].id,
      levelBio1Id: levels[11].id,
      levelBio2Id: levels[12].id,
    },
  ]);
}

function users(knex) {
  return knex('User')
    .del()
    .then(function() {
      return knex('User').insert([
        {
          id: uuid.v4(),
          firstName: 'Admin',
          lastName: 'ADLM',
          email: 'admin@adlm.org',
          password: 'adlm',
          phone: '0612345678',
          birthdate: new Date(),
          birthplace: 'Somewhere',
          addressStreet: '1 Alles Jean Jaures',
          addressZipcode: '31000',
          addressCity: 'Toulouse',
          isUPS: false,
          deleteMedicalRecord: true,
          isAspirinAllergic: false,
          isAdmin: true,
          sessionToken: uuid.v4(),
        },
      ]);
    });
}

exports.seed = function(knex, Promise) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('No seed in production');
  }
  return knex('Settings')
    .del()
    .then(() => diverStatus(knex))
    .then(() => divingTeamKind(knex))
    .then(() => divingSessionKind(knex))
    .then(() => vehicleKind(knex))
    .then(() => level(knex))
    .then(() => settings(knex))
    .then(() => users(knex));
};
