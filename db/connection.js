const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

const config =
  ENV === 'production'
    ? {
        connectionString: 'process.env.postgres://dvtulucluagpkb:db46fcb72e69322245141d6407ba5edcb250c00584affe76d0528c29275eddd9@ec2-34-201-95-176.compute-1.amazonaws.com:5432/deg0ri4anodfqc',
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {};

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE or DATABASE_URL not set');
}

module.exports = new Pool(config);
