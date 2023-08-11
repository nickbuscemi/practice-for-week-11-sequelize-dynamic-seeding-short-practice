'use strict';

const { Op } = require('sequelize');

const musicianInstruments = [
  {
    musician: { firstName: 'Adam', lastName: 'Appleby' },
    instruments: [{ type: 'piano' }, { type: 'guitar' }]
  },
  {
    musician: { firstName: 'Anton', lastName: 'Martinovic' },
    instruments: [{ type: 'piano' }, { type: 'bass' }]
  },
  {
    musician: { firstName: 'Wilson', lastName: 'Holt' },
    instruments: [{ type: 'cello' }]
  },
  {
    musician: { firstName: 'Marine', lastName: 'Sweet' },
    instruments: [{ type: 'saxophone' }]
  },
  {
    musician: { firstName: 'Georgette', lastName: 'Kubo' },
    instruments: [{ type: 'drums' }, { type: 'trumpet' }, { type: 'saxophone' }]
  },
  {
    musician: { firstName: 'Aurora', lastName: 'Hase' },
    instruments: [{ type: 'violin' }, { type: 'cello' }]
  },
  {
    musician: { firstName: 'Trenton', lastName: 'Lesley' },
    instruments: [{ type: 'piano' }]
  },
  {
    musician: { firstName: 'Camila', lastName: 'Nenci' },
    instruments: [{ type: 'piano' }]
  },
  {
    musician: { firstName: 'Rosemarie', lastName: 'Affini' },
    instruments: [{ type: 'piano' }, { type: 'violin' }]
  },
  {
    musician: { firstName: 'Victoria', lastName: 'Cremonesi' },
    instruments: [{ type: 'violin' }]
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    for (const { musician, instruments } of musicianInstruments) {
      // Find the musician
      const foundMusician = await queryInterface.sequelize.models.Musician.findOne({ where: musician });

      // Find all the instruments
      const instrumentTypes = instruments.map(instrument => instrument.type);
      const foundInstruments = await queryInterface.sequelize.models.Instrument.findAll({
        where: {
          type: { [Op.in]: instrumentTypes }
        }
      });

      // Use Sequelize's association method to create the join table entries
      await foundMusician.addInstruments(foundInstruments);
    }
  },

  async down (queryInterface, Sequelize) {
    for (const { musician, instruments } of musicianInstruments) {
      const foundMusician = await queryInterface.sequelize.models.Musician.findOne({ where: musician });
      const instrumentTypes = instruments.map(instrument => instrument.type);
      const foundInstruments = await queryInterface.sequelize.models.Instrument.findAll({
        where: {
          type: { [Op.in]: instrumentTypes }
        }
      });

      // Remove the association
      await foundMusician.removeInstruments(foundInstruments);
    }
  }
};
