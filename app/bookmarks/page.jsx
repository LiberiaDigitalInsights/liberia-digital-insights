import BookmarksClient from "@/components/bookmarks/BookmarksClient";

export const metadata = {
  title: "My Bookmarks",
  description: "View and manage your saved articles, events, and insights.",
};

export default function BookmarksPage() {
  return <BookmarksClient />;
}
