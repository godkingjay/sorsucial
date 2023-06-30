# SorSUcial

A social networking platform for Sorsogon State University's students, staff, and professors. Users of the platform can:

1. **Create Posts**. Which may include:

   1.1. Photos
   1.2. Videos
   1.3. Files
   1.4. Links
   1.5. Tags

2. **Create Discussions**. Which may include:

   2.1. Tags

3. **Create Groups**. Which may be:

   3.1. Public - A public group is a group where members or non-members can create posts, discussions, comments, replies, like posts and comments, and vote on discussions and replies.
   3.2. Restricted - A restricted group is a group where only members can create content but non-members can like or vote in posts, comments, discussions, and replies.
   3.3. Private - A private group is a group where only members can view and interact with its contents.

4. **Manage Profile**. Manage user:

   4.1. Information
   4.2. Authentication

5. **Create Comments** in posts and comments.
6. **Create Replies** in discussions and replies.

## Setup

1. Install the dependencies:

```bash
npm install
#or
yarn install
```

2. Configure the environment variables in `.env.example` and rename it to `.env.local`:

```bash
NEXT_PUBLIC_API_KEY=#Firebase APP API Key
NEXT_PUBLIC_AUTH_DOMAIN=#Firebase App Auth Domain
NEXT_PUBLIC_DATABASE_URL=#Firebase App Database
NEXT_PUBLIC_PROJECT_ID=#Firebase App Project ID
NEXT_PUBLIC_STORAGE_BUCKET=#Firebase App Storage Bucket
NEXT_PUBLIC_MESSAGING_SENDER_ID=#Firebase App Sender ID
NEXT_PUBLIC_APP_ID=#Firebase APP ID
NEXT_PUBLIC_MEASUREMENT_ID=#Firebase APP Measurement ID

NEXT_PUBLIC_BASE_URL=#The Website base URL
NEXT_PUBLIC_API_ENDPOINT=#The API Endpoint base URL

NEXT_PUBLIC_ADMIN_TYPE=service_account
NEXT_PUBLIC_ADMIN_PRIVATE_KEY_ID=#Firebase Admin SDK Private Key
NEXT_PUBLIC_ADMIN_CLIENT_EMAIL=#Firebase Admin SDK Client Email
NEXT_PUBLIC_ADMIN_CLIENT_ID=#Firebase Admin SDK Client ID
NEXT_PUBLIC_ADMIN_AUTH_URI=#Firebase Admin SDK Auth URI
NEXT_PUBLIC_ADMIN_TOKEN_URI=#Firebase Admin SDK Token URI
NEXT_PUBLIC_ADMIN_CERT_AUTH_PROVIDER=#Firebase Admin SDK Certificate Provider
NEXT_PUBLIC_ADMIN_CERT_CLIENT=#Firebase Admin SDK Client Certificate

MONGODB_URI=#MongoDB Database Link

```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/](http://localhost:3000/api/). This endpoint can be edited in `pages/api/index.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
