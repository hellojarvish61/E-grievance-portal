import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { user } = useAuth();

  // Features data
  const features = [
    {
      icon: "🔒",
      title: "Complete Anonymity",
      description:
        "Your identity is protected. Submit complaints without fear of identification.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: "⚡",
      title: "Quick Resolution",
      description:
        "Fast-track your complaints to the right department for immediate action.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: "📊",
      title: "Track Progress",
      description:
        "Monitor your complaint status in real-time with unique tracking IDs.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: "🎯",
      title: "Priority System",
      description:
        "Urgent issues get immediate attention with our smart priority system.",
      color: "from-green-500 to-emerald-500",
    },
  ];

  // Categories
  const categories = [
    { name: "Academics", icon: "📚", color: "bg-blue-100 text-blue-700" },
    {
      name: "Infrastructure",
      icon: "🏗️",
      color: "bg-purple-100 text-purple-700",
    },
    { name: "Hostel", icon: "🏠", color: "bg-green-100 text-green-700" },
    { name: "Library", icon: "📖", color: "bg-orange-100 text-orange-700" },
    { name: "Canteen", icon: "🍽️", color: "bg-pink-100 text-pink-700" },
    { name: "Others", icon: "📋", color: "bg-cyan-100 text-cyan-700" },
  ];

  // Stats
  const stats = [
    { label: "Active Users", value: "500+", icon: "👥" },
    { label: "Resolved Issues", value: "1,200+", icon: "✅" },
    { label: "Response Time", value: "<24h", icon: "⚡" },
    { label: "Satisfaction Rate", value: "95%", icon: "⭐" },
  ];

  // How it works steps
  const steps = [
    {
      number: "1",
      title: "Submit Complaint",
      description:
        "Fill out a simple form describing your issue with necessary details.",
      icon: "📝",
    },
    {
      number: "2",
      title: "Get Tracking ID",
      description:
        "Receive a unique ID to track your complaint status anytime.",
      icon: "🔖",
    },
    {
      number: "3",
      title: "Admin Review",
      description:
        "Our team reviews and assigns your complaint to the right department.",
      icon: "👨‍💼",
    },
    {
      number: "4",
      title: "Get Resolution",
      description:
        "Receive updates and responses until your issue is fully resolved.",
      icon: "✅",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                E-Grievance Portal
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Link
                  to={
                    user.role === "student"
                      ? "/student/dashboard"
                      : user.role === "teacher"
                      ? "/teacher/dashboard"
                      : "/admin/dashboard"
                  }
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-6 py-2 text-gray-700 font-semibold hover:text-gray-900 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 opacity-50"></div>

        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
              Your Voice,{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Our Priority
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              A safe, anonymous platform to raise your concerns and get them
              resolved efficiently. Your feedback drives positive change! 🚀
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
              >
                <span className="flex items-center">
                  Get Started
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </span>
              </Link>
              <Link
                to="/track"
                className="px-8 py-4 bg-white text-gray-800 text-lg font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg border-2 border-gray-200"
              >
                <span className="flex items-center">🔍 Track Complaint</span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>100% Anonymous</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>24/7 Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center transform hover:scale-110 transition-transform duration-300"
              >
                <div className="text-5xl mb-3">{stat.icon}</div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Us? ✨
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with students in mind, designed for efficiency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
                ></div>

                <div className="relative">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-3xl mb-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Complaint Categories 📂
            </h2>
            <p className="text-xl text-gray-600">
              We cover all aspects of campus life
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className={`${category.color} rounded-xl p-6 text-center hover:scale-110 transition-transform duration-300 cursor-pointer shadow-md hover:shadow-xl`}
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <div className="font-bold">{category.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works 🚀
            </h2>
            <p className="text-xl text-gray-600">
              Simple, fast, and effective - just 4 steps to resolution
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                  {/* Step Number */}
                  <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="text-6xl mb-6 text-center mt-4">
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connector Arrow (hidden on last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-4xl text-blue-400">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Make a Difference? 💪
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of students who are making their campus better, one
            complaint at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-blue-600 text-lg font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-2xl transform hover:-translate-y-1"
            >
              Create Account Now
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-transparent border-2 border-white text-white text-lg font-bold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Already Have Account?
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                E-Grievance Portal
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Making campus life better through transparent communication and
                swift action.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/login" className="hover:text-white transition">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-white transition">
                    Register
                  </Link>
                </li>
                <li>
                  <Link to="/track" className="hover:text-white transition">
                    Track Complaint
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Categories</h4>
              <ul className="space-y-2">
                <li className="hover:text-white transition cursor-pointer">
                  Academics
                </li>
                <li className="hover:text-white transition cursor-pointer">
                  Infrastructure
                </li>
                <li className="hover:text-white transition cursor-pointer">
                  Hostel
                </li>
                <li className="hover:text-white transition cursor-pointer">
                  Library
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="mr-2">📧</span>
                  <span>support@egrievance.com</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📞</span>
                  <span>+91 1234567890</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🏢</span>
                  <span>Campus Office</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 E-Grievance Portal. Made with ❤️ for students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
