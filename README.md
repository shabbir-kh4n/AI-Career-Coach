# 🚀 AI Career Coach

An intelligent web application that empowers users to create professional resumes, generate tailored cover letters, and practice technical interviews with AI-powered guidance. Built with modern web technologies and backed by Google's Generative AI.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.4-black?logo=nextjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)

---

## ✨ Features

### 📄 **Resume Builder**
- Guided step-by-step resume creation form
- AI-powered content improvement suggestions
- Real-time preview in markdown format
- PDF export functionality
- Auto-save to database

### 📝 **Cover Letter Generator**
- Generate tailored cover letters for specific job positions
- Company and role-specific customization
- Professional markdown formatting
- View and manage all generated cover letters
- Edit and delete saved drafts

### 🎯 **Interview Preparation**
- Generate industry-specific technical interview questions
- Multiple choice format with explanations
- Real-time scoring and feedback
- AI-generated improvement tips based on weak areas
- Performance analytics and progress tracking
- Quiz history and detailed results

### 📊 **Dashboard**
- Industry insights and trends
- Performance statistics and charts
- Assessment tracking
- Quick access to all tools

### 🔐 **User Management**
- Secure authentication with Clerk
- User onboarding flow
- Profile management
- Personalized experience based on industry and skills

---

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15.1.4** - React framework with App Router
- **React 19.0.0** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless component library
- **Lucide React** - Beautiful icon library
- **React Hook Form** - Efficient form handling
- **Zod** - TypeScript-first schema validation

### **Backend**
- **Next.js API Routes** - Serverless functions
- **Prisma ORM** - Database management
- **PostgreSQL** - Relational database

### **AI & Integrations**
- **Google Generative AI** - AI model: `gemini-2.5-flash`
- **Clerk** - Authentication & user management
- **Inngest** - Background jobs and cron tasks

### **Development Tools**
- **ESLint** - Code quality
- **Turbopack** - Fast builds
- **npm** - Package management

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm
- PostgreSQL database
- Google Generative AI API key
- Clerk authentication account

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/shabbir-kh4n/ai-career-coach.git
   cd ai-career-coach
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Configure your `.env.local`:
   ```env
   # Database
   DATABASE_URL=postgresql://user:password@localhost:5432/ai_career_coach

   # Google AI
   GEMINI_API_KEY=your_google_generative_api_key

   # Clerk Authentication
   CLERK_PUBLISHABLE_KEY=pk_your_clerk_key
   CLERK_SECRET_KEY=sk_your_clerk_secret

   # Optional
   LOG_LEVEL=info
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
ai-career-coach/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   ├── (main)/                   # Main application routes
│   │   ├── dashboard/            # Dashboard page
│   │   ├── resume/               # Resume builder
│   │   ├── ai-cover-letter/      # Cover letter generator
│   │   ├── interview/            # Interview preparation
│   │   └── onboarding/           # User onboarding
│   ├── api/                      # API routes
│   └── layout.js                 # Root layout with providers
│
├── components/                   # React components
│   ├── ui/                       # Reusable UI components
│   ├── header.jsx                # Navigation header
│   ├── footer.jsx                # Application footer
│   ├── error-boundary.jsx        # Error handling boundary
│   └── theme-provider.jsx        # Theme configuration
│
├── actions/                      # Server actions
│   ├── resume.js                 # Resume operations
│   ├── cover-letter.js           # Cover letter operations
│   ├── interview.js              # Interview operations
│   └── dashboard.js              # Dashboard operations
│
├── lib/                          # Utility functions
│   ├── ai-service.js             # AI integration
│   ├── config.js                 # Centralized configuration
│   ├── errors.js                 # Custom error classes
│   ├── logger.js                 # Structured logging
│   ├── validation.js             # Zod schemas
│   ├── env-validator.js          # Environment validation
│   ├── prisma.js                 # Database client
│   └── utils.js                  # Helper functions
│
├── hooks/                        # React hooks
│   └── use-fetch.js              # Data fetching hook
│
├── prisma/                       # Database schema
│   ├── schema.prisma             # Prisma schema
│   └── migrations/               # Database migrations
│
├── data/                         # Static data
│   ├── features.js               # Feature definitions
│   ├── testimonials.js           # User testimonials
│   ├── faqs.js                   # FAQ content
│   └── industries.js             # Industry data
│
├── public/                       # Static assets
│   ├── logo.png
│   └── images/
│
├── .env.example                  # Environment template
├── package.json                  # Dependencies
├── next.config.mjs              # Next.js configuration
├── tailwind.config.mjs          # Tailwind configuration
└── README.md                    # This file
```

---

## 🔧 Configuration

### **Environment Variables**

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `GEMINI_API_KEY` | ✅ | Google Generative AI API key |
| `CLERK_PUBLISHABLE_KEY` | ✅ | Clerk public key |
| `CLERK_SECRET_KEY` | ✅ | Clerk secret key |
| `LOG_LEVEL` | ❌ | Logging level (debug, info, warn, error) |
| `NODE_ENV` | ❌ | Environment (development, production, test) |

### **AI Model Configuration**

The app uses **Google's Gemini 2.5 Flash** model with:
- **Temperature**: 0.7 (balanced creativity)
- **Max Tokens**: 2048
- **Timeout**: 30 seconds

