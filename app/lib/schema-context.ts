export const SCHEMA_CONTEXT = `
# DATABASE SCHEMA CONTEXT

## Table: manuscripts
Stores all manuscript submissions.
Columns:
- manuscript_id (integer, PRIMARY KEY): Unique identifier
- title (varchar): Manuscript title
- submitted_at (timestamp): When the manuscript was submitted
- submitter_user_id (integer, FOREIGN KEY → users.user_id): The author who submitted
- status (varchar): Current status - 'pending', 'under_review', 'rejected', 'accepted', 'published'

## Table: users
Stores user information (authors, reviewers, editors).
Columns:
- user_id (integer, PRIMARY KEY): Unique identifier
- full_name (varchar): User's full name
- email (varchar): Email address
- role (varchar): User type - 'author', 'reviewer', 'editor'

## Table: publications
Stores published manuscripts only (subset of manuscripts).
Columns:
- publication_id (integer, PRIMARY KEY)
- manuscript_id (integer, FOREIGN KEY → manuscripts.manuscript_id): ONE-TO-ONE relationship
- published_at (timestamp): When the article was published
- doi (varchar): Digital Object Identifier

---

## RELATIONSHIP RULES:

1. To find manuscript authors:
   JOIN manuscripts.submitter_user_id = users.user_id

2. To count rejected manuscripts:
   Use manuscripts table WHERE status = 'rejected'
   (Don't join publications - rejected manuscripts won't be there)

3. To count published articles:
   Use manuscripts table WHERE status = 'published'
   OR join publications table if you need publication-specific data

4. For year-based queries:
   - Submissions: Use manuscripts.submitted_at
   - Publications: Use publications.published_at

---

## IMPORTANT:
- Only generate SELECT queries
- Use PostgreSQL syntax
- Always include necessary JOINs explicitly
- Use proper date filtering with EXTRACT(YEAR FROM ...) or BETWEEN
`;
