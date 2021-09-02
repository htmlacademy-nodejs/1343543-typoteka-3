INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
('hannibal@a-team.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'John', 'Smith', 'avatar-1.jpg'),
('face@a-team.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Templeton', 'Peck', 'avatar-2.jpg'),
('b.a@a-team.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Bosco', 'Baracus', 'avatar-2.jpg'),
('howling.mad@a-team.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'H.M.', 'Murdock', 'avatar-2.jpg');

INSERT INTO categories(name) VALUES
('Животные'),
('Игры'),
('Разное');

ALTER TABLE articles DISABLE TRIGGER ALL;

INSERT INTO articles(title, announce, full_text, picture, user_id) VALUES
('Куплю гараж', 'Куплю гараж, чтобы держать там крокодила', 'Крокодил веселый, зеленый, поёт песни дурным голосом', 'image1.jpg', 1),
('Продам гараж', 'Продам гараж, где можно держать крокодила', 'Гараж просторный, широкий идеальной крокодиловой формы', 'image2.jpg', 2),
('Куплю крокодила', 'Куплю крокодила, чтобы держать в гараже', 'Крокодил непьющий, умеющий играть в домино, приятный собеседник', 'image3.jpg', 3),
('Продам крокодила', 'Продам крокодила, которого можно держать в гараже', 'Крокодил весёлый, зелёный, поёт песни приятным голосом','image4.jpg', 4);

ALTER TABLE articles ENABLE TRIGGER ALL;

ALTER TABLE article_categories DISABLE TRIGGER ALL;

INSERT INTO article_categories(article_id, category_id) VALUES
(1, 1),
(1, 2),
(2, 3),
(2, 2),
(3, 1),
(4, 1),
(4, 3);

ALTER TABLE article_categories ENABLE TRIGGER ALL;

ALTER TABLE comments DISABLE TRIGGER ALL;

INSERT INTO COMMENTS(text, user_id, article_id) VALUES
('Купи мой гараж', 2, 1),
('Купи, кому говорю', 2, 1),
('Плохой гараж', 4, 2),
('Не куплю', 1, 2),
('Купи крокодила', 3, 3),
('Отличный крокодил', 1, 3),
('Не куплю крокодила', 2, 4),
('Дрянной крокодил', 2, 4),
('Пожалей крокодила', 1, 5),
('Держать негде', 2, 5);

ALTER TABLE comments ENABLE TRIGGER ALL;
