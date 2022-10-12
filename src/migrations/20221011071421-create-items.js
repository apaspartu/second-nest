'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return await queryInterface.sequelize.query(
            `CREATE TABLE public."Items" (
                id varchar(255) NOT NULL,
                "eventId" uuid NOT NULL,
                "createdAt" timestamptz NOT NULL,
                "updatedAt" timestamptz NOT NULL,
                CONSTRAINT "Items_pkey" PRIMARY KEY (id),
                CONSTRAINT "Items_fkey" FOREIGN KEY ("eventId") REFERENCES public."Events"(id) ON DELETE CASCADE
                );`
        );
    },

    async down(queryInterface, Sequelize) {
        return await queryInterface.bulkDelete('Items');
    },
};
