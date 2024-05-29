# User

- Oath
- Username

# Per User

## Theme

- Description
- Objectives
- Start Date
- End Date

## Daily Tasks

- Task Description
- Partial Completion Requirements
- Full Completion Requirements
- Task Start Date
- Task End Date
- Daily Progress
- Associated Theme Objective (Includes Special Critical Task)

## Daily Gratitudes (2 in the morning and 1 at night)

- Gratitude Description
- Date
- Sentiment (-1 to 1) [Sentiment Analysis]

## Daily Thoughts

- Thoughts
- Date

# Database Design

## User Table (Read Heavy)

- Username (unique)
- IsUsingEncryption (default false)
- Oath Information

## Theme Table (Read Heavy)

- Theme ID (Primary Key)
- User (Foreign Key)
- Title (Encrypted) (256)
- Start Date (readonly)
- End Date

## Theme Objectives Table (Read Heavy)

- Objective ID (Primary Key)
- User (Foreign Key)
- Theme ID (Foreign Key)
- Description (Encrypted) (256)

## Daily Tasks Table (Read Heavy)

- Task ID (Primary Key)
- User (Foreign Key)
- Objective ID (Foreign Key) (Can be Null)
- Task Description (Encrypted) (256)
- Partial Completion Requirements (Encrypted) (256)
- Full Completion Requirements (Encrypted) (256)
- Task Start Date (readonly)
- Task End Date

## Daily Progress Table (Equal writes and reads)

- Progress ID (Primary Key)
- Task ID (Foreign Key)
- User (Foreign Key)
- Date
- Progress (2 bytes ?)

## Daily Gratitudes Table (3 per day writes per user)

- Gratitude ID (Primary Key)
- User (Foreign Key)
- Date
- Gratitude Description (Encrypted) (1024)
- Sentiment

## Daily Thoughts Table (1 per day write per user)

- Thought ID (Primary Key)
- User (Foreign Key)
- Date
- Thought (Encrypted) (2048)

# Handle Encryption

- Give client option to use encryption. If using encryption, encrypt all data before sending to server. If not using encryption, send data to server as is. Client has to handle encryption key. If client loses encryption key, they lose all their data. Client has to agree to the fact that they can lose all of their data if the key is lost.
- Default is Server Side Encryption. (Some columns are encrypted so that emplyees without the key cannot read them)

# Export Data to MD file
