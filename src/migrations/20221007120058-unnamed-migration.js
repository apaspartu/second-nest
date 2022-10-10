"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return await queryInterface.query(
            'CREATE TABLE public."Users" (\n' +
                "\tid uuid NOT NULL,\n" +
                "\tname varchar(255) NOT NULL,\n" +
                "\temail varchar(255) NOT NULL,\n" +
                '\t"password" varchar(255) NOT NULL,\n' +
                '\t"role" varchar(255) NULL,\n' +
                '\t"createdAt" timestamptz NOT NULL,\n' +
                '\t"updatedAt" timestamptz NOT NULL,\n' +
                "\tsessionid varchar(255) NOT NULL,\n" +
                '\tCONSTRAINT "Users_email_key" UNIQUE (email),\n' +
                '\tCONSTRAINT "Users_pkey" PRIMARY KEY (id)\n' +
                ");"
        );
    },
    async down(queryInterface, Sequelize) {
        return await queryInterface.sequelize.query(
            `DROP TABLE IF EXISTS public."Users"`
        );
    },
};
