"use strict"; 
import { EntitySchema } from "typeorm";

const TemplateSchema = new EntitySchema({
  name: "Template",
  tableName: "templates",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    descripcion: {
      type: "text",
      nullable: false,
    },
    lenguaje: {
      type: "varchar",
      nullable: false,
    },
    categoria: {
      type: "varchar",
      nullable: false,
    },

    tags: {
        type: "simple-array",
        nullable: false,
    },
    
    createdAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },

    updatedAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },
  relations: {
    templateFiles: {
      type: "one-to-many",
      target: "TemplateFile",
      inverseSide: "template",
      cascade: true,
    },
  },
});

export default TemplateSchema;
