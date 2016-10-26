-- Open Growth DB
CREATE DATABASE IF NOT EXISTS opengrowth
    DEFAULT CHARACTER SET utf8
    DEFAULT COLLATE utf8_general_ci;

-- Signals
-- Meaningful customer activity log
CREATE TABLE IF NOT EXISTS signals (
    id      INTEGER PRIMARY KEY ASC AUTOINCREMENT
,   created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
,   name    VARCHAR(100) NOT NULL
,   email   VARCHAR(120) NOT NULL
,   expert  VARCHAR(120)
);
CREATE INDEX        signal_created ON signals(created);
CREATE INDEX        signal_name    ON signals(name);
CREATE INDEX        signal_email   ON signals(email);
CREATE INDEX        signal_expert  ON signals(expert);
CREATE UNIQUE INDEX signal_id      ON signals(id);

-- Signals 3 Store
-- Meta data from a signal.
CREATE TABLE IF NOT EXISTS signals3store (
    created    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
,   signal_id  INTEGER
,   email      VARCHAR(120) NOT NULL
,   predicate  VARCHAR(100) NOT NULL
,   object     VARCHAR(100) NOT NULL
);
CREATE INDEX signal_created          ON signals3store(created);
CREATE INDEX signal_signal_id        ON signals3store(signal_id);
CREATE INDEX signal_email            ON signals3store(email);
CREATE INDEX signal_predicate        ON signals3store(predicate);
CREATE INDEX signal_object           ON signals3store(object);
CREATE INDEX signal_email_predicate  ON signals3store(email,predicate);
CREATE INDEX signal_signal_predicate ON signals3store(signal_id,predicate);

-- Delights
-- Sending an email, sms, tweet, etc.
CREATE TABLE IF NOT EXISTS delights (
    id        INTEGER PRIMARY KEY ASC AUTOINCREMENT
,   created   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
,   name      VARCHAR(100) NOT NULL
,   message   TEXT
,   signal_id INTEGER
,   FOREIGN KEY (signal_id) REFERENCES signals(id)
);
CREATE INDEX        delight_created ON delights(created);
CREATE INDEX        delight_name    ON delights(name);
CREATE UNIQUE INDEX delight_id      ON delights(id);

-- Reactions
-- Customer clicks a CTA and requests to connect.
CREATE TABLE IF NOT EXISTS reactions (
    id         INTEGER PRIMARY KEY ASC AUTOINCREMENT
,   created    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
,   signal     VARCHAR(100) NOT NULL
,   delight    VARCHAR(100) NOT NULL
,   signal_id  INTEGER
,   delight_id INTEGER
,   FOREIGN KEY (signal_id) REFERENCES signals(id)
,   FOREIGN KEY (delight_id) REFERENCES delights(id)
);
CREATE INDEX        reaction_created ON reactions(created);
CREATE UNIQUE INDEX reaction_id      ON reactions(id);
