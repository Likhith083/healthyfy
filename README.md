# Health Service Portal

A modern healthcare platform that connects patients with healthcare professionals, manages appointments, and provides comprehensive health management tools.

## Features

### Patient Features
- **Smart Doctor Matching**: AI-powered system to match patients with the right specialists based on symptoms
- **Appointment Management**: Schedule, reschedule, and manage appointments with ease
- **Medical Records**: Secure access to medical history, prescriptions, and test results
- **Health Tracking**: Monitor health metrics and track progress over time
- **Patient Dashboard**: Comprehensive view of appointments, medical history, and health status
- **Doctor Reviews**: Rate and review healthcare providers
- **Health Education**: Access to medical articles and health tips
- **Community Support**: Connect with other patients through forums

### Doctor Features
- **Patient Queue Management**: Efficiently manage patient appointments and schedules
- **Medical Records Access**: Quick access to patient history and records
- **Prescription Management**: Digital prescription system
- **Performance Analytics**: Track patient outcomes and satisfaction
- **Availability Management**: Set and manage availability schedules
- **Patient Communication**: Secure messaging system with patients

### Admin Features
- **Analytics Dashboard**: Comprehensive view of system usage and performance
- **User Management**: Manage patients, doctors, and staff accounts
- **Content Management**: Manage health articles and educational content
- **System Monitoring**: Track system performance and usage patterns

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **State Management**: React Context
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL
- **AI Integration**: Google AI API for doctor matching
- **Testing**: Jest, React Testing Library

## Prerequisites

- Node.js 18.x or higher
- PostgreSQL 14.x or higher
- npm or yarn package manager
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/health-service-portal.git
cd health-service-portal
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your configuration:
```
DATABASE_URL=postgresql://user:password@localhost:5432/health_portal
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
GOOGLE_AI_API_KEY=your-google-ai-api-key
```

4. Set up the database:
```bash
npm run db:migrate
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Sample Accounts

For demonstration purposes, the following sample accounts are pre-configured with appointments and interactions:

### Sample Patient Account
- **Email**: patient@healthmatch.direct
- **Password**: patient123
- **Name**: Sarah Johnson
- **Role**: Patient

### Sample Doctor Account
- **Email**: cardio@healthmatch.direct
- **Password**: password123
- **Name**: Dr. Eve Heartwell
- **Role**: Doctor
- **Specialization**: Cardiologist

### Sample Interactions
The sample accounts have the following pre-configured interactions:

1. **Appointments**:
   - Initial Consultation (Completed)
     - Date: 2024-03-15
     - Status: Completed
     - Notes: Initial assessment of heart condition
     - Prescription: Beta blockers prescribed
   
   - Follow-up Appointment (Scheduled)
     - Date: 2024-04-01
     - Status: Scheduled
     - Reason: Medication effectiveness check
   
   - Emergency Visit (Completed)
     - Date: 2024-03-20
     - Status: Completed
     - Notes: Chest pain evaluation
     - Prescription: Updated medication dosage

2. **Medical History**:
   - Diagnosed with mild hypertension
   - Regular blood pressure monitoring
   - ECG results from initial consultation
   - Medication history with beta blockers

3. **Communication**:
   - Multiple secure messages between patient and doctor
   - Appointment scheduling discussions
   - Medication adjustment queries
   - Test result discussions

To test the system:
1. Log in as the patient to view appointments, medical history, and communicate with the doctor
2. Log in as the doctor to manage appointments, view patient records, and respond to messages
3. Try scheduling new appointments and sending messages between accounts

## Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run lint`: Run ESLint
- `npm run test`: Run tests
- `npm run db:migrate`: Run database migrations
- `npm run db:seed`: Seed the database with sample data

### Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # React components
│   ├── ui/          # UI components
│   ├── patient/     # Patient-specific components
│   ├── doctor/      # Doctor-specific components
│   └── admin/       # Admin-specific components
├── lib/             # Utility functions and configurations
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
└── styles/          # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@healthportal.com or join our Slack channel.
