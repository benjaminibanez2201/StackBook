"use strict";
import { EntitySchema } from "typeorm";

const TemplateFileSchema = new EntitySchema({
  name: "TemplateFile",
  tableName: "templateFiles",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    fileName: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    content: {
      type: "text",
      nullable: false,
    },
    type: {
      type: "varchar",
      length: 20,
      nullable: false,
    },
 
  },
  relations: {
    template: {
      type: "many-to-one",
      target: "Template",
      inverseSide: "templateFiles",
      joinColumn: {
        name: "templateId",
      },
      onDelete: "CASCADE",
    },
  },
});

export default TemplateFileSchema;
