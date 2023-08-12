DROP DATABASE IF EXISTS lol_mood_db;

CREATE DATABASE lol_mood_db;
use lol_mood_db;


CREATE TABLE account (
  id int AUTO_INCREMENT,
  puuid varchar(96) UNIQUE NOT NULL,
  name varchar(64) NOT NULL DEFAULT "",
  level int NOT NULL DEFAULT 0,
  profileIconId int NOT NULL DEFAULT 0,
  grade VARCHAR(12) NOT NULL DEFAULT "",
  tier VARCHAR(4) NOT NULL DEFAULT "",
  lp int NOT NULL DEFAULT 0,
  games int NOT NULL DEFAULT 0,
  wins int NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
);

CREATE TABLE game (
  id int AUTO_INCREMENT,
  identifier varchar(32) UNIQUE NOT NULL,

  PRIMARY KEY (id)
);

CREATE TABLE champ (
  id int AUTO_INCREMENT,
  name varchar(64) UNIQUE NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE asset (
  id int AUTO_INCREMENT,
  identifier int UNIQUE NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE positioning  (
  id int AUTO_INCREMENT,
  lane varchar(64) UNIQUE NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE game_info (
  gameId int NOT NULL,
  accountId int NOT NULL,
  champId int NOT NULL,
  positioningId int NOT NULL,


  win boolean NOT NULL,
  kills int,
  deaths int,
  assists int,
  multikills tinyint,
  skillsOrder VARCHAR(18),
  evolvesOrder VARCHAR(4),


  primaryStyleId int NOT NULL,
  subStyleId int NOT NULL,
  perkId int NOT NULL,

  runeId0 int NOT NULL,
  runeId1 int NOT NULL,
  runeId2 int NOT NULL,
  runeId3 int NOT NULL,
  runeId4 int NOT NULL,

  statsModId0 int NOT NULL,
  statsModId1 int NOT NULL,
  statsModId2 int NOT NULL,

  summonerId0 int NOT NULL,
  summonerId1 int NOT NULL,


  itemId0 int,
  itemId1 int,
  itemId2 int,
  itemId3 int,
  itemId4 int,
  itemId5 int,

  startItemId0 int,
  startItemId1 int,
  startItemId2 int,
  startItemId3 int,
  startItemId4 int,
  startItemId5 int,
  startItemId6 int,

  completedItemId0 int,
  completedItemId1 int,
  completedItemId2 int,
  completedItemId3 int,
  completedItemId4 int,
  completedItemId5 int,


  PRIMARY KEY (gameId, accountId),

  FOREIGN KEY(gameId) REFERENCES game(id),
  FOREIGN KEY(accountId) REFERENCES account(id),
  FOREIGN KEY(champId) REFERENCES champ(id),
  FOREIGN KEY(positioningId) REFERENCES positioning(id),

  FOREIGN KEY(primaryStyleId) REFERENCES asset(id),
  FOREIGN KEY(subStyleId) REFERENCES asset(id),
  FOREIGN KEY(perkId) REFERENCES asset(id),

  FOREIGN KEY(runeId0) REFERENCES asset(id),
  FOREIGN KEY(runeId1) REFERENCES asset(id),
  FOREIGN KEY(runeId2) REFERENCES asset(id),
  FOREIGN KEY(runeId3) REFERENCES asset(id),
  FOREIGN KEY(runeId4) REFERENCES asset(id),

  FOREIGN KEY(statsModId0) REFERENCES asset(id),
  FOREIGN KEY(statsModId1) REFERENCES asset(id),
  FOREIGN KEY(statsModId2) REFERENCES asset(id),

  FOREIGN KEY(summonerId0) REFERENCES asset(id),
  FOREIGN KEY(summonerId1) REFERENCES asset(id),

  FOREIGN KEY(itemId0) REFERENCES asset(id),
  FOREIGN KEY(itemId1) REFERENCES asset(id),
  FOREIGN KEY(itemId2) REFERENCES asset(id),
  FOREIGN KEY(itemId3) REFERENCES asset(id),
  FOREIGN KEY(itemId4) REFERENCES asset(id),
  FOREIGN KEY(itemId5) REFERENCES asset(id),

  FOREIGN KEY (startItemId0) REFERENCES asset(id),
  FOREIGN KEY (startItemId1) REFERENCES asset(id),
  FOREIGN KEY (startItemId2) REFERENCES asset(id),
  FOREIGN KEY (startItemId3) REFERENCES asset(id),
  FOREIGN KEY (startItemId4) REFERENCES asset(id),
  FOREIGN KEY (startItemId5) REFERENCES asset(id),

  FOREIGN KEY (completedItemId0) REFERENCES asset(id),
  FOREIGN KEY (completedItemId1) REFERENCES asset(id),
  FOREIGN KEY (completedItemId2) REFERENCES asset(id),
  FOREIGN KEY (completedItemId3) REFERENCES asset(id),
  FOREIGN KEY (completedItemId4) REFERENCES asset(id),
  FOREIGN KEY (completedItemId5) REFERENCES asset(id)
);