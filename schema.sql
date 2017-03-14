-- Open Growth DB
CREATE DATABASE IF NOT EXISTS opengrowth
    DEFAULT CHARACTER SET utf8
    DEFAULT COLLATE utf8_general_ci;

-- Signals
-- Meaningful customer activity log
CREATE TABLE IF NOT EXISTS opengrowth.signals (
    id      INTEGER PRIMARY KEY AUTO_INCREMENT
,   created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
,   name    VARCHAR(100) NOT NULL
,   email   VARCHAR(120)
,   expert  VARCHAR(120)
);
CREATE INDEX        signal_created ON opengrowth.signals(created);
CREATE INDEX        signal_name    ON opengrowth.signals(name);
CREATE INDEX        signal_email   ON opengrowth.signals(email);
CREATE INDEX        signal_expert  ON opengrowth.signals(expert);
CREATE UNIQUE INDEX signal_id      ON opengrowth.signals(id);

-- Signals 3 Store
-- Meta data from a signal
CREATE TABLE IF NOT EXISTS opengrowth.signals_3store (
    created    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
,   email      VARCHAR(120) NOT NULL
,   predicate  VARCHAR(100) NOT NULL
,   object     VARCHAR(100) NOT NULL
);
CREATE INDEX signal_created          ON opengrowth.signals_3store(created);
CREATE INDEX signal_email            ON opengrowth.signals_3store(email);
CREATE INDEX signal_predicate        ON opengrowth.signals_3store(predicate);
CREATE INDEX signal_object           ON opengrowth.signals_3store(object);
CREATE INDEX signal_email_predicate  ON opengrowth.signals_3store(email,predicate);

-- Delights
-- Sending an email, sms, tweet, etc
CREATE TABLE IF NOT EXISTS opengrowth.delights (
    id        INTEGER PRIMARY KEY AUTO_INCREMENT
,   created   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
,   name      VARCHAR(100) NOT NULL
,   email     VARCHAR(120) NOT NULL
,   contact   VARCHAR(120)
,   message   TEXT
);
CREATE INDEX        delight_created ON opengrowth.delights(created);
CREATE INDEX        delight_contact ON opengrowth.delights(contact);
CREATE INDEX        delight_name    ON opengrowth.delights(name);
CREATE UNIQUE INDEX delight_id      ON opengrowth.delights(id);

-- Reactions
-- Customer clicks a CTA and requests to connect
CREATE TABLE IF NOT EXISTS opengrowth.reactions (
    id           INTEGER PRIMARY KEY AUTO_INCREMENT
,   created      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
,   contact      VARCHAR(120) NOT NULL     
,   signal_name  VARCHAR(100) NOT NULL
,   delight_name VARCHAR(100) NOT NULL
,   type         VARCHAR(100)
,   message      VARCHAR(200)
);
CREATE INDEX        reaction_created ON opengrowth.reactions(created);
CREATE UNIQUE INDEX reaction_id      ON opengrowth.reactions(id);