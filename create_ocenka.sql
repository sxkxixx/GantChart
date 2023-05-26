CREATE DATABASE ocenka;

USE ocenka;


-- CREATE TABLE "auth_group" -----------------------------------
CREATE TABLE `auth_group`(
                             `id` Int( 0 ) AUTO_INCREMENT NOT NULL,
                             `name` VarChar( 150 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                             PRIMARY KEY ( `id` ),
                             CONSTRAINT `name` UNIQUE( `name` ) )
    CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB
AUTO_INCREMENT = 1;-- -------------------------------------------------------------

-- CREATE TABLE "django_content_type" --------------------------
CREATE TABLE `django_content_type`(
                                      `id` Int( 0 ) AUTO_INCREMENT NOT NULL,
                                      `app_label` VarChar( 100 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                                      `model` VarChar( 100 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                                      PRIMARY KEY ( `id` ),
                                      CONSTRAINT `django_content_type_app_label_model_76bd3d3b_uniq` UNIQUE( `app_label`, `model` ) )
    CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB
AUTO_INCREMENT = 18;-- -------------------------------------------------------------

-- CREATE TABLE "django_migrations" ----------------------------
CREATE TABLE `django_migrations`(
                                    `id` BigInt( 0 ) AUTO_INCREMENT NOT NULL,
                                    `app` VarChar( 255 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                                    `name` VarChar( 255 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                                    `applied` DateTime NOT NULL,
                                    PRIMARY KEY ( `id` ) )
    CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB
AUTO_INCREMENT = 31;-- -------------------------------------------------------------

-- CREATE TABLE "django_session" -------------------------------
CREATE TABLE `django_session`(
                                 `session_key` VarChar( 40 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                                 `session_data` LongText CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                                 `expire_date` DateTime NOT NULL,
                                 PRIMARY KEY ( `session_key` ) )
    CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB;-- -------------------------------------------------------------;

-- CREATE INDEX "django_session_expire_date_a5c62663" ----------
CREATE INDEX `django_session_expire_date_a5c62663` USING BTREE ON `django_session`( `expire_date` );-- -------------------------------------------------------------

-- CREATE TABLE "uralapi_evaluationcriteria" -------------------
CREATE TABLE `uralapi_evaluationcriteria`(
                                             `id` BigInt( 0 ) AUTO_INCREMENT NOT NULL,
                                             `title` VarChar( 100 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                                             `description` LongText CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                                             PRIMARY KEY ( `id` ) )
    CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB;-- -------------------------------------------------------------

-- CREATE TABLE "uralapi_eventuts" -----------------------------
CREATE TABLE `uralapi_eventuts`(
                                   `id` BigInt( 0 ) AUTO_INCREMENT NOT NULL,
                                   `title` VarChar( 100 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                                   `start_date` Date NULL DEFAULT NULL,
                                   `end_date` Date NULL DEFAULT NULL,
                                   PRIMARY KEY ( `id` ) )
    CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB;-- -------------------------------------------------------------

-- CREATE TABLE "uralapi_roleinteam" ---------------------------
CREATE TABLE `uralapi_roleinteam`(
                                     `id` BigInt( 0 ) AUTO_INCREMENT NOT NULL,
                                     `title` VarChar( 100 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                                     PRIMARY KEY ( `id` ) )
    CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB;-- -------------------------------------------------------------

-- CREATE TABLE "uralapi_user" ---------------------------------
CREATE TABLE `uralapi_user`(
                               `id` BigInt( 0 ) AUTO_INCREMENT NOT NULL,
                               `password` VarChar( 128 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                               `last_login` DateTime NULL DEFAULT NULL,
                               `is_superuser` TinyInt( 1 ) NOT NULL,
                               `first_name` VarChar( 150 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                               `last_name` VarChar( 150 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                               `is_staff` TinyInt( 1 ) NOT NULL,
                               `is_active` TinyInt( 1 ) NOT NULL,
                               `date_joined` DateTime NOT NULL,
                               `username` VarChar( 100 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
                               `email` VarChar( 254 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                               `patronymic` VarChar( 100 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
                               `image` VarChar( 100 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
                               PRIMARY KEY ( `id` ),
                               CONSTRAINT `email` UNIQUE( `email` ) )
    CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB;-- -------------------------------------------------------------

-- CREATE TABLE "auth_permission" ------------------------------
CREATE TABLE `auth_permission`(
                                  `id` Int( 0 ) AUTO_INCREMENT NOT NULL,
                                  `name` VarChar( 255 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                                  `content_type_id` Int( 0 ) NOT NULL,
                                  `codename` VarChar( 100 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                                  PRIMARY KEY ( `id` ),
                                  CONSTRAINT `auth_permission_content_type_id_codename_01ab375a_uniq` UNIQUE( `content_type_id`, `codename` ) )
    CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB
AUTO_INCREMENT = 69;-- -------------------------------------------------------------

-- CREATE LINK "auth_permission_content_type_id_2f476e4b_fk_django_co"
ALTER TABLE `auth_permission`
    ADD CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY ( `content_type_id` )
        REFERENCES `django_content_type`( `id` )
        ON DELETE No Action
        ON UPDATE No Action;-- -------------------------------------------------------------

-- CREATE TABLE "auth_group_permissions" -----------------------
CREATE TABLE `auth_group_permissions`(
                                         `id` BigInt( 0 ) AUTO_INCREMENT NOT NULL,
                                         `group_id` Int( 0 ) NOT NULL,
                                         `permission_id` Int( 0 ) NOT NULL,
                                         PRIMARY KEY ( `id` ),
                                         CONSTRAINT `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` UNIQUE( `group_id`, `permission_id` ) )
    CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB
AUTO_INCREMENT = 1;-- -------------------------------------------------------------;

-- CREATE INDEX "auth_group_permissio_permission_id_84c5c92e_fk_auth_perm"
CREATE INDEX `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` USING BTREE ON `auth_group_permissions`( `permission_id` );-- -------------------------------------------------------------

-- CREATE LINK "auth_group_permissions_group_id_b120cbf9_fk_auth_group_id"
ALTER TABLE `auth_group_permissions`
    ADD CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY ( `group_id` )
        REFERENCES `auth_group`( `id` )
        ON DELETE No Action
        ON UPDATE No Action;-- -------------------------------------------------------------

-- CREATE LINK "auth_group_permissio_permission_id_84c5c92e_fk_auth_perm"
ALTER TABLE `auth_group_permissions`
    ADD CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY ( `permission_id` )
        REFERENCES `auth_permission`( `id` )
        ON DELETE No Action
        ON UPDATE No Action;-- -------------------------------------------------------------

-- CREATE TABLE "django_admin_log" -----------------------------
CREATE TABLE `django_admin_log`(
                                   `id` Int( 0 ) AUTO_INCREMENT NOT NULL,
                                   `action_time` DateTime NOT NULL,
                                   `object_id` LongText CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
                                   `object_repr` VarChar( 200 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                                   `action_flag` SmallInt( 0 ) UNSIGNED NOT NULL,
                                   `change_message` LongText CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                                   `content_type_id` Int( 0 ) NULL DEFAULT NULL,
                                   `user_id` BigInt( 0 ) NOT NULL,
                                   PRIMARY KEY ( `id` ) )
    CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB
AUTO_INCREMENT = 1;-- -------------------------------------------------------------;

-- CREATE INDEX "django_admin_log_content_type_id_c4bce8eb_fk_django_co"
CREATE INDEX `django_admin_log_content_type_id_c4bce8eb_fk_django_co` USING BTREE ON `django_admin_log`( `content_type_id` );-- -------------------------------------------------------------;

-- CREATE INDEX "django_admin_log_user_id_c564eba6_fk_uralapi_user_id"
CREATE INDEX `django_admin_log_user_id_c564eba6_fk_uralapi_user_id` USING BTREE ON `django_admin_log`( `user_id` );-- -------------------------------------------------------------

-- CREATE LINK "django_admin_log_content_type_id_c4bce8eb_fk_django_co"
ALTER TABLE `django_admin_log`
    ADD CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY ( `content_type_id` )
        REFERENCES `django_content_type`( `id` )
        ON DELETE No Action
        ON UPDATE No Action;-- -------------------------------------------------------------

-- CREATE LINK "django_admin_log_user_id_c564eba6_fk_uralapi_user_id"
ALTER TABLE `django_admin_log`
    ADD CONSTRAINT `django_admin_log_user_id_c564eba6_fk_uralapi_user_id` FOREIGN KEY ( `user_id` )
        REFERENCES `uralapi_user`( `id` )
        ON DELETE No Action
        ON UPDATE No Action;-- -------------------------------------------------------------

-- CREATE TABLE "token_blacklist_outstandingtoken" -------------
CREATE TABLE `token_blacklist_outstandingtoken`(
                                                   `id` BigInt( 0 ) AUTO_INCREMENT NOT NULL,
                                                   `token` LongText CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                                                   `created_at` DateTime NULL DEFAULT NULL,
                                                   `expires_at` DateTime NOT NULL,
                                                   `user_id` BigInt( 0 ) NULL DEFAULT NULL,
                                                   `jti` VarChar( 255 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                                                   PRIMARY KEY ( `id` ),
                                                   CONSTRAINT `token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq` UNIQUE( `jti` ) )
    CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB
AUTO_INCREMENT = 1;-- -------------------------------------------------------------;

-- CREATE INDEX "token_blacklist_outs_user_id_83bc629a_fk_uralapi_u"
CREATE INDEX `token_blacklist_outs_user_id_83bc629a_fk_uralapi_u` USING BTREE ON `token_blacklist_outstandingtoken`( `user_id` );-- -------------------------------------------------------------

-- CREATE LINK "token_blacklist_outs_user_id_83bc629a_fk_uralapi_u"
ALTER TABLE `token_blacklist_outstandingtoken`
    ADD CONSTRAINT `token_blacklist_outs_user_id_83bc629a_fk_uralapi_u` FOREIGN KEY ( `user_id` )
        REFERENCES `uralapi_user`( `id` )
        ON DELETE No Action
        ON UPDATE No Action;-- -------------------------------------------------------------

-- CREATE TABLE "token_blacklist_blacklistedtoken" -------------
CREATE TABLE `token_blacklist_blacklistedtoken`(
                                                   `id` BigInt( 0 ) AUTO_INCREMENT NOT NULL,
                                                   `blacklisted_at` DateTime NOT NULL,
                                                   `token_id` BigInt( 0 ) NOT NULL,
                                                   PRIMARY KEY ( `id` ),
                                                   CONSTRAINT `token_id` UNIQUE( `token_id` ) )
    CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB
AUTO_INCREMENT = 1;-- -------------------------------------------------------------

-- CREATE LINK "token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk"
ALTER TABLE `token_blacklist_blacklistedtoken`
    ADD CONSTRAINT `token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk` FOREIGN KEY ( `token_id` )
        REFERENCES `token_blacklist_outstandingtoken`( `id` )
        ON DELETE No Action
        ON UPDATE No Action;-- -------------------------------------------------------------

-- CREATE TABLE "uralapi_project" ------------------------------
CREATE TABLE `uralapi_project`(
                                  `id` BigInt( 0 ) AUTO_INCREMENT NOT NULL,
                                  `title` VarChar( 100 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                                  `start_date` Date NULL DEFAULT NULL,
                                  `end_date` Date NULL DEFAULT NULL,
                                  `id_director_id` BigInt( 0 ) NOT NULL,
                                  `id_event_id` BigInt( 0 ) NOT NULL,
                                  PRIMARY KEY ( `id` ) )
    CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB
AUTO_INCREMENT = 1;-- -------------------------------------------------------------;

-- CREATE INDEX "uralapi_project_id_director_id_f937b8ef_fk_uralapi_user_id"
CREATE INDEX `uralapi_project_id_director_id_f937b8ef_fk_uralapi_user_id` USING BTREE ON `uralapi_project`( `id_director_id` );-- -------------------------------------------------------------;

-- CREATE INDEX "uralapi_project_id_event_id_49068382_fk_uralapi_eventuts_id"
CREATE INDEX `uralapi_project_id_event_id_49068382_fk_uralapi_eventuts_id` USING BTREE ON `uralapi_project`( `id_event_id` );-- -------------------------------------------------------------

-- CREATE LINK "uralapi_project_id_director_id_f937b8ef_fk_uralapi_user_id"
ALTER TABLE `uralapi_project`
    ADD CONSTRAINT `uralapi_project_id_director_id_f937b8ef_fk_uralapi_user_id` FOREIGN KEY ( `id_director_id` )
        REFERENCES `uralapi_user`( `id` )
        ON DELETE No Action
        ON UPDATE No Action;-- -------------------------------------------------------------

-- CREATE LINK "uralapi_project_id_event_id_49068382_fk_uralapi_eventuts_id"
ALTER TABLE `uralapi_project`
    ADD CONSTRAINT `uralapi_project_id_event_id_49068382_fk_uralapi_eventuts_id` FOREIGN KEY ( `id_event_id` )
        REFERENCES `uralapi_eventuts`( `id` )
        ON DELETE No Action
        ON UPDATE No Action;-- -------------------------------------------------------------

-- CREATE TABLE "uralapi_project_evaluation_criteria" ----------
CREATE TABLE `uralapi_project_evaluation_criteria`(
                                                      `id` BigInt( 0 ) AUTO_INCREMENT NOT NULL,
                                                      `project_id` BigInt( 0 ) NOT NULL,
                                                      `evaluationcriteria_id` BigInt( 0 ) NOT NULL,
                                                      PRIMARY KEY ( `id` ),
                                                      CONSTRAINT `uralapi_project_evaluati_project_id_evaluationcri_484287ea_uniq` UNIQUE( `project_id`, `evaluationcriteria_id` ) )
    CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB
AUTO_INCREMENT = 1;-- -------------------------------------------------------------;

-- CREATE INDEX "uralapi_project_eval_evaluationcriteria_i_eecc5110_fk_uralapi_e"
CREATE INDEX `uralapi_project_eval_evaluationcriteria_i_eecc5110_fk_uralapi_e` USING BTREE ON `uralapi_project_evaluation_criteria`( `evaluationcriteria_id` );-- -------------------------------------------------------------

-- CREATE LINK "uralapi_project_eval_evaluationcriteria_i_eecc5110_fk_uralapi_e"
ALTER TABLE `uralapi_project_evaluation_criteria`
    ADD CONSTRAINT `uralapi_project_eval_evaluationcriteria_i_eecc5110_fk_uralapi_e` FOREIGN KEY ( `evaluationcriteria_id` )
        REFERENCES `uralapi_evaluationcriteria`( `id` )
        ON DELETE No Action
        ON UPDATE No Action;-- -------------------------------------------------------------

-- CREATE LINK "uralapi_project_eval_project_id_fb69e6a3_fk_uralapi_p"
ALTER TABLE `uralapi_project_evaluation_criteria`
    ADD CONSTRAINT `uralapi_project_eval_project_id_fb69e6a3_fk_uralapi_p` FOREIGN KEY ( `project_id` )
        REFERENCES `uralapi_project`( `id` )
        ON DELETE No Action
        ON UPDATE No Action;-- -------------------------------------------------------------

-- CREATE TABLE "uralapi_team" ---------------------------------
CREATE TABLE `uralapi_team`(
                               `id` BigInt( 0 ) AUTO_INCREMENT NOT NULL,
                               `title` VarChar( 200 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                               `team_chat` VarChar( 200 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
                               `teg` VarChar( 200 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                               `id_project_id` BigInt( 0 ) NOT NULL,
                               `id_tutor_id` BigInt( 0 ) NOT NULL,
                               PRIMARY KEY ( `id` ),
                               CONSTRAINT `teg` UNIQUE( `teg` ) )
    CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB
AUTO_INCREMENT = 1;-- -------------------------------------------------------------;

-- CREATE INDEX "uralapi_team_id_project_id_09bffdcf_fk_uralapi_project_id"
CREATE INDEX `uralapi_team_id_project_id_09bffdcf_fk_uralapi_project_id` USING BTREE ON `uralapi_team`( `id_project_id` );-- -------------------------------------------------------------;

-- CREATE INDEX "uralapi_team_id_tutor_id_9533f006_fk_uralapi_user_id"
CREATE INDEX `uralapi_team_id_tutor_id_9533f006_fk_uralapi_user_id` USING BTREE ON `uralapi_team`( `id_tutor_id` );-- -------------------------------------------------------------

-- CREATE LINK "uralapi_team_id_project_id_09bffdcf_fk_uralapi_project_id"
ALTER TABLE `uralapi_team`
    ADD CONSTRAINT `uralapi_team_id_project_id_09bffdcf_fk_uralapi_project_id` FOREIGN KEY ( `id_project_id` )
        REFERENCES `uralapi_project`( `id` )
        ON DELETE No Action
        ON UPDATE No Action;-- -------------------------------------------------------------

-- CREATE LINK "uralapi_team_id_tutor_id_9533f006_fk_uralapi_user_id"
ALTER TABLE `uralapi_team`
    ADD CONSTRAINT `uralapi_team_id_tutor_id_9533f006_fk_uralapi_user_id` FOREIGN KEY ( `id_tutor_id` )
        REFERENCES `uralapi_user`( `id` )
        ON DELETE No Action
        ON UPDATE No Action;-- -------------------------------------------------------------

-- CREATE TABLE "uralapi_user_groups" --------------------------
CREATE TABLE `uralapi_user_groups`(
                                      `id` BigInt( 0 ) AUTO_INCREMENT NOT NULL,
                                      `user_id` BigInt( 0 ) NOT NULL,
                                      `group_id` Int( 0 ) NOT NULL,
                                      PRIMARY KEY ( `id` ),
                                      CONSTRAINT `uralapi_user_groups_user_id_group_id_8f3a94b0_uniq` UNIQUE( `user_id`, `group_id` ) )
    CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB
AUTO_INCREMENT = 1;-- -------------------------------------------------------------;

-- CREATE INDEX "uralapi_user_groups_group_id_c5ae64bc_fk_auth_group_id"
CREATE INDEX `uralapi_user_groups_group_id_c5ae64bc_fk_auth_group_id` USING BTREE ON `uralapi_user_groups`( `group_id` );-- -------------------------------------------------------------

-- CREATE LINK "uralapi_user_groups_group_id_c5ae64bc_fk_auth_group_id"
ALTER TABLE `uralapi_user_groups`
    ADD CONSTRAINT `uralapi_user_groups_group_id_c5ae64bc_fk_auth_group_id` FOREIGN KEY ( `group_id` )
        REFERENCES `auth_group`( `id` )
        ON DELETE No Action
        ON UPDATE No Action;-- -------------------------------------------------------------

-- CREATE LINK "uralapi_user_groups_user_id_8903332f_fk_uralapi_user_id"
ALTER TABLE `uralapi_user_groups`
    ADD CONSTRAINT `uralapi_user_groups_user_id_8903332f_fk_uralapi_user_id` FOREIGN KEY ( `user_id` )
        REFERENCES `uralapi_user`( `id` )
        ON DELETE No Action
        ON UPDATE No Action;-- -------------------------------------------------------------

-- CREATE TABLE "uralapi_user_user_permissions" ----------------
CREATE TABLE `uralapi_user_user_permissions`(
                                                `id` BigInt( 0 ) AUTO_INCREMENT NOT NULL,
                                                `user_id` BigInt( 0 ) NOT NULL,
                                                `permission_id` Int( 0 ) NOT NULL,
                                                PRIMARY KEY ( `id` ),
                                                CONSTRAINT `uralapi_user_user_permis_user_id_permission_id_9d9f60e0_uniq` UNIQUE( `user_id`, `permission_id` ) )
    CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB
AUTO_INCREMENT = 1;-- -------------------------------------------------------------;

-- CREATE INDEX "uralapi_user_user_pe_permission_id_65b777f3_fk_auth_perm"
CREATE INDEX `uralapi_user_user_pe_permission_id_65b777f3_fk_auth_perm` USING BTREE ON `uralapi_user_user_permissions`( `permission_id` );-- -------------------------------------------------------------

-- CREATE LINK "uralapi_user_user_pe_permission_id_65b777f3_fk_auth_perm"
ALTER TABLE `uralapi_user_user_permissions`
    ADD CONSTRAINT `uralapi_user_user_pe_permission_id_65b777f3_fk_auth_perm` FOREIGN KEY ( `permission_id` )
        REFERENCES `auth_permission`( `id` )
        ON DELETE No Action
        ON UPDATE No Action;-- -------------------------------------------------------------

-- CREATE LINK "uralapi_user_user_pe_user_id_7f122229_fk_uralapi_u"
ALTER TABLE `uralapi_user_user_permissions`
    ADD CONSTRAINT `uralapi_user_user_pe_user_id_7f122229_fk_uralapi_u` FOREIGN KEY ( `user_id` )
        REFERENCES `uralapi_user`( `id` )
        ON DELETE No Action
        ON UPDATE No Action;-- -------------------------------------------------------------

-- CREATE TABLE "uralapi_userinfo" -----------------------------
CREATE TABLE `uralapi_userinfo`(
                                   `id_user_id` BigInt( 0 ) NOT NULL,
                                   `educational_institution` VarChar( 200 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
                                   `specialization` VarChar( 200 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
                                   `academic_degree` VarChar( 200 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
                                   `course` VarChar( 100 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
                                   `telephone` VarChar( 16 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
                                   `telegram` VarChar( 200 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
                                   `vk` VarChar( 200 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
                                   PRIMARY KEY ( `id_user_id` ) )
    CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB;-- -------------------------------------------------------------

-- CREATE LINK "uralapi_userinfo_id_user_id_8d150896_fk_uralapi_user_id"
ALTER TABLE `uralapi_userinfo`
    ADD CONSTRAINT `uralapi_userinfo_id_user_id_8d150896_fk_uralapi_user_id` FOREIGN KEY ( `id_user_id` )
        REFERENCES `uralapi_user`( `id` )
        ON DELETE No Action
        ON UPDATE No Action;-- -------------------------------------------------------------

-- CREATE TABLE "uralapi_internteam" ---------------------------
CREATE TABLE `uralapi_internteam`(
                                     `id` BigInt( 0 ) AUTO_INCREMENT NOT NULL,
                                     `id_intern_id` BigInt( 0 ) NOT NULL,
                                     `id_team_id` BigInt( 0 ) NOT NULL,
                                     `role_id` BigInt( 0 ) NOT NULL,
                                     PRIMARY KEY ( `id` ),
                                     CONSTRAINT `uralapi_internteam_id_team_id_id_intern_id_0ee6a769_uniq` UNIQUE( `id_team_id`, `id_intern_id` ) )
    CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB
AUTO_INCREMENT = 1;-- -------------------------------------------------------------;

-- CREATE INDEX "uralapi_internteam_id_intern_id_ec246254_fk_uralapi_user_id"
CREATE INDEX `uralapi_internteam_id_intern_id_ec246254_fk_uralapi_user_id` USING BTREE ON `uralapi_internteam`( `id_intern_id` );-- -------------------------------------------------------------;

-- CREATE INDEX "uralapi_internteam_role_id_7735a066_fk_uralapi_roleinteam_id"
CREATE INDEX `uralapi_internteam_role_id_7735a066_fk_uralapi_roleinteam_id` USING BTREE ON `uralapi_internteam`( `role_id` );-- -------------------------------------------------------------

-- CREATE LINK "uralapi_internteam_id_intern_id_ec246254_fk_uralapi_user_id"
ALTER TABLE `uralapi_internteam`
    ADD CONSTRAINT `uralapi_internteam_id_intern_id_ec246254_fk_uralapi_user_id` FOREIGN KEY ( `id_intern_id` )
        REFERENCES `uralapi_user`( `id` )
        ON DELETE No Action
        ON UPDATE No Action;-- -------------------------------------------------------------

-- CREATE LINK "uralapi_internteam_id_team_id_de93c768_fk_uralapi_team_id"
ALTER TABLE `uralapi_internteam`
    ADD CONSTRAINT `uralapi_internteam_id_team_id_de93c768_fk_uralapi_team_id` FOREIGN KEY ( `id_team_id` )
        REFERENCES `uralapi_team`( `id` )
        ON DELETE No Action
        ON UPDATE No Action;-- -------------------------------------------------------------

-- CREATE LINK "uralapi_internteam_role_id_7735a066_fk_uralapi_roleinteam_id"
ALTER TABLE `uralapi_internteam`
    ADD CONSTRAINT `uralapi_internteam_role_id_7735a066_fk_uralapi_roleinteam_id` FOREIGN KEY ( `role_id` )
        REFERENCES `uralapi_roleinteam`( `id` )
        ON DELETE No Action
        ON UPDATE No Action;-- -------------------------------------------------------------

-- CREATE TABLE "uralapi_stage" --------------------------------
CREATE TABLE `uralapi_stage`(
                                `id` BigInt( 0 ) AUTO_INCREMENT NOT NULL,
                                `title` VarChar( 100 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                                `description` LongText CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
                                `is_active` TinyInt( 1 ) NOT NULL,
                                `start_date` Date NOT NULL,
                                `end_date` Date NOT NULL,
                                `end_estimation_date` Date NULL DEFAULT NULL,
                                `id_team_id` BigInt( 0 ) NOT NULL,
                                PRIMARY KEY ( `id` ) )
    CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB
AUTO_INCREMENT = 1;-- -------------------------------------------------------------;

-- CREATE INDEX "uralapi_stage_id_team_id_7d4aacd1_fk_uralapi_team_id"
CREATE INDEX `uralapi_stage_id_team_id_7d4aacd1_fk_uralapi_team_id` USING BTREE ON `uralapi_stage`( `id_team_id` );-- -------------------------------------------------------------

-- CREATE LINK "uralapi_stage_id_team_id_7d4aacd1_fk_uralapi_team_id"
ALTER TABLE `uralapi_stage`
    ADD CONSTRAINT `uralapi_stage_id_team_id_7d4aacd1_fk_uralapi_team_id` FOREIGN KEY ( `id_team_id` )
        REFERENCES `uralapi_team`( `id` )
        ON DELETE No Action
        ON UPDATE No Action;-- -------------------------------------------------------------

-- CREATE TABLE "uralapi_stage_evaluation_criteria" ------------
CREATE TABLE `uralapi_stage_evaluation_criteria`(
                                                    `id` BigInt( 0 ) AUTO_INCREMENT NOT NULL,
                                                    `stage_id` BigInt( 0 ) NOT NULL,
                                                    `evaluationcriteria_id` BigInt( 0 ) NOT NULL,
                                                    PRIMARY KEY ( `id` ),
                                                    CONSTRAINT `uralapi_stage_evaluation_stage_id_evaluationcrite_fa642d6d_uniq` UNIQUE( `stage_id`, `evaluationcriteria_id` ) )
    CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB
AUTO_INCREMENT = 1;-- -------------------------------------------------------------;

-- CREATE INDEX "uralapi_stage_evalua_evaluationcriteria_i_9ed093bf_fk_uralapi_e"
CREATE INDEX `uralapi_stage_evalua_evaluationcriteria_i_9ed093bf_fk_uralapi_e` USING BTREE ON `uralapi_stage_evaluation_criteria`( `evaluationcriteria_id` );-- -------------------------------------------------------------

-- CREATE LINK "uralapi_stage_evalua_evaluationcriteria_i_9ed093bf_fk_uralapi_e"
ALTER TABLE `uralapi_stage_evaluation_criteria`
    ADD CONSTRAINT `uralapi_stage_evalua_evaluationcriteria_i_9ed093bf_fk_uralapi_e` FOREIGN KEY ( `evaluationcriteria_id` )
        REFERENCES `uralapi_evaluationcriteria`( `id` )
        ON DELETE No Action
        ON UPDATE No Action;-- -------------------------------------------------------------

-- CREATE LINK "uralapi_stage_evalua_stage_id_fe894c4f_fk_uralapi_s"
ALTER TABLE `uralapi_stage_evaluation_criteria`
    ADD CONSTRAINT `uralapi_stage_evalua_stage_id_fe894c4f_fk_uralapi_s` FOREIGN KEY ( `stage_id` )
        REFERENCES `uralapi_stage`( `id` )
        ON DELETE No Action
        ON UPDATE No Action;-- -------------------------------------------------------------

-- CREATE TABLE "uralapi_estimation" ---------------------------
CREATE TABLE `uralapi_estimation`(
                                     `id` BigInt( 0 ) AUTO_INCREMENT NOT NULL,
                                     `time_voting` DateTime NOT NULL,
                                     `estimation` Double( 22, 0 ) NOT NULL,
	`id_appraiser_id` BigInt( 0 ) NOT NULL,
	`id_evaluation_criteria_id` BigInt( 0 ) NOT NULL,
	`id_intern_id` BigInt( 0 ) NOT NULL,
	`id_stage_id` BigInt( 0 ) NOT NULL,
	PRIMARY KEY ( `id` ),
	CONSTRAINT `uralapi_estimation_id_appraiser_id_id_stage_abc04ff6_uniq` UNIQUE( `id_appraiser_id`, `id_stage_id`, `id_evaluation_criteria_id`, `id_intern_id` ) )
    CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB
AUTO_INCREMENT = 1;-- -------------------------------------------------------------;

-- CREATE INDEX "uralapi_estimation_id_evaluation_criter_ba0e6e5b_fk_uralapi_e"
CREATE INDEX `uralapi_estimation_id_evaluation_criter_ba0e6e5b_fk_uralapi_e` USING BTREE ON `uralapi_estimation`( `id_evaluation_criteria_id` );-- -------------------------------------------------------------;

-- CREATE INDEX "uralapi_estimation_id_intern_id_39eb28e3_fk_uralapi_user_id"
CREATE INDEX `uralapi_estimation_id_intern_id_39eb28e3_fk_uralapi_user_id` USING BTREE ON `uralapi_estimation`( `id_intern_id` );-- -------------------------------------------------------------;

-- CREATE INDEX "uralapi_estimation_id_stage_id_3e4ba3cf_fk_uralapi_stage_id"
CREATE INDEX `uralapi_estimation_id_stage_id_3e4ba3cf_fk_uralapi_stage_id` USING BTREE ON `uralapi_estimation`( `id_stage_id` );-- -------------------------------------------------------------

-- CREATE LINK "uralapi_estimation_id_appraiser_id_bd22f374_fk_uralapi_user_id"
ALTER TABLE `uralapi_estimation`
    ADD CONSTRAINT `uralapi_estimation_id_appraiser_id_bd22f374_fk_uralapi_user_id` FOREIGN KEY ( `id_appraiser_id` )
        REFERENCES `uralapi_user`( `id` )
        ON DELETE No Action
        ON UPDATE No Action;-- -------------------------------------------------------------

-- CREATE LINK "uralapi_estimation_id_evaluation_criter_ba0e6e5b_fk_uralapi_e"
ALTER TABLE `uralapi_estimation`
    ADD CONSTRAINT `uralapi_estimation_id_evaluation_criter_ba0e6e5b_fk_uralapi_e` FOREIGN KEY ( `id_evaluation_criteria_id` )
        REFERENCES `uralapi_evaluationcriteria`( `id` )
        ON DELETE No Action
        ON UPDATE No Action;-- -------------------------------------------------------------

-- CREATE LINK "uralapi_estimation_id_intern_id_39eb28e3_fk_uralapi_user_id"
ALTER TABLE `uralapi_estimation`
    ADD CONSTRAINT `uralapi_estimation_id_intern_id_39eb28e3_fk_uralapi_user_id` FOREIGN KEY ( `id_intern_id` )
        REFERENCES `uralapi_user`( `id` )
        ON DELETE No Action
        ON UPDATE No Action;-- -------------------------------------------------------------

-- CREATE LINK "uralapi_estimation_id_stage_id_3e4ba3cf_fk_uralapi_stage_id"
ALTER TABLE `uralapi_estimation`
    ADD CONSTRAINT `uralapi_estimation_id_stage_id_3e4ba3cf_fk_uralapi_stage_id` FOREIGN KEY ( `id_stage_id` )
        REFERENCES `uralapi_stage`( `id` )
        ON DELETE No Action
        ON UPDATE No Action;-- -------------------------------------------------------------

GRANT ALL PRIVILEGES ON ocenka.* TO kaban_admin@'%';
