'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return await queryInterface.sequelize.query(
            `CREATE TABLE public."Items" (
                \tid varchar(255) NOT NULL,
                \t"eventId" uuid NOT NULL,
                \t"createdAt" timestamptz NOT NULL,
                \t"updatedAt" timestamptz NOT NULL,
                \tCONSTRAINT "Items_pkey" PRIMARY KEY (id),
                \tCONSTRAINT "Items_fkey" FOREIGN KEY ("eventId") REFERENCES public."Events"(id) ON DELETE CASCADE
                );`
        );
    },

    async down(queryInterface, Sequelize) {
        return await queryInterface.bulkDelete('Items');
    },
};
