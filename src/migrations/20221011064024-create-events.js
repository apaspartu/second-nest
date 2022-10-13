'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return await queryInterface.sequelize.query(
            `CREATE TABLE IF NOT EXISTS public."Events" (
                id uuid NOT NULL,
                "userId" uuid NOT NULL,
                author varchar(255) NULL,
                email varchar(255) NULL,
                description text NULL,
                color varchar(255) NULL,
                "createdAt" timestamptz NOT NULL,
                "updatedAt" timestamptz NOT NULL,
                title varchar(255) NULL,
                "isCompleted" bool NOT NULL DEFAULT false,
                CONSTRAINT "Events_pkey" PRIMARY KEY (id)
);`
        );
    },

    async down(queryInterface, Sequelize) {
        return await queryInterface.bulkDelete('Events');
    },
};
