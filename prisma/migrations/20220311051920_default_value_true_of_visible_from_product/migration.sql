-- AlterTable

ALTER TABLE "products"
ALTER COLUMN "visible"
SET DEFAULT true;


INSERT INTO "users" ("id",
                     "name",
                     "email",
                     "password",
                     "created_at",
                     "role")
VALUES ('57be8001-27a5-409d-bc4f-ff5630ee88bb',
        'kevin',
        'kevin@admin.com',
        '$2a$10$2AFij9VuF2O4jqVK8UErweGZRb4/QO16AXPdPu/uyp6D5ctzYfsU',
        NOW(),
        'M')