---

## 📚 Usage

### **For Users**

1. **Sign up** using Clerk authentication
2. **Complete onboarding** - Select your industry and skills
3. **Build your resume** - Step-by-step guided form
4. **Generate cover letters** - Customized for each job
5. **Practice interviews** - Take quiz, review answers, improve
6. **Track progress** - View analytics on dashboard

### **For Developers**

**Running Tests**
```bash
npm run test
```

**Building for Production**
```bash
npm run build
npm run start
```

**Linting**
```bash
npm run lint
```

---

## 🎯 Key Improvements & Architecture

### **Error Handling System** 
- Custom error classes for different scenarios
- Structured error responses with context
- Graceful error boundaries in React

### **AI Service Layer**
- Singleton AI client (initialized once)
- Specialized functions for each use case
- Automatic JSON parsing and error recovery
- Request/response logging and timeout protection

### **Logging System**
- Structured logging with multiple levels
- User action tracking
- Performance monitoring (operation durations)
- Both JSON and text output formats

### **Input Validation**
- Zod schemas for all inputs
- Type-safe validation
- Clear error messages

### **Environment Validation**
- Startup validation of required variables
- Format checking for sensitive configs
- Helpful error messages

---

## 🔐 Security Features

- ✅ **Authentication** - Secure Clerk integration
- ✅ **Authorization** - Server-side action validation
- ✅ **Input Validation** - Zod schemas prevent invalid data
- ✅ **Error Boundaries** - Prevent sensitive data leaks
- ✅ **Environment Isolation** - Secrets never exposed to client
- ✅ **API Protection** - Server actions prevent direct API calls

---

## 📊 API Endpoints

### **Authentication** (Clerk)
- `POST /sign-up` - User registration
- `POST /sign-in` - User login

### **Resume Operations** (Server Actions)
- `POST /actions/resume.js:saveResume` - Save resume content
- `GET /actions/resume.js:getResume` - Retrieve user's resume
- `POST /actions/resume.js:improveWithAI` - AI content improvement

### **Cover Letter Operations** (Server Actions)
- `POST /actions/cover-letter.js:generateCoverLetter` - Generate letter
- `GET /actions/cover-letter.js:getCoverLetters` - List all letters
- `GET /actions/cover-letter.js:getCoverLetter` - Get specific letter
- `DELETE /actions/cover-letter.js:deleteCoverLetter` - Delete letter

### **Interview Operations** (Server Actions)
- `POST /actions/interview.js:generateQuiz` - Generate questions
- `POST /actions/interview.js:saveQuizResult` - Save quiz results
- `GET /actions/interview.js:getAssessments` - Get assessment history

---

## 🚦 Performance Optimization

- **Turbopack** - Fast development builds
- **Image Optimization** - Next.js Image component
- **Code Splitting** - Automatic route-based splitting
- **Lazy Loading** - On-demand component loading
- **Caching** - Database query and API response caching
- **Database** - Indexed queries for fast lookups

---

## 🐛 Troubleshooting

### **"GEMINI_API_KEY is not set"**
- Ensure you have a `.env.local` file with the API key
- Restart the development server after adding env vars

### **"User not found"**
- Complete the onboarding flow first
- Check if user exists in database

### **"Failed to generate AI content"**
- Check API quota limits
- Verify internet connection
- Check if API key is still valid

### **Database Connection Issues**
- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Run migrations: `npx prisma migrate dev`

---

## 🤝 Contributing

Contributions are welcome! Here's how to help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Development Guidelines**
- Follow existing code style
- Add comments for complex logic
- Test new features
- Update documentation

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💼 Author

**Gulam Shabbir Khan**

- 🔗 [GitHub](https://github.com/shabbir-kh4n)
- 💼 [LinkedIn](https://www.linkedin.com/in/gulam-shabbir-khan-530528223/)
- 🐦 [Twitter](https://x.com/Shabbir28604516)
- 📧 [Email](mailto:helloshabbirkhanhi@gmail.com)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - ORM
- [Clerk](https://clerk.com/) - Authentication
- [Google Generative AI](https://ai.google.dev/) - AI models
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - Components

---

## 📞 Support

For issues, questions, or suggestions:
- 📧 Email: helloshabbirkhanhi@gmail.com
- 🐛 [GitHub Issues](https://github.com/shabbir-kh4n/ai-career-coach/issues)
- 💬 [GitHub Discussions](https://github.com/shabbir-kh4n/ai-career-coach/discussions)

---

## 📈 Roadmap

- [ ] Advanced resume templates
- [ ] LinkedIn profile integration
- [ ] Job posting analysis
- [ ] Salary negotiation tips
- [ ] Mobile app (React Native)
- [ ] Team collaboration features
- [ ] Admin dashboard
- [ ] Analytics & reporting

---

**Made with ❤️ by Shabbir**

⭐ If you find this helpful, please consider giving it a star on GitHub!

---

## 📊 Project Stats

- **Lines of Code**: 5000+
- **Components**: 30+
- **Pages**: 8+
- **Database Models**: 6+
- **API Endpoints**: 10+
- **Supported Industries**: 50+
- **Interview Questions**: 1000+
