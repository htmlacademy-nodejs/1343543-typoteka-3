-- Получает список всех категорий

SELECT * FROM categories

-- Получает список непустых категорий

SELECT id, name FROM categories
  JOIN article_categories
  ON id = category_id
  GROUP BY id

-- Получает список категорий с количеством публикаций

SELECT id, name, count(article_id) FROM categories
  LEFT JOIN article_categories
  ON id = category_id
  GROUP BY id

-- Сводная таблица публикаций

SELECT articles.*,
  COUNT(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
  users.first_name,
  users.last_name,
  users.email
FROM articles
  JOIN article_categories ON articles.id = article_categories.article_id
  JOIN categories ON article_categories.category_id = categories.id
  LEFT JOIN comments ON comments.article_id = articles.id
  JOIN users ON users.id = articles.user_id
  GROUP BY articles.id, users.id
  ORDER BY articles.created_at DESC

  -- Пять свежих комментариев

SELECT
  comments.id,
  comments.article_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
  ORDER BY comments.created_at DESC
  LIMIT 5

-- Получает комментарии к первой статье

SELECT
  comments.id,
  comments.article_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
WHERE comments.article_id = 1
  ORDER BY comments.created_at DESC

-- Обновляет первый комментарий

UPDATE articles
SET title = 'Как я встретил Новый год!'
WHERE id = 1
