-- Executado uma única vez, na criação do volume do Postgres local.
-- Também é aplicado no CI antes das migrations.
--
-- Modelo de menor privilégio:
--   app_migrator -> dono do schema; usado apenas por migrations (DDL).
--   app_runtime  -> usado pela API; apenas DML, sem DDL e sem BYPASSRLS.
--
-- Separar as roles é o que permite que Row Level Security tenha efeito:
-- o dono das tabelas e superusuários ignoram RLS por padrão.
-- Senhas abaixo valem somente para desenvolvimento local e CI.

CREATE ROLE app_migrator LOGIN PASSWORD 'migrator_dev';
CREATE ROLE app_runtime  LOGIN PASSWORD 'runtime_dev' NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS;

CREATE DATABASE seller_dev  OWNER app_migrator;
CREATE DATABASE seller_test OWNER app_migrator;

REVOKE ALL ON DATABASE seller_dev  FROM PUBLIC;
REVOKE ALL ON DATABASE seller_test FROM PUBLIC;
GRANT CONNECT ON DATABASE seller_dev  TO app_runtime;
GRANT CONNECT ON DATABASE seller_test TO app_runtime;

\connect seller_dev
ALTER SCHEMA public OWNER TO app_migrator;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO app_runtime;
ALTER DEFAULT PRIVILEGES FOR ROLE app_migrator IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_runtime;
ALTER DEFAULT PRIVILEGES FOR ROLE app_migrator IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO app_runtime;

\connect seller_test
ALTER SCHEMA public OWNER TO app_migrator;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO app_runtime;
ALTER DEFAULT PRIVILEGES FOR ROLE app_migrator IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_runtime;
ALTER DEFAULT PRIVILEGES FOR ROLE app_migrator IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO app_runtime;
