-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "student_id" TEXT,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "department_id" INTEGER,
    "semester" INTEGER,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "users_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "departments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "courses" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "department_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "instructor" TEXT NOT NULL,
    "course_code" TEXT NOT NULL,
    "course_credits" INTEGER NOT NULL,
    CONSTRAINT "courses_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "enrollments" (
    "user_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "is_evaluated" BOOLEAN NOT NULL DEFAULT false,
    "enrolled_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("user_id", "course_id"),
    CONSTRAINT "enrollments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "evaluation_periods" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "starts_at" DATETIME NOT NULL,
    "ends_at" DATETIME NOT NULL,
    "message" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "question_sections" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "questions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "question_section_id" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    CONSTRAINT "questions_question_section_id_fkey" FOREIGN KEY ("question_section_id") REFERENCES "question_sections" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "evaluations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "course_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "selected_value" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "evaluations_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "evaluations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "evaluations_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_student_id_key" ON "users"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "courses_course_code_key" ON "courses"("course_code");

-- CreateIndex
CREATE UNIQUE INDEX "evaluations_course_id_user_id_question_id_key" ON "evaluations"("course_id", "user_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");
