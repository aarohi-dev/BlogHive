import {useRouter} from "next/router";
import Layout from "../components/Layout";
import projects from "../data/projects.json";

export default function ProjectDetail(){
    const router = useRouter();
    const {slug} = router.query;

    const project = projects.find((p) => p.slug === slug);

    if(!project){
        return(
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading...</h2>
                        <p className="text-gray-600">Please wait while we load the content</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return(
        <Layout>
            <div className="max-w-4xl mx-auto">
               
                <nav className="mb-8">
                    <ol className="flex items-center space-x-2 text-sm text-gray-600">
                        <li>
                            <button 
                                onClick={() => router.push("/")}
                                className="hover:text-indigo-600 transition-colors duration-200"
                            >
                                Home
                            </button>
                        </li>
                        <li>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </li>
                        <li className="text-gray-800 font-medium">{project.title}</li>
                    </ol>
                </nav>

                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                        {project.title}
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed max-w-3xl">
                        {project.desc}
                    </p>
                </header>

                <div className="relative mb-12">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-96 md:h-[500px] object-cover rounded-2xl shadow-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl"></div>
                </div>

                <article className="prose prose-lg max-w-none">
                    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
                        <p className="text-gray-700 leading-relaxed text-lg mb-8">
                            {project.content}
                        </p>
                        
                        <div className="space-y-8">
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">Key Takeaways</h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                        <span>Learn practical implementation strategies</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                        <span>Understand best practices and common pitfalls</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                        <span>Get actionable insights for your projects</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="border-t border-gray-100 pt-8">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Related Topics</h3>
                                <div className="flex flex-wrap gap-3">
                                    {['Web Development', 'React', 'Next.js', 'Tailwind CSS', 'UI/UX'].map((tag) => (
                                        <span key={tag} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-indigo-100 hover:text-indigo-700 transition-colors duration-200 cursor-pointer">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </article>


                <div className="flex flex-col sm:flex-row gap-4 mt-12">
                    <button
                        onClick={() => router.push("/")}
                        className="flex items-center justify-center px-8 py-4 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all duration-300 font-semibold"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </button>
                    
                    <button className="flex items-center justify-center px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-xl hover:bg-indigo-50 transition-all duration-300 font-semibold">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                        Share Article
                    </button>
                </div>
            </div>
        </Layout>
    );
}