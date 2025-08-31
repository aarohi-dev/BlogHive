import Layout from "../components/Layout";
import Card from "../components/Card";
import SearchBar from "../components/SearchBar";
import projects from "../data/projects.json"
import {useState} from "react";

export default function HomePage(){
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProjects = projects.filter((p) => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.desc.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return(
        <Layout>
            <div className="space-y-12">
                
                <header className="text-center py-16 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl px-6">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Welcome to BlogHive
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Discover amazing projects and insights from developers around the world
                    </p>
                    <SearchBar onSearch={setSearchTerm}/>                           {/*substituting the search term to const [query, setQuery] = useState(""); part */}
                </header>

                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {searchTerm ? `Search Results (${filteredProjects.length})` : 'Featured Projects'}
                        </h2>
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm("")}
                                className="text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                    
                    {/*this part is for rendering the desired card of blog as per user's search */}
                    {filteredProjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProjects.map((item, index) => (
                                <div 
                                    key={item.id} 
                                    className="animate-fade-in"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <Card item={item}/>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No results found</h3>
                            <p className="text-gray-600">Try adjusting your search terms or browse all projects</p>
                        </div>
                    )}
                </section>
            </div>
        </Layout>
    );
}