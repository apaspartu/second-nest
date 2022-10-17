'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return await queryInterface.sequelize.query(
            `CREATE TABLE public."Events" (
                id uuid NOT NULL,
                "userId" uuid NOT NULL,
                description text NULL,
                color varchar(255) NULL,
                "createdAt" timestamptz NOT NULL,
                "updatedAt" timestamptz NOT NULL,
                title varchar(255) NULL,
                "isCompleted" bool NOT NULL DEFAULT false,
                CONSTRAINT "Events_pkey" PRIMARY KEY (id),
                CONSTRAINT events_fk FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON DELETE CASCADE
                );`
        );
    },

    async down(queryInterface, Sequelize) {
        return await queryInterface.sequelize.query(
            `DROP TABLE IF EXISTS public."Events";`
        );
    },
};
