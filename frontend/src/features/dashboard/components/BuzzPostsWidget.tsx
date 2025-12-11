import * as React from 'react';
import { useBuzzPosts } from '../hooks/useBuzzPosts';
import { WidgetContainer } from './WidgetContainer';

export const BuzzPostsWidget: React.FC = () => {
  const { data, loading, error, refetch } = useBuzzPosts(5);

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Just now';
    }
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }
    return date.toLocaleDateString();
  };

  return (
    <WidgetContainer
      title="Buzz Latest Posts"
      loading={loading}
      error={error}
      onRetry={refetch}
      emptyState={<p>No posts available</p>}
    >
      {data && data.length > 0 && (
        <div className="space-y-4" role="list">
          {data.map((post) => (
            <article
              key={post.id}
              className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-start gap-3">
                {post.author.profilePicture ? (
                  <img
                    src={post.author.profilePicture}
                    alt={post.author.displayName || post.author.name}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                    {(post.author.displayName || post.author.name || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900">
                      {post.author.displayName || post.author.name}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(post.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">{post.content}</p>
                  {post.images && post.images.length > 0 && (
                    <div className="mt-2 flex gap-2">
                      {post.images.slice(0, 2).map((image, idx) => (
                        <img
                          key={idx}
                          src={image.thumbnail}
                          alt=""
                          className="h-16 w-16 rounded object-cover"
                        />
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>👍 {post.likes}</span>
                    <span>💬 {post.comments}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </WidgetContainer>
  );
};

