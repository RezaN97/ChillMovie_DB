CREATE DATABASE chill_movie;
USE chill_movie;

CREATE TABLE movie (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO movie (title, description, genre)
VALUES
('Moon Knight','Menceritakan Hero Berasal dari daerah Mesir','Action'),
('Avangers','Menceritakan tentang sekelompok super hero yang bertugas menjaga keamanan di bumi','Action, Sci-FI');