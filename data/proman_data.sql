ALTER TABLE IF EXISTS ONLY public.boards DROP CONSTRAINT IF EXISTS pk_boards_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.cards DROP CONSTRAINT IF EXISTS pk_cards_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.statuses DROP CONSTRAINT IF EXISTS pk_statuses_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS pk_user_id CASCADE;

DROP TABLE IF EXISTS public.users CASCADE;
DROP SEQUENCE IF EXISTS public.users_id_seq;
CREATE TABLE users (
    id serial NOT NULL,
    username varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    PRIMARY KEY (id)
);


DROP TABLE IF EXISTS public.boards CASCADE;
DROP SEQUENCE IF EXISTS public.boards_id_seq;
CREATE TABLE boards (
  id serial NOT NULL,
  title text,
PRIMARY KEY (id)
);


DROP TABLE IF EXISTS public.cards CASCADE;
DROP SEQUENCE IF EXISTS public.cards_id_seq;
CREATE TABLE cards (
  id serial NOT NULL,
  board_id integer,
  title text,
  statuses_id integer,
  card_order integer,
PRIMARY KEY (id)
);


DROP TABLE IF EXISTS public.statuses CASCADE;
DROP SEQUENCE IF EXISTS public.statuses_id_seq;
CREATE TABLE statuses (
  id serial NOT NULL,
  title text,
  board_id integer,
PRIMARY KEY (id)
);


INSERT INTO boards (title) VALUES ('Board 1');
INSERT INTO boards (title) VALUES ('Board 2');
SELECT pg_catalog.setval('boards_id_seq', 2, true);


INSERT INTO cards VALUES (1, 1, 'new card 1', 1, 0);
INSERT INTO cards VALUES (2, 1, 'new card 1', 1, 1);
INSERT INTO cards VALUES (3, 1, 'in progress card', 2, 0);
INSERT INTO cards VALUES (4, 1, 'planning', 3, 0);
INSERT INTO cards VALUES (5, 1, 'done card 1', 4, 0);
INSERT INTO cards VALUES (6, 1, 'done card 1', 4, 1);
INSERT INTO cards VALUES (7, 2, 'new card 1', 1, 0);
INSERT INTO cards VALUES (8, 2, 'new card 2', 1, 1);
INSERT INTO cards VALUES (9, 2, 'in progress card', 2, 0);
INSERT INTO cards VALUES (10, 2, 'planning', 3, 0);
INSERT INTO cards VALUES (11, 2, 'done card 1', 4, 0);
INSERT INTO cards VALUES (12, 2, 'new card 1', 1, 1);
SELECT pg_catalog.setval('cards_id_seq', 12, true);


INSERT INTO statuses VALUES (1, 'new', 1);
INSERT INTO statuses VALUES (2, 'in progress', 1);
INSERT INTO statuses VALUES (3, 'testing', 1);
INSERT INTO statuses VALUES (4, 'done', 1);
INSERT INTO statuses VALUES (5, 'new', 2);
INSERT INTO statuses VALUES (6, 'in progress', 2);
INSERT INTO statuses VALUES (7, 'testing', 2);
INSERT INTO statuses VALUES (8, 'done', 2);
SELECT pg_catalog.setval('statuses_id_seq', 8, true);


ALTER TABLE ONLY cards
    ADD CONSTRAINT pk_boards_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;


ALTER TABLE ONLY cards
    ADD CONSTRAINT pk_statuses_id FOREIGN KEY (statuses_id) REFERENCES statuses(id) ON DELETE CASCADE;


ALTER TABLE ONLY statuses
    ADD CONSTRAINT pk_boards_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;