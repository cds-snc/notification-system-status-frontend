# Notification-system-status-frontend

Notification system status front end page.

## Deploy to staging

The [Github action](https://github.com/cds-snc/notification-system-status-frontend/blob/main/.github/workflows/upload_to_s3.yml) to deploy to staging triggers whenever a PR is merged into main.

## Deploy to production

The [Github action](https://github.com/cds-snc/notification-system-status-frontend/blob/main/.github/workflows/prod_upload_to_s3.yml) to deploy to production triggers when a new tag is pushed to the repo. Ensure that the repo is in a clean state before pushing new tags.
