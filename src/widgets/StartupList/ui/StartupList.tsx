import { StartupCard } from "@/src/entities/StartupCard";
import { StartupListProps } from "./StartupList.props";
import { formatDate } from "@/src/shared/lib";

export const StartupList: React.FC<StartupListProps> = ({ posts }) => {
  return (
    <>
      {posts?.length > 0 && (
        <ul className="mt-7 card_grid">
          {posts.map((post) => (
            <li key={post._id} className="startup-card group">
              <StartupCard
                _id={post._id}
                title={post.title}
                _createdAt={formatDate(post._createdAt)}
                author={post.author}
                views={post.views}
                description={post.description}
                image={post.image}
                category={post.category}
              />
            </li>
          ))}
        </ul>
      )}
      {posts?.length === 0 && <p className="no-results">No stars found</p>}
    </>
  );
};
