import React, { useState } from 'react';
import { Calendar, Clock, BookOpen, Plus, Edit2, Trash2, ArrowRight } from 'lucide-react';
import { BlogPost } from '../../types';
import { LionFaceLogo } from '../common/LionFaceLogo';
import { BlogPostModal } from './BlogPostModal';

interface BlogSectionProps {
  posts: BlogPost[];
  isCuratorMode: boolean;
  onOpenCreatePost: () => void;
  onOpenEditPost: (post: BlogPost) => void;
  onDeletePost: (id: string) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  posts,
  isCuratorMode,
  onOpenCreatePost,
  onOpenEditPost,
  onDeletePost,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');
  const [activeReadingPost, setActiveReadingPost] = useState<BlogPost | null>(null);

  const categories = ['Alle', 'Kreativprozess', 'Schulprojekt', 'Fotografie', 'Gedanken'];

  const filteredPosts = selectedCategory === 'Alle'
    ? posts
    : posts.filter((p) => p.category === selectedCategory);

  return (
    <section className="py-12 lg:py-20 border-b border-[#e7e5e0] bg-[#faf9f6]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2.5 text-xs uppercase tracking-[0.25em] text-stone-500 font-mono mb-2">
              <LionFaceLogo size={16} color="#b8860b" />
              <span>Schüler-Portfolio &amp; Notizen</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span><strong className="text-gold font-medium">Navid Ali Bhatti</strong></span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 tracking-tight">
              Kreativ-Blog &amp; Skizzenbuch
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {isCuratorMode && (
              <button
                onClick={onOpenCreatePost}
                className="px-4 py-2 text-xs uppercase tracking-wider font-medium bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl cursor-pointer flex items-center gap-2 shadow-xs transition-transform active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Neuer Beitrag</span>
              </button>
            )}

            <p className="text-xs text-stone-600 max-w-sm font-light leading-relaxed hidden sm:block">
              Persönliche Einblicke in den gestalterischen Lernprozess, Schulprojekte, Dunkelkammer-Experimente und Skizzen.
            </p>
          </div>
        </div>

        {/* Category Filter Pills (Touch-friendly) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs rounded-xl font-medium tracking-wider transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white border border-[#e5e3dc] text-stone-600 hover:text-black hover:border-stone-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col bg-white border border-[#e5e3dc] hover:border-[#c59b27]/60 hover:shadow-[0_20px_45px_-15px_rgba(197,155,39,0.18)] transition-all duration-300 rounded-2xl sm:rounded-3xl overflow-hidden justify-between"
            >
              <div>
                {/* Curved Picture Frame */}
                <div className="p-2 sm:p-2.5 pb-0">
                  <div
                    onClick={() => setActiveReadingPost(post)}
                    className="relative aspect-[16/9] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-stone-950 cursor-pointer shadow-xs"
                  >
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />

                    {/* Category badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-stone-900/85 backdrop-blur-md border border-[#c59b27]/30 text-[10px] tracking-widest uppercase text-gold-light font-mono rounded-full">
                      {post.category}
                    </div>

                    {/* Curator Quick Actions */}
                    {isCuratorMode && (
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenEditPost(post);
                          }}
                          title="Beitrag bearbeiten"
                          className="p-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg shadow-md cursor-pointer transition-transform hover:scale-105"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Diesen Blogbeitrag wirklich löschen?')) {
                              onDeletePost(post.id);
                            }
                          }}
                          title="Beitrag löschen"
                          className="p-1.5 bg-rose-500 hover:bg-rose-400 text-white rounded-lg shadow-md cursor-pointer transition-transform hover:scale-105"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6">
                  {/* Meta date & read time */}
                  <div className="flex items-center gap-3 text-xs text-stone-500 font-mono mb-2.5">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gold" />
                      <span>{post.date}</span>
                    </div>
                    <span aria-hidden="true" className="text-stone-300">·</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gold" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <h3
                    onClick={() => setActiveReadingPost(post)}
                    className="font-serif text-xl sm:text-2xl font-light text-stone-900 group-hover:text-gold transition-colors cursor-pointer mb-3 leading-snug"
                  >
                    {post.title}
                  </h3>

                  <p className="text-xs text-stone-600 font-light leading-relaxed line-clamp-3">
                    {post.summary || post.content}
                  </p>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="p-5 sm:p-6 pt-0 border-t border-stone-100 flex items-center justify-between mt-4">
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-stone-500">
                  {post.tags?.slice(0, 2).map((t, idx) => (
                    <span key={idx} className="bg-stone-100 px-2 py-0.5 rounded">
                      #{t}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setActiveReadingPost(post)}
                  className="text-xs uppercase tracking-wider font-medium text-stone-900 group-hover:text-gold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Lesen</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Reader Modal */}
      <BlogPostModal
        post={activeReadingPost}
        isOpen={activeReadingPost !== null}
        onClose={() => setActiveReadingPost(null)}
      />
    </section>
  );
};
