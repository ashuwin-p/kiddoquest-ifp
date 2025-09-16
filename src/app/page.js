export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-8 max-w-4xl">
        {/* Hero Section */}
        <div className="space-y-6">
          <h1 className="font-display text-6xl md:text-8xl text-primary-500 animate-bounce-slow">
            Kiddo Quest
          </h1>
          <p className="font-playful text-2xl md:text-3xl text-gray-700 leading-relaxed">
            Web app to develop life skills in children
          </p>
          <p className="font-body text-lg text-gray-600 max-w-2xl mx-auto">
            Fun, interactive games and activities designed to help children learn essential life skills 
            while having a blast! Join thousands of kids on their learning adventure.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="/login" 
            className="group relative px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-playful text-xl rounded-2xl shadow-colorful transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
          >
            <span className="relative z-10"> Login</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </a>
          
          <a 
            href="/register" 
            className="group relative px-8 py-4 bg-secondary-500 hover:bg-secondary-600 text-white font-playful text-xl rounded-2xl shadow-playful transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
          >
            <span className="relative z-10"> Register</span>
            <div className="absolute inset-0 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </a>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-playful hover:shadow-colorful transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-4xl mb-4"></div>
            <h3 className="font-display text-xl text-primary-600 mb-2">Life Skills</h3>
            <p className="font-body text-gray-600">Learn essential skills through fun activities</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-playful hover:shadow-colorful transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-4xl mb-4"></div>
            <h3 className="font-display text-xl text-secondary-600 mb-2">Creative Learning</h3>
            <p className="font-body text-gray-600">Engaging games that spark creativity</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-playful hover:shadow-colorful transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-4xl mb-4"></div>
            <h3 className="font-display text-xl text-success-600 mb-2">Achievements</h3>
            <p className="font-body text-gray-600">Track progress and celebrate milestones</p>
          </div>
        </div>
      </div>
    </main>
  );
}
