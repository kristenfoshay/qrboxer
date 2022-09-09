\echo 'Delete and recreate qrboxer db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE qrboxer;
CREATE DATABASE qrboxer;
\connect qrboxer

\i qrboxer-schema.sql

\echo 'Delete and recreate qrboxer_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE qrboxer_test;
CREATE DATABASE qrboxer_test;
\connect qrboxer_test

\i qrboxer-schema.sql