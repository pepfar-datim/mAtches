CREATE TABLE maps(
	id SERIAL PRIMARY KEY,
	name varchar(100) UNIQUE,
	created timestamp,
	updated timestamp,
	uid varchar(6),
	questionnaireUID varchar(100),
	complete boolean,
	map json
);

CREATE TABLE questionnaires(
	id SERIAL PRIMARY KEY,
	name varchar(100) UNIQUE,
	created timestamp,
	updated timestamp,
	uid varchar(6),
	questionnaire json
);