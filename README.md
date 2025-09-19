# AccuFlow - Enterprise Accounting Software Platform

A comprehensive accounting software platform with multi-business support, payment integrations, and advanced reporting capabilities.

## Features

### Frontend (React + TypeScript)
- **Multi-role Authentication**: Admin and user roles with different capabilities
- **Business Management**: Create and manage multiple business entities
- **Chart of Accounts**: Customizable account structures with auto-generation
- **Transaction Management**: Manual entry and automated sync from integrations
- **Payment Integrations**: Stripe, Square, PayPal, Venmo, CashApp, NMI, Paysley
- **Advanced Reports**: P&L, Balance Sheet, Cash Flow, Transaction summaries
- **Invitation System**: Admin can invite users with free accounts
- **Responsive Design**: Works on desktop, tablet, and mobile

### Backend (Node.js + Express + PostgreSQL)
- **RESTful API**: Comprehensive API with proper authentication
- **Database**: PostgreSQL with Knex.js migrations and query builder
- **Authentication**: JWT-based auth with role-based access control
- **Account Types**: Paid, Free, Invited, and Super Free accounts
- **Business Logic**: Complete accounting logic with proper validation
- **Integration Framework**: Extensible system for payment platform integrations
- **Admin Panel**: Full admin capabilities for user and system management

## Quick Start with Docker

1. **Clone and Setup**:
   ```bash
   git clone <repository>
   cd accuflow
   cp .env.example .env
   cp backend/.env.example backend/.env
   ```

2. **Configure Environment**:
   Edit `.env` and `backend/.env` with your domains and secrets:
   ```bash
   # .env
   FRONTEND_DOMAIN=accuflow.local
   BACKEND_DOMAIN=api.accuflow.local
   JWT_SECRET=your-super-secret-jwt-key
   ACME_EMAIL=your-email@domain.com
   ```

3. **Start with Docker Compose**:
   ```bash
   docker-compose up -d
   ```

4. **Run Database Migrations**:
   ```bash
   docker-compose exec backend npm run migrate
   ```

5. **Access the Application**:
   - Frontend: https://accuflow.local
   - Backend API: https://api.accuflow.local
   - Traefik Dashboard: http://traefik.accuflow.local:8080

## Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run migrate
npm run dev
```

### Frontend Setup
```bash
npm install
cp .env.example .env.local
# Edit .env.local with your API URL
npm run dev
```

## Architecture

### Frontend Structure
```
src/
├── components/
│   ├── admin/          # Admin-only components
│   ├── user/           # User dashboard components
│   ├── auth/           # Authentication components
│   └── common/         # Shared components
├── contexts/           # React contexts
├── services/           # API and business logic
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### Backend Structure
```
backend/src/
├── routes/             # API route handlers
├── middleware/         # Express middleware
├── services/           # Business logic services
├── types/              # TypeScript interfaces
├── config/             # Configuration files
└── migrations/         # Database migrations
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Business Management
- `GET /api/businesses` - List user's businesses
- `POST /api/businesses` - Create new business
- `PUT /api/businesses/:id` - Update business
- `DELETE /api/businesses/:id` - Delete business

### Accounting
- `GET /api/accounts/business/:businessId` - Get chart of accounts
- `POST /api/accounts` - Create account
- `GET /api/transactions/business/:businessId` - Get transactions
- `POST /api/transactions` - Create transaction

### Integrations
- `GET /api/integrations/business/:businessId` - List integrations
- `POST /api/integrations` - Connect integration
- `POST /api/integrations/:id/sync` - Sync integration

### Reports
- `GET /api/reports/profit-loss/:businessId` - P&L report
- `GET /api/reports/balance-sheet/:businessId` - Balance sheet
- `GET /api/reports/cash-flow/:businessId` - Cash flow report

### Admin (Admin Only)
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/users` - List all users
- `POST /api/invitations` - Send invitation
- `POST /api/invitations/super-account` - Create super free account

## Account Types

1. **Paid Accounts**: Full access, multiple businesses, unlimited transactions
2. **Free Accounts**: 1 business, 500 transactions/month, basic integrations
3. **Super Free Accounts**: Unlimited everything, no billing required
4. **Invited Accounts**: Free accounts created via admin invitation

## Deployment

### Production Deployment
1. Set up your server with Docker and Docker Compose
2. Configure your domain DNS to point to your server
3. Update `.env` with production values
4. Run: `docker-compose -f docker-compose.yml up -d`

### SSL Certificates
Traefik automatically handles SSL certificates via Let's Encrypt.

### Backup Strategy
- Database: Regular PostgreSQL backups
- Files: Backup docker volumes and configuration files

## Security Features

- JWT authentication with secure tokens
- Role-based access control
- Rate limiting on API endpoints
- Input validation and sanitization
- SQL injection prevention via parameterized queries
- XSS protection headers
- CORS configuration
- Secure password hashing with bcrypt

## Integration Framework

The platform supports multiple payment integrations:

- **Stripe**: Credit card processing
- **Square**: POS and online payments
- **PayPal**: Digital payments
- **Venmo**: P2P payments
- **CashApp**: Mobile payments
- **NMI**: Payment gateway
- **Paysley**: Modern payment processing

Each integration supports:
- OAuth or API key authentication
- Automatic transaction sync
- Webhook handling
- Real-time updates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics and insights
- [ ] Multi-currency support
- [ ] Inventory management
- [ ] Payroll integration
- [ ] Tax preparation features
- [ ] API rate limiting improvements
- [ ] Advanced user permissions