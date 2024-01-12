-- 1.shopdev_user
DROP TABLE IF EXISTS `shopdev_user`;
CREATE TABLE `shopdev_user` (
 user_id int NOT NULL AUTO_INCREMENT COMMENT 'user id',
 user_name VARCHAR(255) NULL DEFAULT NULL COMMENT 'user name',
 user_email VARCHAR(255) NULL DEFAULT NULL COMMENT 'email user',
 PRIMARY KEY (`user_id`)
) ENGINE = INNODB CHARACTER SET = utf8mb4;

-- run mock DATA
INSERT INTO shopdev_user VALUES(1, 'admin', 'admin@anonystick.com');
INSERT INTO shopdev_user VALUES(2, 'shop', 'shop@anonystick.com');
INSERT INTO shopdev_user VALUES(3, 'user', 'user@anonystick.com');


-- 2.shopdev_role
DROP TABLE IF EXISTS `shopdev_role`;
CREATE TABLE `shopdev_role` (
 role_id int NOT NULL COMMENT 'role id',
 role_name VARCHAR(255) NULL DEFAULT NULL COMMENT 'role name',
 role_description VARCHAR(255) NULL DEFAULT NULL COMMENT 'role description',
 PRIMARY KEY (`role_id`)
) ENGINE = INNODB CHARACTER SET = utf8mb4;

-- run mock DATA

INSERT INTO shopdev_role VALUES(1, 'admin', 'read,update,delete,create');
INSERT INTO shopdev_role VALUES(2, 'shop', 'read,update,create');
INSERT INTO shopdev_role VALUES(3, 'user', 'read');

-- 3.shopdev_menu
-- menu A, B, C set for role ?
DROP TABLE IF EXISTS `shopdev_menu`;
CREATE TABLE `shopdev_menu` (
 menu_id int NOT NULL AUTO_INCREMENT COMMENT 'menu_id',
 menu_name VARCHAR(255) NULL DEFAULT NULL COMMENT 'name menu',
 menu_pid VARCHAR(255) NULL DEFAULT NULL COMMENT 'name menu',
 menu_path VARCHAR(255) NULL DEFAULT NULL COMMENT 'path',
 PRIMARY KEY (`menu_id`)
) ENGINE = INNODB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4;

-- run mock DATA
-- https://shopee.vn/%C4%90%E1%BB%93ng-H...
INSERT INTO shopdev_menu VALUES(11, 'Dong ho', '11035788', '/Đồng-Hồ-cat.11035788');
INSERT INTO shopdev_menu VALUES(12, 'may tinh', '11035954', '/Máy-Tính-Laptop-cat.11035954');
INSERT INTO shopdev_menu VALUES(13, 'thoi trang nam', '11035567', '/Thời-Trang-Nam-cat.11035567');

-- 4.shopdev_role_menu
-- gan menu nao cho role nao? ex: Dong ho, may tinh, thoi trang nam cho admin, may tinh cho shop
DROP TABLE IF EXISTS `shopdev_role_menu`;
CREATE TABLE `shopdev_role_menu` (
 role_id int NOT NULL COMMENT 'role id',
 menu_id int NOT NULL COMMENT 'menu id',
 PRIMARY KEY (`role_id`, `menu_id`)
) ENGINE = INNODB CHARACTER SET = utf8mb4;

-- run mock DATA
INSERT INTO shopdev_role_menu VALUES(1, 11);
INSERT INTO shopdev_role_menu VALUES(1, 12);
INSERT INTO shopdev_role_menu VALUES(1, 13);
INSERT INTO shopdev_role_menu VALUES(2, 12);
INSERT INTO shopdev_role_menu VALUES(2, 13);
INSERT INTO shopdev_role_menu VALUES(3, 13);

-- shopdev_user_role
DROP TABLE IF EXISTS `shopdev_user_role`;
CREATE TABLE `shopdev_user_role` (
 user_id int NOT NULL COMMENT 'user id',
 role_id int NOT NULL COMMENT 'role id',
 PRIMARY KEY (`user_id`, `role_id`)
) ENGINE = INNODB CHARACTER SET = utf8mb4;

-- run mock DATA
INSERT INTO shopdev_user_role VALUES(1, 1);
INSERT INTO shopdev_user_role VALUES(2, 2);
INSERT INTO shopdev_user_role VALUES(3, 3);

-- 1. Get quyen truy cap menu chi user = 1
-- 1.1 Xen thu user = 1 co quyen truy cap gi?
SELECT role_id FROM shopdev_user_role WHERE user_id = 1; -- role_id = 1
-- 1.2 XEm role co nhung quyen truy cap menu nao?
SELECT menu_id FROM shopdev_role_menu WHERE role_id = 1; -- menu_id = 11,12,13
-- 1.3 Xem nhung menu nao
SELECT * FROM shopdev_menu WHERE menu_id in(11,12,13);

-- mot cau 
SELECT * FROM shopdev_menu WHERE menu_id in( SELECT menu_id FROM shopdev_role_menu WHERE role_id in(SELECT role_id FROM shopdev_user_role WHERE user_id = 1));

-- cach 2
SELECT * FROM shopdev_menu mn,
(SELECT rome.menu_id FROM shopdev_user_role usro, shopdev_role_menu rome WHERE usro.role_id = rome.role_id AND usro.user_id = 1) t
WHERE mn.menu_id = t.menu_id;

-- bi DUPLICATE

SELECT DISTINCT mn.* FROM shopdev_menu mn,
(SELECT rome.menu_id FROM shopdev_user_role usro, shopdev_role_menu rome WHERE usro.role_id = rome.role_id AND usro.user_id = 2) t
WHERE mn.menu_id = t.menu_id;