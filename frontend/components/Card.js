import Link from "next/link";

export default function Card({item}){
    return(
        <Link href={`/${item.slug}`} className="block group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 border border-gray-100 overflow-hidden">
                <div className="relative overflow-hidden rounded-xl mb-6">
                    <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2">
                        {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {item.desc}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                        <span className="text-indigo-600 font-semibold text-sm group-hover:text-indigo-700 transition-colors duration-300">
                            Read More →
                        </span>
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition-colors duration-300">
                            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}