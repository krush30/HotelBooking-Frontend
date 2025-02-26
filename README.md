# Hotel Booking App - Frontend

This is the **frontend** of the Hotel Booking App, built using **Next.js** for a seamless and responsive user experience.

## Features

- User authentication (Customers, Vendors, Admins)
- Listing hotels and restaurants
- Uploading and displaying images for listings
- Booking functionality
- Vendor dashboard to manage listings
- Admin panel for user and listing management

## Tech Stack

- **Next.js** (React Framework)
- **JavaScript** (Frontend Logic)
- **Tailwind CSS** (Styling)
- **Clerk/Firebase Auth** (Authentication)
- **PostgreSQL + Drizzle ORM** (Database)
- **Docker** (Containerization)

## Installation & Setup

1. **Clone the repository**

   ```sh
   git clone https://github.com/krush30/HotelBooking-Frontend.git
   cd hotel-booking-frontend
   ```

2. **Install dependencies**

   ```sh
   npm install  # or yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file and add the following:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000  # Backend URL

   ```

4. **Run the development server**
   ```sh
   npm run dev  # or yarn dev
   ```
   Open [http://localhost:3001].

To deploy manually:

```sh
git add .
git commit -m "Deploy frontend"
git push origin main
```

## API Endpoints Used

The frontend interacts with the backend via RESTful APIs. Example:

- `GET /listings` - Fetch all listings
- `POST /listings` - Create a new listing
- `POST /auth/login` - User authentication


