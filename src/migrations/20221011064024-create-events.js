'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return await queryInterface.sequelize.query(
            `CREATE TABLE public."Events" (
                \tid uuid NOT NULL,
                \t"userId" uuid NOT NULL,
                \tauthor varchar(255) NULL,
                \temail varchar(255) NULL,
                \tdescription text NULL,
                \tcolor varchar(255) NULL,
                \t"createdAt" timestamptz NOT NULL,
                \t"updatedAt" timestamptz NOT NULL,
                \ttitle varchar(255) NULL,
                \t"isCompleted" bool NOT NULL DEFAULT false,
                \tCONSTRAINT "Events_pkey" PRIMARY KEY (id)
                );`
        );
    },

    async down(queryInterface, Sequelize) {
        return await queryInterface.bulkDelete('Events');
    },
};
