'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return await queryInterface.sequelize.query(
            `CREATE TABLE IF NOT EXISTS public."Users" (
            id uuid NOT NULL,
            name varchar(255) NOT NULL,
            email varchar(255) NOT NULL,
            password varchar(255) NOT NULL,
            "role" varchar(255) NULL,
            "createdAt" timestamptz NOT NULL,
            "updatedAt" timestamptz NOT NULL,
            "sessionId" varchar(255) NOT NULL,
            CONSTRAINT "Users_email_key" UNIQUE (email),
            CONSTRAINT "Users_pkey" PRIMARY KEY (id)
            );`
        );
    },
    async down(queryInterface, Sequelize) {
        return await queryInterface.sequelize.query(
            `DROP TABLE IF EXISTS public."Users"`
        );
    },
};
