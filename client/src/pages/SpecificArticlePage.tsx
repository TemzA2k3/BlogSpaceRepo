export const SpecificArticlePage = () => {
    return (
      <div className="min-h-screen dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6 text-gray-600 dark:text-gray-400">
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
              Technology
            </a>
            <span>/</span>
            <span>AI</span>
          </div>
  
          {/* Article Header */}
          <article className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6 sm:p-10 transition-colors duration-300">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              The Future of AI: A Comprehensive Analysis
            </h1>
  
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
              <span>By Sophia Carter</span>
              <span>•</span>
              <span>Published on January 15, 2024</span>
              <span>•</span>
              <span>15 min read</span>
            </div>
  
            {/* Hero Image */}
            <div className="mb-8 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <img
                src="/futuristic-city-skyline-with-skyscrapers.jpg"
                alt="Futuristic city skyline"
                className="w-full h-auto object-cover"
              />
            </div>
  
            {/* Article Content */}
            <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-200">
              <p className="leading-relaxed mb-6">
                Artificial intelligence (AI) is rapidly transforming our world, impacting industries from healthcare to
                finance. This article delves into the current state of AI, exploring its potential benefits and
                challenges. We'll examine how AI is being used to solve complex problems, improve efficiency, and create
                new opportunities. However, we'll also address concerns about job displacement, ethical considerations,
                and the need for responsible AI development.
              </p>
  
              <h2 className="text-3xl font-bold mt-10 mb-4 text-gray-900 dark:text-gray-100">
                Key Developments in AI
              </h2>
              <p className="leading-relaxed mb-6">
                Recent advancements in machine learning, particularly deep learning, have fueled significant progress in
                AI. These techniques enable AI systems to learn from vast amounts of data, improving their performance
                over time. Examples include image recognition, natural language processing, and predictive analytics.
                Companies are increasingly integrating AI into their operations, leading to increased automation and
                data-driven decision-making.
              </p>
  
              <h2 className="text-3xl font-bold mt-10 mb-4 text-gray-900 dark:text-gray-100">
                Ethical Considerations
              </h2>
              <p className="leading-relaxed mb-6">
                As AI becomes more sophisticated, ethical considerations become paramount. Issues such as bias in
                algorithms, data privacy, and the potential for misuse need careful attention. Ensuring fairness,
                transparency, and accountability in AI systems is crucial for building trust and maximizing the benefits
                of this technology. The development of ethical guidelines and regulations is essential to navigate these
                challenges effectively.
              </p>
  
              <h2 className="text-3xl font-bold mt-10 mb-4 text-gray-900 dark:text-gray-100">
                The Future of AI
              </h2>
              <p className="leading-relaxed mb-8">
                The future of AI holds immense promise. We can expect to see AI playing an even greater role in our daily
                lives, from personalized healthcare to smart cities. Continued research and development will lead to more
                advanced AI systems capable of tackling complex problems and driving innovation across various sectors.
                However, it's crucial to approach AI development responsibly, addressing ethical concerns and ensuring
                that AI benefits all of humanity.
              </p>
            </div>
  
            {/* Interaction Buttons */}
            <div className="flex items-center justify-between py-6 border-t border-b border-gray-200 dark:border-gray-700 my-8">
              <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors group">
                <i className="fa-regular fa-heart w-5 h-5"></i>
                <span className="text-sm font-medium">234</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">
                <i className="fa-regular fa-comment w-5 h-5"></i>
                <span className="text-sm font-medium">56</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors">
                <i className="fa-solid fa-share w-5 h-5"></i>
                <span className="text-sm font-medium">123</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-yellow-500 transition-colors">
                <i className="fa-regular fa-bookmark w-5 h-5"></i>
                <span className="text-sm font-medium">89</span>
              </button>
            </div>
          </article>

          {/* Comments Section */}
          <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6 sm:p-10 transition-colors duration-300 mt-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Comments</h2>
              <div className="space-y-6">
                {/* Comment 1 */}
                <div className="flex gap-4">
                  <i className="fa-regular fa-user w-10 h-10 text-gray-500 dark:text-gray-400 text-3xl"></i>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">Mark Thompson</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">2 days ago</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      Great article! I especially appreciated the section on ethical considerations. It's something we
                      need to discuss more.
                    </p>
                  </div>
                </div>
  
                {/* Comment 2 */}
                <div className="flex gap-4 ml-12">
                  <i className="fa-regular fa-user w-10 h-10 text-gray-500 dark:text-gray-400 text-3xl"></i>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">Emily Clark</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">1 day ago</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      I agree, Mark. The ethical implications of AI are often overlooked. This article provides a good
                      overview of the key issues.
                    </p>
                  </div>
                </div>
  
                {/* Comment 3 */}
                <div className="flex gap-4">
                  <i className="fa-regular fa-user w-10 h-10 text-gray-500 dark:text-gray-400 text-3xl"></i>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">David Lee</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">1 day ago</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      The future of AI is exciting, but we need to be cautious. The potential for job displacement is a
                      real concern that needs to be addressed proactively.
                    </p>
                  </div>
                </div>
              </div>
            </section>
        </main>
      </div>
    );
  };
  